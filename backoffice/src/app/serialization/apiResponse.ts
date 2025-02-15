import { ApiError } from "./apiError";
import { Meta } from "./meta";

export interface ApiResponse<T>{
    status: string;
    data: T;
    meta: Meta;
    errors?: ApiError[]; 
}