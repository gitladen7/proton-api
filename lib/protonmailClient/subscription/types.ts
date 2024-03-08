import { IBaseAPIResponse } from "../types";

export interface ISubscription {
    ID: string,
    InvoiceID: string,
    Cycle: number,
    PeriodStart: number,
    PeriodEnd: number,
    CreateTime: number,
    CouponCode: string,
    Currency: string,
    Amount: number,
    Discount: number,
    RenewDiscount: number,
    RenewAmount: number,
    Plans: unknown[],
    Renew: number,
    External: number,
    BillingPlatform: number,
    IsTrial: boolean,
}

export interface ISubscriptionsGetResponse extends IBaseAPIResponse {
    Subscription: ISubscription,
    UpcomingSubscription: ISubscription | null,
}
