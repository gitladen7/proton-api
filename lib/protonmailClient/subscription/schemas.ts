import * as t from "io-ts";
import { BaseAPIResponse } from "../schemas";

export const Subscription = t.interface({
    ID: t.string,
    InvoiceID: t.string,
    Cycle: t.number,
    PeriodStart: t.number,
    PeriodEnd: t.number,
    CreateTime: t.number,
    CouponCode: t.string,
    Currency: t.string,
    Amount: t.number,
    Discount: t.number,
    RenewDiscount: t.number,
    RenewAmount: t.number,
    Plans: t.array(t.unknown),
    Renew: t.number,
    External: t.number,
    BillingPlatform: t.number,
    IsTrial: t.boolean,
});

export const SubscriptionGetResponse = t.intersection([
    BaseAPIResponse,
    t.type({
        Subscription: Subscription,
        UpcomingSubscription: t.union([Subscription, t.null]),
    }),
]);
