export interface User{
    id?: number;
    name: string;
    surname: string;
    email: string;
    password?: string | null;
    provider?: string;
    agency?: string | null;
    role: string;
}