import { Alert, Avatar, Box, Typography } from "@mui/material";
import { pink } from "@mui/material/colors";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deletePost, fetchPostsByUserId, fetchUser } from "../../lib/fetcher";
import type { Post } from "../../types/post";
import { queryClient, useApp } from "../../ThemedApp";
import FollowButton from "../../components/FollowButton";
import Item from "../../components/Item";
import type { User } from "../../types/user";
import Loading from "../../components/Loading";

export default function Profile() {
  const { id: userId } = useParams<{ id: string }>();
  const { setGlobalMsg } = useApp();

  const userQueryKey = ["users", Number(userId)];

  const {
    isLoading: userLoading,
    isError: isUserError,
    error: userError,
    data: user,
  } = useQuery<User, Error>({
    queryKey: userQueryKey,
    queryFn: async () => {
      if (!userId) throw new Error("User ID is missing");
      return fetchUser(Number(userId));
    },
    enabled: !!userId,
  });

  const postQueryKey = ["posts", userId];
  const { data: posts, isLoading: postsLoading } = useQuery<Post[], Error>({
    queryKey: postQueryKey,
    queryFn: () => fetchPostsByUserId(userId!),
    enabled: !!userId,
  });

  const handleRemove = useMutation({
    mutationFn: deletePost,
    onMutate: async (postId: string | number) => {
      await queryClient.cancelQueries({ queryKey: postQueryKey });

      const previousPosts = queryClient.getQueryData<Post[]>(postQueryKey);

      queryClient.setQueryData<Post[]>(postQueryKey, (old) =>
        old ? old.filter((item) => item.id !== postId) : [],
      );

      setGlobalMsg("Post removed successfully.");
      return { previousPosts };
    },
    onError: (_err, _id, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(postQueryKey, context.previousPosts);
      }
      setGlobalMsg("Failed to delete post");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postQueryKey });
    },
  });

  if (isUserError) {
    return (
      <Box>
        <Alert severity="warning">{userError.message}</Alert>
      </Box>
    );
  }

  if (userLoading) {
    return <Loading message="Loading data..." />;
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
          <Typography>{user?.username}</Typography>
          <Typography sx={{ fontSize: "0.8em", color: "text.fade" }}>
            {user?.bio}
          </Typography>
          <Box>{user && <FollowButton user={user} />}</Box>
        </Box>
      </Box>

      {/* User Post Item */}

      {postsLoading && <Loading message="Getting User's Posts" />}
      {!postsLoading && posts?.length === 0 && (
        <Typography align="center" color="text.secondary" sx={{ mt: 2 }}>
          No posts found.
        </Typography>
      )}
      {posts &&
        posts.length > 0 &&
        posts?.map((post: Post) => (
          <Item
            key={post.id}
            item={post}
            remove={() => handleRemove.mutate(post.id)}
          />
        ))}
    </Box>
  );
}
