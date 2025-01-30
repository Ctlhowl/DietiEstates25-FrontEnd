import { Location } from "./location";
import { Addons } from "./addons";
import { File } from "./file";
 

export interface Estate{
    id?: number;
    title: string;
    category: string;
    description: string;
    rental: boolean;
    price: number;
    mtq: number;
    energyClass: string;
    rooms: number;
    services: number;
    location: Location;
    userId: number;
    addons: Addons[];
    files?: File[];
}