import { Button } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useApp, queryClient } from "../ThemedApp";
import { postFollow, deleteFollow } from "../lib/fetcher.js";
import type { User } from "../types/user";
import type { FormEvent } from "react";

type FollowButtonProps = {
  user: User;
};

export default function FollowButton({ user }: FollowButtonProps) {
  const { auth } = useApp();

  const follow = useMutation({
    mutationFn: postFollow,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [`users/${user.id}`] });
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      await queryClient.invalidateQueries({ queryKey: ["search"] });
      await queryClient.invalidateQueries({ queryKey: ["like"] });
    },
  });

  const unfollow = useMutation({
    mutationFn: deleteFollow,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [`users/${user.id}`] });
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      await queryClient.invalidateQueries({ queryKey: ["search"] });
      await queryClient.invalidateQueries({ queryKey: ["like"] });
    },
  });

  if (!auth) return <></>;
  function isFollowing() {
    return user.following?.find((item) => item.followerId == auth.id);
  }
  return auth.id === user.id ? (
    <></>
  ) : (
    <Button
      size="small"
      variant={isFollowing() ? "outlined" : "contained"}
      sx={{ borderRadius: 5 }}
      onClick={(e: FormEvent<HTMLButtonElement>) => {
        if (isFollowing()) {
          unfollow.mutate(user.id!);
        } else {
          follow.mutate(user.id!);
        }
        e.stopPropagation();
      }}>
      {isFollowing() ? "Following" : "Follow"}
    </Button>
  );
}
