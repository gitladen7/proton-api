import { ProtonmailClient } from "../index";
import { IEventsGetResponse } from "./types";

export class EventsRoutes {
    private client: ProtonmailClient;

    constructor(client: ProtonmailClient) {
        this.client = client;
    }

    public async latest() {
        const response = await this.client.request<IEventsGetResponse>({
            method: "get",
            url: "events/latest",
        });
        return response.data;
    }

    public async get(id: string) {
        const response = await this.client.request<IEventsGetResponse>({
            method: "get",
            url: `events/${id}`,
        });
        return response.data;
    }

}
