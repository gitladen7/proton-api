import BigNumber from "bignumber.js";
import randomBytes from "randombytes";
import { expandHash, hashPassword } from "./passwords";
import { toBN, fromBN } from "./utils/bigNumber";
import { SRP_LEN, MAX_VALUE_ITERATIONS } from "./constants";
import { getModulusWithoutVerification } from "./utils/modulusWorkaround";

const getRandomValues = (buf: Buffer) => randomBytes(buf.length);

const ZERO_BN = new BigNumber(0);
const ONE_BN = new BigNumber(1);
const TWO_BN = new BigNumber(2);

/**
 * @param {Buffer} arr
 * @return {Promise<Buffer>}
 */
export const srpHasher = (arr: Buffer) => expandHash(arr);

/**
 * Generate a random client secret.
 * @param {Number} len
 * @return {BigNumber}
 */
const generateClientSecret = (len: number) => toBN(getRandomValues(Buffer.alloc(len / 8)));

/**
 * Get the client secret. Loops until it finds a safe value.
 * @param {Number} len
 * @return {BigNumber}
 */
const getClientSecret = (len: number) => {
    const comparator = new BigNumber(len * 2);

    for (let i = 0; i < MAX_VALUE_ITERATIONS; ++i) {
        const clientSecret = generateClientSecret(len);

        if (clientSecret.isLessThanOrEqualTo(comparator)) {
            continue;
        }

        return clientSecret;
    }

    throw new Error("Could not find safe client value");
};

/**
 * Generate parameters.
 * @param {Object} params
 * @param {Number} params.len
 * @param {BigNumber} params.generator
 * @param {Modulus} params.modulus
 * @param {Buffer} params.serverEphemeralArray
 * @return {Promise<{clientSecret, clientEphemeral, scramblingParam}>}
 */
const generateParameters = async ({ len, generator, modulus, serverEphemeralArray }: { len: number, generator: BigNumber, modulus: BigNumber, serverEphemeralArray: Buffer }) => {
    const clientSecret = getClientSecret(len);
    const clientEphemeral = generator.exponentiatedBy(clientSecret, modulus);
    const clientEphemeralArray = fromBN(len, clientEphemeral);

    const clientServerHash = await srpHasher(Buffer.concat([clientEphemeralArray, serverEphemeralArray]));
    const scramblingParam = toBN(clientServerHash);

    return {
        clientSecret,
        clientEphemeral,
        scramblingParam,
    };
};

/**
 * Get parameters. Loops until it finds safe values.
 * @param {Number} len
 * @param {BigNumber} generator
 * @param {Modulus} modulus
 * @param {Buffer} serverEphemeralArray
 * @return {Promise<{clientSecret, clientEphemeral, scramblingParam}>}
 */
const getParameters = async ({ len, generator, modulus, serverEphemeralArray }: { len: number, generator: BigNumber, modulus: BigNumber, serverEphemeralArray: Buffer }) => {
    for (let i = 0; i < MAX_VALUE_ITERATIONS; ++i) {
        const { clientSecret, clientEphemeral, scramblingParam } = await generateParameters({
            len,
            generator,
            modulus,
            serverEphemeralArray,
        });

        if (scramblingParam.isEqualTo(ZERO_BN)) {
            continue;
        }

        return {
            clientSecret,
            clientEphemeral,
            scramblingParam,
        };
    }
    throw new Error("Could not find safe parameters");
};

/**
 * @param {Object} params
 * @param {Number} params.len - Size of the proof (bytes length)
 * @param {Buffer} params.modulusArray
 * @param {Buffer} params.hashedPasswordArray
 * @param {Buffer} params.serverEphemeralArray
 * @return {Promise}
 */
