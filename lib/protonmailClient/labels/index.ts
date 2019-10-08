import { ProtonmailClient } from "../index";
import { ILabelsListArgs, ILabelsListResponse } from "./types";
import { queryStringStringify } from "../../helpers/queryStringStringify";

export class LabelsRoutes {
    private client: ProtonmailClient;

    constructor(client: ProtonmailClient) {
        this.client = client;
    }

    public async list(args: ILabelsListArgs) {
        const response = await this.client.request<ILabelsListResponse>({
            method: "get",
            url: `labels?${queryStringStringify(args)}`,
        });
        return response.data;
    }
}
