import * as t from "io-ts";
import { isLeft } from "fp-ts/lib/Either";

export const expectToValidate = <A>(v: t.Validation<A>): void => {
    const arr = !isLeft(v) ? [] : v.left.map(error => `${error.context.map(({ key }) => key).join(".")} ${error.message}`);
    expect(arr).toEqual([]);
};

export const BaseAPIResponse = t.interface({
    Code: t.number,
});
