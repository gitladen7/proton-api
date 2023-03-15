import { ProtonmailClient } from "../index";
import { SessionsListResponse } from "./schemas";
import { expectToValidate } from "../schemas";

test("sessions list route works", async () => {
    const client = new ProtonmailClient();
    await client.login(require("../../../credentials.json"));

    const sessionsResponse = await client.sessions.list();

    const v = SessionsListResponse.decode(sessionsResponse);
    expectToValidate(v);
}, 120000);
