import type { CommentLike } from "../types/comment";
import type { PostLike } from "../types/post";
import type { User } from "../types/user";

const api = import.meta.env.VITE_API;

// Token ရယူသည့် Function ( string သို့မဟုတ် null ထွက်နိုင်သည်)
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

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

// 2. Async Function တွင် Parameter Type နှင့် Return Type အတိအကျ သတ်မှတ်ပါ
export async function fetchUser(id: number): Promise<User> {
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
  const data: User = await res.json();
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

export async function postComment(content: string, postId: string) {
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

export async function postLike(id: number | string, type: "post" | "comment") {
  const token = getToken();
  const res = await fetch(
    `${api}/${type === "post" ? "posts" : "comments"}/like/${id}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (res.ok) {
    return res.json();
  }
  throw new Error("Error: Check Network Log");
}

export async function deleteLike(
  id: number | string,
  type: "post" | "comment",
) {
  const token = getToken();
  const res = await fetch(
    `${api}/${type === "post" ? "posts" : "comments"}/unlike/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (res.ok) {
    return res.json();
  }
  throw new Error("Error: Check Network Log");
}

export async function fetchLikesOrComment(
  id: number | string,
  type: "post" | "comment",
): Promise<PostLike[] | CommentLike[]> {
  const res = await fetch(
    `${api}/${type === "post" ? "posts" : "comments"}/like/${id}`,
  );
  if (res.ok) {
    return res.json();
  }
  throw new Error("Error: Check Network Log");
}

export async function postFollow(id: number) {
  const token = getToken();
  const res = await fetch(`${api}/follow/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

export async function deleteFollow(id: number) {
  const token = getToken();
  const res = await fetch(`${api}/unfollow/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}


export async function fetchSearch(q:string):Promise<User[]> {
 const res = await fetch(`${api}/search?q=${q}`);
 return res.json();
}



