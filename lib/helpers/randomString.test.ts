import { getRandomString } from "./randomString";

test("length is correct", () => {
    expect(getRandomString(10).length).toBe(10);
});
