import { ProtonmailClient } from "../index";
import { LabelType } from "./types";
import { LabelsListResponse } from "./schemas";
import { expectToValidate } from "../schemas";

test("labels list route works", async () => {
    const client = new ProtonmailClient();
    await client.login(require("../../../credentials.json"));

    const labelsResponse = await client.labels.list({
        Type: LabelType.Label,
    });

    const v = LabelsListResponse.decode(labelsResponse);
    expectToValidate(v);
}, 120000);
