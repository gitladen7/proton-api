import { ProtonmailClient } from "../index";
import { ISessionsListResponse, ISessionsRevokeResponse } from "./types";

export class SessionsRoutes {
    private client: ProtonmailClient;

    constructor(client: ProtonmailClient) {
        this.client = client;
    }

    public async list() {
        const response = await this.client.request<ISessionsListResponse>({
            method: "get",
            url: "auth/v4/sessions",
        });
        return response.data;
    }

    public async revokeAllOtherSessions() {
        const response = await this.client.request<ISessionsRevokeResponse>({
            method: "delete",
            url: "auth/v4/sessions",
        });
        return response.data;
    }

    public async revoke(sessionUID: string) {
        const response = await this.client.request<ISessionsRevokeResponse>({
            method: "delete",
            url: `auth/v4/sessions/${sessionUID}`,
        });
        return response.data;
    }
}
