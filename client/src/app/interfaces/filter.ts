import { Addon } from "./addon";

export interface Filter {
    category?: string;
    rental?: boolean;
    minPrice?: number;
    maxPrice?: number;
    minMtq?: number;
    maxMtq?: number;
    energyClass?: string;
    minRooms?: number;
    maxRooms?: number;
    minServices?: number;
    maxServices?: number;
    userId?: number;
    location?: Location;
    addons?: Addon[]; 
}