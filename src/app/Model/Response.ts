export class Response<T> {
    data: T;
    success: boolean;
    message: string;
    messages: string[];
}