import * as t from "io-ts";
import { BaseAPIResponse } from "../schemas";

export const Sender = t.type({
    Address: t.string,
    Name: t.string,
});


export const Recipient = t.type({
    Name: t.string,
    Address: t.string,
});

export const MessageMetadata = t.type({
    ID: t.string,
    Order: t.number,
    ConversationID: t.string,
    Subject: t.string,
    Unread: t.number,
    SenderAddress: t.string,
    SenderName: t.string,
    Sender: Sender,
    Flags: t.number,
    Type: t.number,
    IsEncrypted: t.number,
    IsReplied: t.number,
    IsRepliedAll: t.number,
    IsForwarded: t.number,
    ToList: t.array(Recipient),
    CCList: t.array(Recipient),
    BCCList: t.array(Recipient),
    Time: t.number,
    Size: t.number,
    NumAttachments: t.number,
    ExpirationTime: t.number,
    AddressID: t.string,
    ExternalID: t.union([t.string, t.null]),
    LabelIDs: t.array(t.union([t.number, t.string])),
});

export const MessagesListResponse = t.intersection([
    BaseAPIResponse,
    t.type({
        Total: t.number,
        Limit: t.number,
        Messages: t.array(MessageMetadata),
    }),
]);

export const Attachment = t.type({
    ID: t.string,
    Name: t.string,
    Size: t.number,
    MIMEType: t.string,
    KeyPackets: t.string,
    Headers: t.record(t.string, t.union([t.string, t.array(t.string)])),
    Signature: t.string,
});

export const Message = t.intersection([
    MessageMetadata,
    t.type({
        Body: t.string,
        MIMEType: t.string,
        Header: t.string,
        ParsedHeaders: t.record(t.string, t.union([t.string, t.array(t.string)])),
        ReplyTo: Recipient,
        ReplyTos: t.array(Recipient),
        Attachments: t.array(Attachment),
    }),
]);

export const MessagesGetResponse = t.intersection([
    BaseAPIResponse,
    t.type({
        Message: Message,
    }),
]);

export const MessagesCountItem = t.type({
    LabelID: t.union([t.number, t.string]),
    Total: t.number,
    Unread: t.number,
});

export const MessagesCountResponse = t.intersection([
    BaseAPIResponse,
    t.type({
        Counts: t.array(MessagesCountItem),
    }),
]);

export const FlagMessageResponseItem = t.type({
    ID: t.string,
    Response: BaseAPIResponse,
});

export const FlagMessageResponse = t.intersection([
    BaseAPIResponse,
    t.type({
        Responses: t.array(FlagMessageResponseItem),
    }),
]);
