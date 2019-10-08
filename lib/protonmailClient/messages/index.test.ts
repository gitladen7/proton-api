import { ProtonmailClient } from "../index";
import { DefaultLabels } from "../labels/types";
import { MessagesCountResponse, MessagesListResponse, MessagesGetResponse } from "./schemas";
import { expectToValidate } from "../schemas";

test("messages count route works", async () => {
    const client = new ProtonmailClient();
    await client.login(require("../../../credentials.json"));

    const countResponse = await client.messages.count();
    const v = MessagesCountResponse.decode(countResponse);
    expectToValidate(v);
}, 30000);

test("messages list route works", async () => {
    const client = new ProtonmailClient();
    await client.login(require("../../../credentials.json"));

    const messagesResponse = await client.messages.list({
        LabelID: DefaultLabels.All,
        Limit: 10,
        Page: 0,
    });

    const v = MessagesListResponse.decode(messagesResponse);
    expectToValidate(v);
}, 30000);

test("messages get route works", async () => {
    const client = new ProtonmailClient();
    await client.login(require("../../../credentials.json"));

    const messagesResponse = await client.messages.list({
        LabelID: DefaultLabels.All,
        Limit: 10,
        Page: 0,
    });

    const firstMessage = messagesResponse.Messages[0]!;
    const messageResponse = await client.messages.get(firstMessage.ID);
    const v = MessagesGetResponse.decode(messageResponse);
    expectToValidate(v);
}, 30000);
