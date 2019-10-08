import bcrypt from "bcryptjs";
import createHash from "create-hash";

import { cleanUsername } from "./utils/username";
import { BCRYPT_PREFIX } from "./constants";

export const encodeUtf8 = (input: string) => unescape(encodeURIComponent(input));

/**
 * Expand a hash
 * @param {Buffer} input
 * @returns {Promise<Buffer>}
 */
export const expandHash = async (input: Buffer) => {
    const promises = [];
    const arr = Buffer.concat([input, Buffer.from([0])]);
    for (let i = 1; i <= 4; i++) {
        promises.push((createHash("sha512") as any).update(arr).digest());
        arr[arr.length - 1] = i;
    }
    return Buffer.concat(await Promise.all(promises));
};

/**
 * Format a hash
 * @param {String} password
 * @param {String} salt
 * @param {Buffer} modulus
 * @returns {Promise<Buffer>}
 */
const formatHash = async (password: string, salt: string, modulus: Buffer) => {
    const unexpandedHash = await bcrypt.hash(password, BCRYPT_PREFIX + salt);
    return expandHash(Buffer.concat([Buffer.from(unexpandedHash), modulus]));
};

/**
 * Hash password in version 3.
 * @param {String} password
 * @param {String} salt
 * @param {Buffer} modulus
 * @returns {Promise<Buffer>}
 */
const hashPassword3 = (password: string, salt: string, modulus: Buffer) => {
    const saltBinary = Buffer.from(salt + "proton", "binary");
    return formatHash(password, bcrypt.encodeBase64(saltBinary, 16), modulus);
};

/**
 * Hash password in version 1.
 * @param {String} password
 * @param {String} username
 * @param {Buffer} modulus
 * @returns {Promise<Buffer>}
 */
const hashPassword1 = async (password: string, username: string, modulus: Buffer) => {
    const value = Buffer.from(encodeUtf8(username.toLowerCase()));
    const salt = (createHash("md5") as any).update(value).digest("hex");
    return formatHash(password, salt, modulus);
};

/**
 * Hash password in version 0.
 * @param {String} password
 * @param {String} username
 * @param {Buffer} modulus
 * @returns {Promise<Buffer>}
 */
const hashPassword0 = async (password: string, username: string, modulus: Buffer) => {
    const prehashed = (createHash("sha512") as any).update(Buffer.from(username.toLowerCase() + encodeUtf8(password))).digest("base64");
    return hashPassword1(prehashed, username, modulus);
};

/**
 * Hash a password.
 * @param {String} password
 * @param {String} salt
 * @param {String} username
 * @param {Buffer} modulus
 * @param {Number} version
 * @returns {Promise<Buffer>}
 */
export const hashPassword = ({ password, salt, username, modulus, version }: { password: string, salt: string | undefined, username: string | undefined, modulus: Buffer, version: number }) => {
    if (version === 4 || version === 3) {
        return hashPassword3(password, salt as string, modulus);
    }

    if (version === 2) {
        return hashPassword1(password, cleanUsername(username), modulus);
    }

    if (version === 1) {
        return hashPassword1(password, username as string, modulus);
    }

    if (version === 0) {
        return hashPassword0(password, username as string, modulus);
    }

    throw new Error("Unsupported auth version");
};
