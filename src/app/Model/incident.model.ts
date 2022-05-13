import { Author } from "./Author";

export class Incident {
    id: number;
    imageUrl?: string;
    createDate: Date;
    firstName: string;
    rating: number;
    country: string;
    city: string;
    phone: string;
    state?: string;
    comments: Comment[];
    commentCount: number;
    likeCount: number;
    author: Author;
    description: string;
    likedByCurrentUser: boolean;
    images: string[];
    totalIncidentsReported: number;
}
