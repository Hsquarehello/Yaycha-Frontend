import type { Comment, CommentLike } from "../types/comment";
import type { Noti } from "../types/noti";
import type { Post, PostLike } from "../types/post";
import type { RegisterUser, User } from "../types/user";

const api = import.meta.env.VITE_API;

// Token ရယူသည့် Function ( string သို့မဟုတ် null ထွက်နိုင်သည်)
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

// Fetch Helper
async function fetchClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${api}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.msg ||
        errorData.message ||
        `Request failed with status: ${response.status}`,
    );
  }

  return response.json();
}

// User APIs
export async function postUser(data: RegisterUser): Promise<User> {
  return fetchClient("/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function postLogin(username: string, password: string) {
  return fetchClient<{ token: string; user: User }>("/users/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function fetchUser(id: number): Promise<User> {
  return fetchClient<User>(`/users/${id}`, { method: "GET" });
}

export async function fetchVerify(): Promise<User | null> {
  return fetchClient<User>("/verify", { method: "GET" });
}

export async function fetchSearch(q: string): Promise<User[]> {
  return fetchClient<User[]>(`/search?q=${encodeURIComponent(q)}`);
}

// Post APIs
export const fetchPosts = async (): Promise<Post[]> => {
  return fetchClient<Post[]>("/posts");
};

export const fetchPostsByUserId = async (
  userId: string | number,
): Promise<Post[]> => {
  return fetchClient<Post[]>(`/posts/users/${userId}`);
};

export async function fetchFollowingPosts() {
  return fetchClient<Post[]>("/following/posts", { method: "GET" });
}

export async function postPost(content: string) {
  return fetchClient<Post>("/posts", {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

export async function deletePost(id: string | number) {
  fetchClient(`/posts/${id}`, {
    method: "DELETE",
  });
}

// Comment APIs
export async function postComment(content: string, postId: string) {
  return fetchClient<Comment>("/comments", {
    method: "POST",
    body: JSON.stringify({ content, postId }),
  });
}

export async function deleteComment(id: string | number) {
  fetchClient(`/comments/${id}`, {
    method: "DELETE",
  });
}

// Like APIs
export async function postLike(id: number | string, type: "post" | "comment") {
  const endpoint = `/${type === "post" ? "posts" : "comments"}/like/${id}`;
  return fetchClient(endpoint, { method: "POST" });
}

export async function deleteLike(
  id: number | string,
  type: "post" | "comment",
) {
  const endpoint = `/${type === "post" ? "posts" : "comments"}/unlike/${id}`;
  return fetchClient(endpoint, { method: "DELETE" });
}

export async function fetchLikesOrComment(
  id: number | string,
  type: "post" | "comment",
): Promise<PostLike[] | CommentLike[]> {
  const endpoint = `/${type === "post" ? "posts" : "comments"}/like/${id}`;
  return fetchClient<PostLike[] | CommentLike[]>(endpoint);
}

// Follow APIs
export async function postFollow(id: number) {
  return fetchClient(`/follow/${id}`, { method: "POST" });
}

export async function deleteFollow(id: number) {
  return fetchClient(`/unfollow/${id}`, { method: "DELETE" });
}

// Notification APIs
export async function fetchNotis(): Promise<Noti[]> {
  return fetchClient("/notis", {
    method: "GET",
  });
}

export async function putAllNotisRead() {
  return fetchClient("/notis", {
    method: "PUT",
  });
}

export async function putNotiRead(id: string | number) {
  return fetchClient(`/notis/${id}/read`, {
    method: "PUT",
  });
}
