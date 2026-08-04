import { Alert, Avatar, Box, Typography, Button } from "@mui/material";
import { pink } from "@mui/material/colors";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchUser, getToken } from "../../lib/fetcher";
import type { Post } from "../../types/post";
import { queryClient, useApp } from "../../ThemedApp";
import FollowButton from "../../components/FollowButton";
import Item from "../../components/Item";
import type { User } from "../../types/user";

const api = import.meta.env.VITE_API || "http://localhost:8000/api";
export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const { setGlobalMsg } = useApp();

  const { isLoading, isError, error, data } = useQuery<User, Error>({
    queryKey: [`users/${id}`],
    queryFn: async () => fetchUser(Number(id!)),
    enabled: !!id,
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
      queryClient.cancelQueries({ queryKey: [`users/${id}`] });

      const previousPosts = queryClient.getQueryData<Post[]>([`users/${id}`]);

      queryClient.setQueryData<Post[]>([`users/${id}`], (old) =>
        old ? old.filter((item) => item.id !== id) : [],
      );

      setGlobalMsg("Post removed successfully.");
      return { previousPosts };
    },
    onError: (_err, _id, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData([`users/${id}`], context.previousPosts);
      }
      setGlobalMsg("Failed to delete post");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [`users/${id}`] });
    },
  });

  if (isError) {
    return (
      <Box>
        <Alert severity="warning">{error.message}</Alert>
      </Box>
    );
  }

  if (isLoading) {
    return <Box sx={{ textAlign: "center" }}>Loading...</Box>;
  }

  return (
    <Box>
      {/* Profile Cover Banner */}
      <Box sx={{ bgcolor: "banner", height: 150, borderRadius: 4 }} />

      {/* Profile Avatar & Info Section */}
      <Box
        sx={{
          mb: 4,
          marginTop: "-60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}>
        <Avatar sx={{ width: 100, height: 100, bgcolor: pink[500] }} />
        <Box sx={{ textAlign: "center" }}>
          <Typography>{data?.username}</Typography>
          <Typography sx={{ fontSize: "0.8em", color: "text.fade" }}>
            {data?.bio}
          </Typography>
          <Button>
            {data && <FollowButton user={data} />}
          </Button>
        </Box>
      </Box>

      {/* User Post Item */}
      {data &&
        data.posts?.map((post: Post) => (
          <Item key={post.id} item={post} remove={handleRemove.mutate} />
        ))}
    </Box>
  );
}
