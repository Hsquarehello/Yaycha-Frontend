import { Button } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useApp, queryClient } from "../ThemedApp";
import { postFollow, deleteFollow } from "../lib/fetcher.js";
import type { User } from "../types/user";

type FollowButtonProps = {
  user: User;
};

export default function FollowButton({ user }: FollowButtonProps) {
  const { auth } = useApp();

  const follow = useMutation({
    mutationFn: postFollow,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users", user.id] });
      await queryClient.invalidateQueries({ queryKey: ["users", auth?.id] });
      await queryClient.invalidateQueries({ queryKey: ["search"] });
      await queryClient.invalidateQueries({ queryKey: ["likes"] });
    },
  });

  const unfollow = useMutation({
    mutationFn: deleteFollow,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users", user.id] });
      await queryClient.invalidateQueries({ queryKey: ["users", auth?.id] });
      await queryClient.invalidateQueries({ queryKey: ["search"] });
      await queryClient.invalidateQueries({ queryKey: ["likes"] });
    },
  });

  if (!auth || auth.id === user.id) return <></>;

  const isFollowing = Boolean(
    user.following?.some((item) => item.followerId === auth.id),
  );

  const isPending = follow.isPending || unfollow.isPending;

  return (
    <Button
      size="small"
      variant={isFollowing ? "outlined" : "contained"}
      sx={{ borderRadius: 5 }}
      disabled={isPending}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        if (isFollowing) {
          unfollow.mutate(user.id!);
        } else {
          follow.mutate(user.id!);
        }
        e.stopPropagation();
      }}>
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
}
