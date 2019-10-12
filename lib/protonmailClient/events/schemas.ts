import * as t from "io-ts";
import { BaseAPIResponse } from "../schemas";
import { MessageMetadata } from "../messages/schemas";
import { Label } from "../labels/schemas";

export const EventsMessageCountLocationItem = t.interface({
    Location: t.number,
    Count: t.number,
});

export const EventsMessageCountLabelItem = t.interface({
    LabelID: t.string,
    Count: t.number,
});

export const EventsMessageCount = t.interface({
    Locations: t.array(EventsMessageCountLocationItem),
    Labels: t.array(EventsMessageCountLabelItem),
    Starred: t.number,
});

export const EventsMessage = t.interface({
    ID: t.string,
    Action: t.number,
    Message: MessageMetadata,
});

export const EventsLabel = t.interface({
    ID: t.string,
    Action: t.number,
    Label: Label,
});


export const EventsGetResponse = t.intersection([
    BaseAPIResponse,
    t.type({
        EventID: t.string,
        Refresh: t.union([t.number, t.undefined]),
        More: t.union([t.number, t.undefined]),
        Messages: t.union([t.array(EventsMessage), t.undefined]),
        Labels: t.union([t.array(EventsLabel), t.undefined]),
        Conversations: t.union([t.array(EventsMessage), t.undefined]),
        Total: t.union([EventsMessageCount, t.undefined]),
        Unread: t.union([EventsMessageCount, t.undefined]),
    }),
]);
