import * as t from "io-ts";
import { BaseAPIResponse } from "../schemas";

export const Label = t.interface({
    ID: t.string,
    Name: t.string,
    Color: t.string,
    Order: t.number,
    Notify: t.number,
    Path: t.string,
    Type: t.number,
    Display: t.number,
    Exclusive: t.number,
});

export const LabelsListResponse = t.intersection([
    BaseAPIResponse,
    t.type({
        Labels: t.array(Label),
    }),
]);
