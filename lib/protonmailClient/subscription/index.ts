import { ProtonmailClient } from "../index";
import { ISubscriptionsGetResponse } from "./types";

export class SubscriptionRoutes {
    private client: ProtonmailClient;

    constructor(client: ProtonmailClient) {
        this.client = client;
    }

    public async get() {
        const response = await this.client.request<ISubscriptionsGetResponse>({
            method: "get",
            url: "payments/v4/subscription",
        });
        return response.data;
    }
}
