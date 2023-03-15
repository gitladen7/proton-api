import { IBaseAPIResponse } from "../types";

export interface ISession {
    ClientID: string,
    CreateTime: number,
    SessionID: number,
    UnlockExpirationTime: number,
    ParentUID: null,
    UID: string,
    Scope: number,
    CookieUID: string | null,
    ExpirationTime: number,
    RefreshCounter: number,
    Flags: number,
    ProvisionalRefreshToken: null,
    AccessExpirationTime: number,
    Algo: number,
    UserID: string,
    OwnerUserID: null,
    LocalizedClientName: string,
    MemberID: null,
    Revocable: number,
}

export interface ISessionsListResponse extends IBaseAPIResponse {
    Sessions: ISession[];
}

export interface ISessionsRevokeResponse extends IBaseAPIResponse {
}
