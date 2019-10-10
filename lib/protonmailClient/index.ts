import axios, { AxiosTransformer, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { RateLimiter, wait } from "../helpers/rateLimiter";

import { IAuthInfoResponse, IAuthRequest, IAuthResponse, ILoginInformation, IAuthRefreshResponse, ITokenLoginInformation, IAuth2FARequest, IAuth2FAResponse } from "./auth/types";
import { getRandomString } from "../helpers/randomString";
import { getSrp } from "../srp/srp";
import { UsersRoutes } from "./users/index";
import { LabelsRoutes } from "./labels/index";
import { MessagesRoutes } from "./messages/index";
import { EventEmitter } from "events";
import { IBaseAPIResponse } from "./types";

export interface IProtonmailClientOptions {
    rateLimit: boolean;
    userAgent: string;
}

export declare interface ProtonmailClient {
    on(event: "logout", listener: () => void): this;

    on(event: string, listener: Function): this;
}

export class ProtonmailClient extends EventEmitter {
    private axios: AxiosInstance;
    private isloggedIn_: boolean = false;
    private refreshingToken_: boolean = false;
    private accessToken_: string = "";
    private refreshToken_: string = "";
    private pmUID_: string = "";
    private rateLimiter: RateLimiter = new RateLimiter();
    private options: IProtonmailClientOptions = {
        rateLimit: true,
        userAgent: "Mozilla/5.0 (Windows NT 6.1; rv:60.0) Gecko/20100101 Firefox/60.0",
    }

    private get pmUID(): string {
        return this.pmUID_;
    }

    private set pmUID(v: string) {
        this.pmUID_ = v;
        this.axios = this.createAxiosInstance();
    }

    private get accessToken(): string {
        return this.accessToken_;
    }

    private set accessToken(v: string) {
        this.accessToken_ = v;
        this.axios = this.createAxiosInstance();
    }

    private get refreshToken(): string {
        return this.refreshToken_;
    }

    private set refreshToken(v: string) {
        this.refreshToken_ = v;
    }

    private users_: UsersRoutes;
    public get users(): UsersRoutes {
        return this.users_;
    }

    private labels_: LabelsRoutes;
    public get labels(): LabelsRoutes {
        return this.labels_;
    }

    private messages_: MessagesRoutes;
    public get messages(): MessagesRoutes {
        return this.messages_;
    }

    public get isLoggedIn(): boolean {
        return this.isloggedIn_;
    }

    constructor(options?: Partial<IProtonmailClientOptions>) {
        super();
        this.users_ = new UsersRoutes(this);
        this.labels_ = new LabelsRoutes(this);
        this.messages_ = new MessagesRoutes(this);

        if (options) {
            if (typeof options.userAgent === "string") {
                this.options.userAgent = options.userAgent;
            }

            if (typeof options.rateLimit === "boolean") {
                this.options.rateLimit = options.rateLimit;
            }
        }

        this.axios = this.createAxiosInstance();
    }

    private createAxiosInstance(): AxiosInstance {
        const ar: AxiosTransformer[] = [];
        const transformResponse = ar.concat(
            axios.defaults.transformResponse!,
            (data: IBaseAPIResponse) => {
                return data;
            }
        );

        const headers: any = {
            "Accept": "application/vnd.protonmail.v1+json",
            "User-Agent": this.options.userAgent,
            "x-pm-apiversion": "3",
            "x-pm-appversion": "Other",
        };

        if (typeof window !== "undefined") {
            delete headers["User-Agent"];
        }

        if (this.pmUID !== "") {
            headers["x-pm-uid"] = this.pmUID;
        }

        if (this.accessToken !== "") {
            headers.Authorization = `Bearer ${this.accessToken}`;
        }

        return axios.create({
            transformResponse,
            baseURL: "https://mail.protonmail.com/api/",
            headers,
        });
    }

    public async request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        if (this.options.rateLimit) {
            await this.rateLimiter.wait();
        }

        while (this.refreshingToken_ && config.url !== "auth/refresh") {
            await wait(100);
        }

        try {
            const response = await this.axios.request<T>(config);
            return response;
        } catch (error) {
            try {
                if (error.response.status === 401 &&
                    config.url !== "auth/refresh" &&
                    this.refreshToken !== "") {
                    if (!this.refreshingToken_) {
                        this.refreshingToken_ = true;
                        await this.loginWithToken({
                            RefreshToken: this.refreshToken,
                            Uid: this.pmUID,
                        });
                        this.refreshingToken_ = false;
                    }
                    return this.request<T>(config);
                }
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 422) {
                        this.isloggedIn_ = false;
                        this.emit("logout");
                    }
                }
                this.refreshingToken_ = false;
            }
            throw error;
        }
    }

    public async loginWithToken(loginInformation: ITokenLoginInformation) {
        this.pmUID = loginInformation.Uid;
        const response = await this.authRefresh(loginInformation.RefreshToken, loginInformation.Uid);
        this.accessToken = response.AccessToken;
        this.refreshToken = response.RefreshToken;
        this.pmUID = response.Uid;
        this.isloggedIn_ = true;
        this.emit("refresh_token_change");
        return response;
    }

    public getTokenLoginInformation(): ITokenLoginInformation {
        return {
            Uid: this.pmUID,
            RefreshToken: this.refreshToken,
        };
    }

    public async login(loginInformation: ILoginInformation) {
        const username = loginInformation.username.replace(/@.*$/g, "");
        const authInfoResponse = await this.authInfo(username);
        const req = await getSrp({
            Version: authInfoResponse.Version,
            Modulus: authInfoResponse.Modulus,
            ServerEphemeral: authInfoResponse.ServerEphemeral,
            Username: username,
            Salt: authInfoResponse.Salt,
        }, {
            password: loginInformation.loginPassword,
        }, authInfoResponse.Version);

        const authData: IAuthRequest = {
            ClientProof: req.clientProof,
            ClientEphemeral: req.clientEphemeral,
            SRPSession: authInfoResponse.SRPSession,
            Username: username,
        };

        const authResponse = await this.auth(authData);

        if (req.expectedServerProof !== authResponse.ServerProof) {
            throw new Error("Unexpected server proof");
        }

        // only needed for encrypted access tokens, apparently api doesnt send them anymore
        // const accessToken = await getAccessToken(authResponse.AccessToken, authResponse.PrivateKey, authResponse.KeySalt, info.mailboxPassword || info.loginPassword);

        const accessToken = authResponse.AccessToken;
        if (/^-----BEGIN PGP MESSAGE-----/.test(accessToken)) {
            throw new Error("Encrypted access tokens are not supported :^(");
        }

        const twoFactorEnabled = authResponse["2FA"].Enabled === 1;

        if (twoFactorEnabled &&
            authResponse["2FA"].TOTP === 0) {
            throw new Error("Unsupported 2FA type");
        }

        if (twoFactorEnabled &&
            typeof loginInformation.otpToken !== "string"
        ) {
            throw new Error("2FA is enabled on the account so you have to provide a 2FA token");
        }

        this.accessToken = accessToken;
        this.refreshToken = authResponse.RefreshToken;
        this.pmUID = authResponse.Uid;
        this.emit("refresh_token_change");

        if (twoFactorEnabled) {
            await this.auth2FA({
                TwoFactorCode: `${loginInformation.otpToken}`,
            });
        }

        this.isloggedIn_ = true;
    }

    public async logout(): Promise<{}> {
        const response = await this.request<{}>({
            method: "delete",
            url: "auth",
        });
        this.accessToken = "";
        this.pmUID = "";
        this.refreshToken = "";
        return response.data;
    }

    private async authInfo(username: string) {
        const response = await this.axios.post<IAuthInfoResponse>("auth/info", {
            Username: username,
        });
        return response.data;
    }

    private async auth(obj: IAuthRequest) {
        const response = await this.axios.post<IAuthResponse>("auth", obj);
        return response.data;
    }

    private async auth2FA(obj: IAuth2FARequest) {
        const response = await this.axios.post<IAuth2FAResponse>("auth/2fa", obj);
        return response.data;
    }

    private async authRefresh(refreshToken: string, uid: string) {
        const response = await this.request<IAuthRefreshResponse>({
            method: "post",
            url: "auth/refresh",
            data: {
                GrantType: "refresh_token",
                RedirectURI: "https://protonmail.com",
                RefreshToken: refreshToken,
                ResponseType: "token",
                State: getRandomString(24),
                UID: uid,
            },
        });
        return response.data;
    }
}
