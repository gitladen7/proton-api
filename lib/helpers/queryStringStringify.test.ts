import { queryStringStringify } from "./queryStringStringify";

test("queryStringStringify works", () => {
    const testObj = {
        key1: "asd&",
        key2: 1,
        key3: false,
        key4: undefined,
    };
    expect(queryStringStringify(testObj)).toBe("key1=asd%26&key2=1&key3=0");
});
