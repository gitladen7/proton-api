/**
 * Extract modulus without verification
 * @param {String} modulus - Armored modulus string
 * @returns {Promise<Uint8Array>}
 */
export const getModulusWithoutVerification = async (modulus: string) => {
    const base64Modulus = modulus.split("\n").find((l) => l.length > 60);
    if (base64Modulus === undefined) {
        throw new Error(`could not extract modulus from ${modulus}`);
    }
    return Buffer.from(base64Modulus, "base64");
};
