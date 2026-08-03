import type { User } from "./user";

export interface CommentLike {
   id: number | string;
   userId: number;
   commentId: number;
   user?: User;
}

export interface Comment {
   type: "comment";
   id: number | string;
   content: string;
   created: string;
   postId?: string;
   user?: User,
   commentLikes?: CommentLike[];
}