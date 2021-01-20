import { IBaseAPIResponse } from "../types";
import { DefaultLabels } from "../labels/types";

export interface ISender {
    Address: string;
    Name: string;
}

export interface IRecipient {
    Name: string;
    Address: string;
}

export interface IMessageMetadata {
    ID: string;
    Order: number;
    ConversationID: string;
    Subject: string;
    Unread: number;
    SenderAddress: string;
    SenderName: string;
    Sender: ISender;
    Flags: number;
    Type: number;
    IsEncrypted: number;
    IsReplied: number;
    IsRepliedAll: number;
    IsForwarded: number;
    ToList: IRecipient[];
    CCList: IRecipient[];
    BCCList: IRecipient[];
    Time: number;
    Size: number;
    NumAttachments: number;
    ExpirationTime: number;
    AddressID: string;
    ExternalID: string | null;
    Starred: number;
    Location: number;
    LabelIDs: (DefaultLabels | number | string)[];
}

export interface IMessagesListResponse extends IBaseAPIResponse {
    Total: number;
    Limit: number;
    Messages: IMessageMetadata[];
}

export interface IMessageListArgs {
    LabelID: DefaultLabels | number | string;
    Limit: number;
    Page: number;
    Unread?: boolean;
}

export interface IAttachment {
    ID: string;
    Name: string;
    Size: number;
    MIMEType: string;
    KeyPackets: string;
    Headers: { [name: string]: string; }
    Signature: string;
}

export interface IMessage extends IMessageMetadata {
    Body: string;
    MIMEType: string;
    Header: string;
    ParsedHeaders: { [name: string]: string; }
    ReplyTo: IRecipient;
    ReplyTos: IRecipient[];
    Attachments: IAttachment[];
}

export interface IMessagesGetResponse extends IBaseAPIResponse {
    Message: IMessage;
}

export interface IMessagesCountItem {
    LabelID: DefaultLabels | number | string;
    Total: number;
    Unread: number;
}

export interface IMessagesCountResponse extends IBaseAPIResponse {
    Counts: IMessagesCountItem[];
}

export interface IFlagMessageResponse {
    ID: string;
    Response: IBaseAPIResponse;
}

export interface IMessagesFlagResponse extends IBaseAPIResponse {
    Responses: IFlagMessageResponse[];
}
