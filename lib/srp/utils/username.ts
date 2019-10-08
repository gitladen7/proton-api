/**
 * Clean the username, remove underscore, dashes, dots and lowercase.
 * @param {String} name
 * @returns {string}
 */
export const cleanUsername = (name = "") => name.replace(/[.\-_]/g, "").toLowerCase();
