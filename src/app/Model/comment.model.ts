import { Author } from "./author";

export class Comment {
    id: number;
    author: Author;
    detail: string;
    disabled: boolean;
    createDate: Date;
    incidentId: number;
}