export const generateProofs = async ({ len, modulusArray, hashedPasswordArray, serverEphemeralArray }: { len: number, modulusArray: Buffer, hashedPasswordArray: Buffer, serverEphemeralArray: Buffer }) => {
    const modulusBn = toBN(modulusArray);
    /*if (modulusBn.bitLength !== len) {
        throw new Error('SRP modulus has incorrect size');
    }*/

    const generator = TWO_BN;

    const hashedArray = await srpHasher(Buffer.concat([fromBN(len, generator), modulusArray]));

    const multiplierBn = toBN(hashedArray);
    const serverEphemeral = toBN(serverEphemeralArray);
    const hashedPassword = toBN(hashedPasswordArray);


    const modulus = new BigNumber(modulusBn);
    const modulusMinusOne = modulus.minus(ONE_BN);
    const multiplierReduced = multiplierBn.mod(modulus);

    if (multiplierReduced.isLessThanOrEqualTo(ONE_BN) || multiplierReduced.isGreaterThanOrEqualTo(modulusMinusOne)) {
        throw new Error("SRP multiplier is out of bounds");
    }

    if (generator.isLessThanOrEqualTo(ONE_BN) || generator.isGreaterThanOrEqualTo(modulusMinusOne)) {
        throw new Error("SRP generator is out of bounds");
    }

    if (serverEphemeral.isLessThanOrEqualTo(ONE_BN) || serverEphemeral.isGreaterThanOrEqualTo(modulusMinusOne)) {
        throw new Error("SRP server ephemeral is out of bounds");
    }

    const { clientSecret, clientEphemeral, scramblingParam } = await getParameters({
        len,
        generator,
        modulus,
        serverEphemeralArray,
    });

    let subtracted = serverEphemeral.minus(
        generator.exponentiatedBy(hashedPassword, modulus).multipliedBy(multiplierReduced).mod(modulus)
    );

    if (subtracted.isLessThan(ZERO_BN)) {
        subtracted = subtracted.plus(modulus);
    }

    const exponent = scramblingParam
        .multipliedBy(hashedPassword)
        .plus(clientSecret)
        .modulo(modulus.minus(ONE_BN));

    const sharedSession = subtracted.exponentiatedBy(exponent, modulus);

    const clientEphemeralArray = fromBN(len, clientEphemeral);
    const sharedSessionArray = fromBN(len, sharedSession);

    const clientProof = await srpHasher(
        Buffer.concat([clientEphemeralArray, serverEphemeralArray, sharedSessionArray])
    );
    const expectedServerProof = await srpHasher(
        Buffer.concat([clientEphemeralArray, clientProof, sharedSessionArray])
    );

    return {
        clientEphemeral: clientEphemeralArray,
        clientProof,
        expectedServerProof,
        sharedSession: sharedSessionArray,
    };
};

/**
 * @param {Object} data - Auth info from the API
 * @param {String} data.Modulus - Base 64 encoded server modulus as a pgp signed message
 * @param {Number} data.Version - The auth version
 * @param {String} data.ServerEphemeral - Base64 encoded server ephemeral
 * @param {String} [data.Username] - The user name
 * @param {String} [data.Salt] - Base64 encoded salt
 * @param {Object} credentials - Credentials entered by the user
 * @param {String} [credentials.username] - Username entered
 * @param {String} credentials.password - Password entered
 * @param {Number} [authVersion] - The auth version
 * @return {Promise}
 */
export const getSrp = async (
    { Version, Modulus: serverModulus, ServerEphemeral, Username, Salt }: { Version: number, Modulus: string, ServerEphemeral: string, Username: string, Salt: string },
    { password }: { password: string },
    authVersion = Version
) => {
    const modulusArray = await getModulusWithoutVerification(serverModulus);

    const serverEphemeralArray = Buffer.from(ServerEphemeral, "base64");

    const hashedPasswordArray = await hashPassword({
        version: authVersion,
        password,
        salt: authVersion < 3 ? undefined : Buffer.from(Salt, "base64").toString("binary"),
        username: authVersion < 3 ? Username : undefined,
        modulus: modulusArray,
    });

    const { clientEphemeral, clientProof, expectedServerProof, sharedSession } = await generateProofs({
        len: SRP_LEN,
        modulusArray,
        hashedPasswordArray,
        serverEphemeralArray,
    });

    return {
        clientEphemeral: clientEphemeral.toString("base64"),
        clientProof: clientProof.toString("base64"),
        expectedServerProof: expectedServerProof.toString("base64"),
        sharedSession,
    };
};
