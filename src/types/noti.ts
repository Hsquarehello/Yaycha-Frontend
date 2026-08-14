import type { User } from "./user";

export interface Noti {
  id: number;
  type: "comment" | "like" | "likeComment" | "follow";
  content: string;
  userId: number;
  postId?: number;
  read: boolean;
  created: string;
  user?: User;
}
