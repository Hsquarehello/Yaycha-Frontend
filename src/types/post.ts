import type { Comment } from "./comment.js";
import type { User } from "./user.js";

export interface PostLike {
  id: number | string;
  userId: number;
  postId: number;
  user?: User;
}

export interface Post {
   type: "post";
   id: number | string;
   content: string;
   created: string;
   comments?: Comment[];
   user?: User;
   postLikes?: PostLike[];
}