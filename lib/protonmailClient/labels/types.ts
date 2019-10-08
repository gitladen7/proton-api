import { IBaseAPIResponse } from "../types";

export enum DefaultLabels {
    Inbox = 0,
    SelfSent = 1,
    Sent2 = 2,
    Trash = 3,
    Spam = 4,
    All = 5,
    Archive = 6,
    Sent = 7,
    Drafts = 8,
    Starred = 10,
}

export enum LabelType {
    Label = 1,
    Folder = 2,
}

export interface ILabel {
    ID: string,
    Name: string,
    Color: string,
    Order: number,
    Notify: number,
    Path: string,
    Type: LabelType,
    Display: number,
    Exclusive: number,
}

export interface ILabelsListResponse extends IBaseAPIResponse {
    Labels: ILabel[];
}

export interface ILabelsListArgs {
    Type: LabelType,
}
