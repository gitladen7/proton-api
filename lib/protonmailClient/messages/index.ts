import { ProtonmailClient } from "../index";
import { IMessageListArgs, IMessagesListResponse, IMessagesGetResponse, IMessagesCountResponse, IMessagesFlagResponse } from "./types";
import { queryStringStringify } from "../../helpers/queryStringStringify";
import { DefaultLabels } from "../labels/types";

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

    public async markAsRead(IDs: string[]) {
        const response = await this.client.request<IMessagesFlagResponse>({
            method: "put",
            url: "messages/read",
            data: {
                IDs,
            },
        });
        return response.data;
    }

    public async markAsUnread(IDs: string[]) {
        const response = await this.client.request<IMessagesFlagResponse>({
            method: "put",
            url: "messages/unread",
            data: {
                IDs,
            },
        });
        return response.data;
    }

    public async label(IDs: string[], labelId: DefaultLabels | number | string) {
        const response = await this.client.request<IMessagesFlagResponse>({
            method: "put",
            url: "messages/label",
            data: {
                IDs,
                LabelID: labelId,
            },
        });
        return response.data;
    }

    public async unlabel(IDs: string[], labelId: DefaultLabels | number | string) {
        const response = await this.client.request<IMessagesFlagResponse>({
            method: "put",
            url: "messages/label",
            data: {
                IDs,
                LabelID: labelId,
            },
        });
        return response.data;
    }
}
