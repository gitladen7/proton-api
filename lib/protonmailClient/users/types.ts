import { IBaseAPIResponse } from "../types";

export interface IKey {
    ID: string,
    Version: number,
    Primary: number,
    PrivateKey: string,
    Fingerprint: string,
}


export interface IProtonUser {
    ID: string,
    Name: string,
    UsedSpace: number,
    Currency: string,
    Credit: number,
    DisplayName: string,
    MaxSpace: number,
    MaxUpload: number,
    Subscribed: number,
    Services: number,
    Role: number,
    Private: number,
    Delinquent: number,
    Keys: IKey[],
}


export interface IUsersResponse extends IBaseAPIResponse {
    User: IProtonUser,
}
