import type { User } from "./user";

export interface Comment {
   id: number;
   content: string;
   created: string;
   postId?: string;
   user?: User
}