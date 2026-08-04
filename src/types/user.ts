import type { Follow } from "./Follow";
import type { Post } from "./post";
import type { Comment } from "./comment";

export interface User {
   id: number;
   name: string;
   username: string;
   bio?: string;
   follower?: Follow[],
   following?: Follow[],
   posts?: Post[],
   comments?: Comment[],
}