import * as t from "io-ts";
import { BaseAPIResponse } from "../schemas";

export const Session = t.interface({
    ClientID: t.string,
    CreateTime: t.number,
    SessionID: t.number,
    UnlockExpirationTime: t.number,
    ParentUID: t.null,
    UID: t.string,
    Scope: t.number,
    CookieUID: t.union([t.string, t.null]),
    ExpirationTime: t.number,
    RefreshCounter: t.number,
    Flags: t.number,
    ProvisionalRefreshToken: t.null,
    AccessExpirationTime: t.number,
    Algo: t.number,
    UserID: t.string,
    OwnerUserID: t.null,
    LocalizedClientName: t.string,
    MemberID: t.null,
    Revocable: t.number,
});

export const SessionsListResponse = t.intersection([
    BaseAPIResponse,
    t.type({
        Sessions: t.array(Session),
    }),
]);
