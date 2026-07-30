import { useQuery, useMutation } from "@tanstack/react-query";

import type { JSX } from "react";
import { Box, Alert } from "@mui/material";
import Form from "../../components/Form";
import Item from "../../components/Item";

import { queryClient, useApp } from "../../ThemedApp";
import type { Post } from "../../types/post";
import { getToken, postPost } from "../../lib/fetcher";

const api = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export default function Home(): JSX.Element {
  const { auth, showForm, setGlobalMsg } = useApp();
  const {
    isLoading,
    isError,
    error,
    data,
  }: {
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    data: Post[] | undefined;
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await fetch(`${api}/posts`);
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      return response.json();
    },
  });

  const deletePost = async (postId: number | string) => {
    const token = getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(`${api}/posts/${postId}`, {
      method: "DELETE",
      headers
    });
    if (!response.ok) {
      throw new Error("Failed to delete post");
    }
  };

  const handleRemove = useMutation({
    mutationFn: deletePost,
    onMutate: (id: string | number) => {
      queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousPosts = queryClient.getQueryData<Post[]>(["posts"]);

      queryClient.setQueryData<Post[]>(["posts"], (old) =>
        old ? old.filter((item) => item.id !== id) : [],
      );

      setGlobalMsg("Post removed successfully.");
      return { previousPosts };
    },
    onError: (_err, _id, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
      setGlobalMsg("Failed to delete post");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  interface PostResponse {
    id: string;
    content: string;
    createdAt: string;
  }

  type PostsQueryData = PostResponse[];

  const add = useMutation({
    mutationFn: postPost,
    onSuccess: async (post) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      queryClient.setQueryData<PostsQueryData>(["posts"], (old) => {
        return old ? [post, ...old] : [post];
      });

      setGlobalMsg("A post added");
    },
  });

  return (
    <Box>
      {isError && (
        <Box>
          <Alert severity="warning">{error?.message}</Alert>
        </Box>
      )}
      {isLoading && <Box sx={{ textAlign: "center" }}>Loading...</Box>}
      {showForm && auth && <Form add={add.mutate} />}
      {data &&
        data.map((post: Post) => {
          return (
            <Item key={post.id} item={post} remove={handleRemove.mutate} />
          );
        })}
    </Box>
  );
}
