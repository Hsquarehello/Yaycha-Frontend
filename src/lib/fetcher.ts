import type { Post } from "../types/post";
import type { User } from "../types/user";

const api = import.meta.env.VITE_API;

export async function postUser(data: User) {
  const res = await fetch(`${api}/users`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    return res.json();
  }
  throw new Error("Error: Check Network Log");
}

export async function postLogin(username: string, password: string) {
  const res = await fetch(`${api}/users/login`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.ok) {
    return res.json();
  }
  throw new Error("Incorrect username or password");
}
// 1. User Data Structure အတွက် Interface သတ်မှတ်ပါ
export interface UserForProfile {
  id: number | string;
  name: string;
  username: string;
  bio?: string;
  created?: string;
  posts: Post[];
}

// Token ရယူသည့် Function ( string သို့မဟုတ် null ထွက်နိုင်သည်)
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

// 2. Async Function တွင် Parameter Type နှင့် Return Type အတိအကျ သတ်မှတ်ပါ
export async function fetchUser(id: number | string): Promise<UserForProfile> {
  const token = getToken();

  // Header options များကို dynamic သတ်မှတ်ခြင်း
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${api}/users/${id}`, {
    method: "GET",
    headers,
  });

  // 3. HTTP Error များကို စစ်ဆေးပါ (res.ok က 200-299 Status မဟုတ်ပါက false ဖြစ်မည်)
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.msg || `Failed to fetch user with status: ${res.status}`,
    );
  }

  // 4. Response JSON ကို User Type အဖြစ် Return ပြန်ပေးခြင်း
  const data: UserForProfile = await res.json();
  return data;
}

export async function fetchVerify() {
  const token = getToken();
  const res = await fetch(`${api}/verify`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.ok) {
    return res.json();
  }
  return;
}

export async function postPost(content: string) {
  const token = getToken();
  const res = await fetch(`${api}/posts`, {
    method: "POST",
    body: JSON.stringify({ content }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.ok) {
    return res.json();
  }
  throw new Error("Error: Check Network Log");
}

export async function postComment(content:string, postId:string) {
  const token = getToken();
  const res = await fetch(`${api}/comments`, {
    method: "POST",
    body: JSON.stringify({ content, postId }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.ok) {
    return res.json();
  }
  throw new Error("Error: Check Network Log");
}
