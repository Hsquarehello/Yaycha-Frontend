import type { Comment } from "./comment.js";
import type { User } from "./user.js";

export interface Post {
   id: number;
   content: string;
   created: string;
   comments?: Comment[];
   user?: User;
}