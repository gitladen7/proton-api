import BigNumber from "bignumber.js";

/**
 * From Buffer to big number
 * @param {Buffer} arr
 * @return {BigNumber}
 */
export const toBN = (arr: Buffer) => {
    const reversed = Buffer.alloc(arr.length);
    for (let i = 0; i < arr.length; i++) {
        reversed[arr.length - i - 1] = arr[i];
    }
    return new BigNumber(reversed.toString("hex"), 16);
};

/**
 * From big number to Buffer
 * @param {Number} len
 * @param {BigNumber} bn
 * @return {Buffer}
 */
export const fromBN = (len: number, bn: BigNumber) => {
    let str = bn.toString(16);
    if (str.length % 2 !== 0) {
        str = `0${str}`;
    }
    const arr = Buffer.from(str, "hex");
    const reversed = new Buffer(len / 8);
    for (let i = 0; i < arr.length; i++) {
        reversed[arr.length - i - 1] = arr[i];
    }

    return reversed;
};
