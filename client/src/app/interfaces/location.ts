import { Poi } from "./poi";

export interface Location {
    id?: number;
    countyCode: string;
    county: string;
    city: string;
    postalCode: string;
    street: string;
    poi?: Poi[];
}