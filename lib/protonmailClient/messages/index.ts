import { ProtonmailClient } from "../index";
import { IMessageListArgs, IMessagesListResponse, IMessagesGetResponse, IMessagesCountResponse } from "./types";
import { queryStringStringify } from "../../helpers/queryStringStringify";

export class MessagesRoutes {
    private client: ProtonmailClient;

    constructor(client: ProtonmailClient) {
        this.client = client;
    }

    public async list(args: IMessageListArgs) {
        const url = `messages?${queryStringStringify(args)}`;

        const response = await this.client.request<IMessagesListResponse>({
            method: "get",
            url,
        });
        return response.data;
    }

    public async get(id: string) {
        const response = await this.client.request<IMessagesGetResponse>({
            method: "get",
            url: `messages/${encodeURIComponent(id)}`,
        });
        return response.data;
    }

    public async count() {
        const response = await this.client.request<IMessagesCountResponse>({
            method: "get",
            url: "messages/count",
        });
        return response.data;
    }
}
