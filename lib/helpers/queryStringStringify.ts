export function queryStringStringify(obj: any) {
    const res: string[] = [];
    for (const key in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (typeof value === "undefined") {
                continue;
            }

            let encodedValue = encodeURIComponent(value);
            if (typeof value === "boolean") {
                encodedValue = value ? "1" : "0";
            }

            res.push(`${key}=${encodedValue}`);
        }
    }

    return res.join("&");
}
