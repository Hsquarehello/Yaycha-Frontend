import type { Follow } from "./Follow";
import type { Post } from "./post";
import type { Comment } from "./comment";

export interface User {
  id: number;
  name: string;
  username: string;
  bio?: string;
  followers?: Follow[];
  following?: Follow[];
  posts?: Post[];
  comments?: Comment[];
}

export interface RegisterUser {
  name: string;
  username: string;
  bio?: string;
  password: string;
}
