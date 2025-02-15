import { TimestampProvider } from "rxjs";

export interface Meta {
    requestTime: TimestampProvider;
    version: string;
}