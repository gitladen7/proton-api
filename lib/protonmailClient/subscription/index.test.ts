import { ProtonmailClient } from "../index";
import { expectToValidate } from "../schemas";
import { SubscriptionGetResponse } from "./schemas";

test("subscription get route fails with no subscription", async () => {
    const client = new ProtonmailClient();
    await client.login(require("../../../credentials.json"));

    try {
        const subscriptionResponse = await client.subscription.get();
        const v = SubscriptionGetResponse.decode(subscriptionResponse);
        expectToValidate(v);
        throw new Error("");
    } catch (error) {
        expect((error as any).response.status).toEqual(422);
        expect((error as any).response.data).toEqual({
            Code: 22110,
            Details: {
            },
            Error: "You do not have an active subscription",
        });

    }

}, 120000);
