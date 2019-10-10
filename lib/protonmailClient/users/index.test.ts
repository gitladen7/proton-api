import { ProtonmailClient } from "../index";
import { UsersResponse } from "./schemas";
import { expectToValidate } from "../schemas";

test("user route works", async () => {
    const client = new ProtonmailClient();
    await client.login(require("../../../credentials.json"));

    const usersResponse = await client.users.me();

    const v = UsersResponse.decode(usersResponse);
    expectToValidate(v);
}, 120000);
