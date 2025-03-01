export interface Offer {
    id?: number;
    price: number;
    idEstate: number;
    emailUser: string;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
}