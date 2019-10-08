export const getRandomString = (length: number) => {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const result = [];

    for (let i = 0; i < length; i++) {
        result.push(charset[Math.floor(Math.random() * charset.length)]);
    }

    return result.join("");
};
