import { ProtonmailClient } from "../index";
import { IUsersResponse } from "./types";

export class UsersRoutes {
    private client: ProtonmailClient;

    constructor(client: ProtonmailClient) {
        this.client = client;
    }

    public async me() {
        const response = await this.client.request<IUsersResponse>({
            method: "get",
            url: "users",
        });
        return response.data;
    }
}
