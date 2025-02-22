import { Location } from "./location";
import { Addon } from "./addon";
import { S3File } from "./s3File";
import { Category } from "./category";
 

export interface Estate{
    id: number | null;
    title: string;
    category: Category;
    description: string;
    rental: boolean;
    price: number;
    mtq: number;
    energyClass: string;
    rooms: number;
    services: number;
    location: Location;
    userId: number;
    addons: Addon[];
    files: S3File[];
}