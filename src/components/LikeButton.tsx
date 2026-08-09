import { IconButton, ButtonGroup, Button } from "@mui/material";

import {
  Favorite as LikedIcon,
  FavoriteBorder as LikeIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { useApp, queryClient } from "../ThemedApp";

import { useMutation } from "@tanstack/react-query";

import { postLike, deleteLike } from "../lib/fetcher.js";
import type { Post } from "../types/post.js";
import type { Comment } from "../types/comment.js";

type LikeButtonProps = {
  item: Post | Comment;
};

// Mutation မှာသုံးမယ့် parameter type သတ်မှတ်ခြင်း
type LikeParams = {
  id: number | string;
  type: "post" | "comment";
};

export default function LikeButton({ item }: LikeButtonProps) {
  const navigate = useNavigate();
  const { auth } = useApp();

  const likesList = item.type === "post" ? item.postLikes : item.commentLikes;

  function isLiked() {
    if (!auth) return false;
    if (item.type === "post" && !item.postLikes) return false;
    if (item.type === "comment" && !item.commentLikes) return false;
    const likes = item.type === "post" ? item.postLikes : item.commentLikes;
    return likes?.find((like) => like.userId === auth.id);
  }

  const likeItem = useMutation({
    mutationFn: ({ id, type }: LikeParams) => postLike(id, type),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["posts"] });
      queryClient.refetchQueries({ queryKey: ["comments"] });
      queryClient.refetchQueries({ queryKey: [`users`, item.user?.id] });
    },
  });

  const unlikeItem = useMutation({
    mutationFn: ({ id, type }: LikeParams) => deleteLike(id, type),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["posts"] });
      queryClient.refetchQueries({ queryKey: ["comments"] });
      queryClient.refetchQueries({ queryKey: ["users", item.user?.id] });
    },
  });

  return (
    <ButtonGroup>
      {isLiked() ? (
        <IconButton
          disabled={likeItem.isPending}
          size="small"
          onClick={(e) => {
            unlikeItem.mutate({ id: item.id, type: item.type });
            e.stopPropagation();
          }}>
          <LikedIcon fontSize="small" color="error" />
        </IconButton>
      ) : (
        <IconButton
          disabled={unlikeItem.isPending}
          size="small"
          onClick={(e) => {
            likeItem.mutate({ id: item.id, type: item.type });
            e.stopPropagation();
          }}>
          <LikeIcon fontSize="small" color="error" />
        </IconButton>
      )}
      <Button
        onClick={(e) => {
          if (item.type === "comment") {
            navigate(`/likes/${item.id}/comment`);
          } else {
            navigate(`/likes/${item.id}/post`);
          }
          e.stopPropagation();
        }}
        sx={{ color: "text.fade" }}
        variant="text"
        size="small">
        {likesList ? likesList.length : 0}
      </Button>
    </ButtonGroup>
  );
}
