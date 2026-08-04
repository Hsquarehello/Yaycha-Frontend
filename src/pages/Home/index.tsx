import { useQuery, useMutation } from "@tanstack/react-query";

import { Box, Alert, Button, Typography } from "@mui/material";
import Form from "../../components/Form";
import Item from "../../components/Item";

import { queryClient, useApp } from "../../ThemedApp";
import type { Post } from "../../types/post";
import {
  getToken,
  postPost,
  fetchFollowingPosts,
  fetchPosts,
} from "../../lib/fetcher";
import Loading from "../../components/Loading";
import { useState } from "react";

const api = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export default function Home() {
  const { auth, showForm, setGlobalMsg } = useApp();
  const [showLatest, setShowLatest] = useState(true);

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["posts", showLatest],
    queryFn: showLatest ? fetchPosts : fetchFollowingPosts,
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
      headers,
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

      queryClient.setQueryData<Post[]>(["posts", showLatest], (old) =>
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

  type PostsQueryData = Post[];

  const add = useMutation({
    mutationFn: postPost,
    onSuccess: async (post) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      queryClient.setQueryData<PostsQueryData>(["posts", showLatest], (old) => {
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
      {isLoading && <Loading message="Fetching posts..." />}
      {showForm && auth && <Form add={add.mutate} />}
      {auth && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 1,
          }}>
          <Button disabled={showLatest} onClick={() => setShowLatest(true)}>
            Latest
          </Button>
          <Typography sx={{ color: "text.fade", fontSize: 15 }}>|</Typography>
          <Button disabled={!showLatest} onClick={() => setShowLatest(false)}>
            Following
          </Button>
        </Box>
      )}
      {data &&
        data.map((post: Post) => {
          return (
            <Item key={post.id} item={post} remove={handleRemove.mutate} />
          );
        })}
    </Box>
  );
}
