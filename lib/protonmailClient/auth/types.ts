import { IBaseAPIResponse } from "../types";

export interface ILoginInformation {
    username: string;
    loginPassword: string;
    otpToken?: string;
}

export interface ITokenLoginInformation {
    Uid: string;
    RefreshToken: string;
}

export interface IAuthInfoResponse extends IBaseAPIResponse {
    Modulus: string;
    ServerEphemeral: string;
    Version: number;
    Salt: string;
    SRPSession: string;
    TwoFactor: number;
    "2FA": {
        Enabled: number;
        U2F: null;
        TOTP: number;
    }
}

export interface IAuthRequest {
    ClientProof: string;
    ClientEphemeral: string;
    SRPSession: string;
    Username: string;
}

export interface IAuthResponse extends IBaseAPIResponse {
    AccessToken: string;
    ExpiresIn: number;
    TokenType: string;
    Scope: string;
    Uid: string;
    UID: string;
    UserID: string;
    RefreshToken: string;
    EventID: string;
    PasswordMode: number;
    TwoFactor: number;
    "2FA": {
        Enabled: number;
        U2F: null;
        TOTP: number;
    }
    PrivateKey: string;
    EncPrivateKey: string;
    KeySalt: string;
    ServerProof: string;
}

export interface IAuth2FARequest {
    TwoFactorCode?: string;
}

export interface IAuth2FAResponse extends IBaseAPIResponse {
    Scope: string;
}

export interface IAuthRefreshResponse extends IBaseAPIResponse {
    AccessToken: string;
    ExpiresIn: number;
    TokenType: string;
    Scope: string;
    Uid: string;
    UID: string;
    RefreshToken: string;
}
