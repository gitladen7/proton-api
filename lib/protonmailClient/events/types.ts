import { IBaseAPIResponse } from "../types";
import { IMessagesCountItem, IMessageMetadata } from "../messages/types";
import { ILabel } from "../labels/types";


export interface IEventsMessageCountLocationItem {
    Location: number;
    Count: number;
}

export interface IEventsMessageCountLabelItem {
    LabelID: string;
    Count: number;
}

export interface IEventsMessageCount {
    Locations: IEventsMessageCountLocationItem[];
    Labels: IEventsMessageCountLabelItem[];
    Starred: number;
}

export interface IEventsMessage {
    ID: string;
    Action: number;
    Message?: IMessageMetadata;
}

export interface IEventsLabel {
    ID: string;
    Action: number;
    Label: ILabel;
}

export interface IEventsGetResponse extends IBaseAPIResponse {
    EventID: string;
    Refresh?: number;
    More?: number;
    Labels?: IEventsLabel[];
    Messages?: IEventsMessage[];
    Conversations?: IEventsMessage[];
    Total?: IEventsMessageCount;
    Unread?: IEventsMessageCount;
    MessageCounts?: IMessagesCountItem[];
}
