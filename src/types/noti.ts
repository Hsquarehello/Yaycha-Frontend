export interface Noti {
  id: number;
  type: "comment" | "like" | "likeComment" | "follow" | "new_post";
  content: string;
  userId: number;
  postId?: number;
  read: boolean;
  created: string;
  sender: {
    id: number;
    username: string;
  };
  senderId: number;
}
