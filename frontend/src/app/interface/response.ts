export interface Response<T>{
    timestamp: string;
    statusCode: number;
    httpStatus?: string;
    data: {[key: string]: T}
}