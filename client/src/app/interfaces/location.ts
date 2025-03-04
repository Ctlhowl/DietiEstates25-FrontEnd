import { Poi } from "./poi";

export interface Location {
    id?: number;
    countyCode?: string;
    county: string | undefined;
    city?: string ;
    postalCode?: string;
    street?: string;
    poi?: Poi[];
    lat?: number;
    lng?: number;
}