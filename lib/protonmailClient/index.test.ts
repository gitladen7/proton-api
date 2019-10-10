import { ProtonmailClient } from "./index";

test("login works", async () => {
    const client = new ProtonmailClient();
    await client.login(require("../../credentials.json"));
}, 120000);
