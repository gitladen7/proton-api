import * as t from "io-ts";
import { BaseAPIResponse } from "../schemas";

export const Key = t.type({
    ID: t.string,
    Version: t.number,
    Primary: t.number,
    PrivateKey: t.string,
    Fingerprint: t.string,
});

export const ProtonUser = t.type({
    ID: t.string,
    Name: t.string,
    UsedSpace: t.number,
    Currency: t.string,
    Credit: t.number,
    DisplayName: t.string,
    MaxSpace: t.number,
    MaxUpload: t.number,
    Subscribed: t.number,
    Services: t.number,
    Role: t.number,
    Private: t.number,
    Delinquent: t.number,
    Keys: t.array(Key),
});

export const UsersResponse = t.intersection([
    BaseAPIResponse,
    t.type({
        User: ProtonUser,
    }),
]);
