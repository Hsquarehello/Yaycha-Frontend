import { Box, Button, TextField, Alert } from "@mui/material";
import { useRef, type FormEvent } from "react";
import Comment from "../../components/Comment";
import { queryClient, useApp } from "../../ThemedApp";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { Post } from "../../types/post.js";
import { useParams } from "react-router-dom";
import { getToken, postComment } from "../../lib/fetcher.js";
import type { Comment as CommentOfPost } from "../../types/comment.js";
import Loading from "../../components/Loading.js";

const api = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export default function Comments() {
  const { setGlobalMsg } = useApp();
  const { id } = useParams<{ id: string }>();
  const commentInput = useRef<HTMLTextAreaElement>(null);

  const fetchPost = async (): Promise<Post> => {
    if (!id) throw new Error("Post ID is missing");
    const response = await fetch(`${api}/posts/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch comments");
    }
    return response.json();
  };

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["comments", id],
    queryFn: fetchPost,
    enabled: Boolean(id),
  });

  interface CommentsQueryData {
    comments: CommentOfPost[];
    // အခြား API metadata များ (ဥပမာ- totalCount စသည်)
  }

  interface NewCommentPayload {
    content: string;
    postId: string;
  }

  // 2. Type-safe useMutation
  const addComment = useMutation<CommentOfPost, Error, NewCommentPayload>({
    mutationFn: ({ content, postId }) => postComment(content, postId),

    onSuccess: async (newComment) => {
      // Cache ထဲမှာ ပြိုင်တူ update လုပ်နေတာတွေကို ခေတ္တ ရပ်တန့်ခြင်း
      await queryClient.cancelQueries({ queryKey: ["comments", id] });

      // Immutable နည်းလမ်းဖြင့် Safe ဖြစ်အောင် Update လုပ်ခြင်း
      queryClient.setQueryData<CommentsQueryData>(
        ["comments", id],
        (oldData) => {
          // oldData မရှိသေးပါက Object သစ်တစ်ခု အသစ်ဖန်တီးပေးခြင်း
          if (!oldData) {
            return {
              comments: [newComment],
            };
          }

          // State ကို Direct Mutate မလုပ်ဘဲ Object/Array သစ်ပွားပြီး Return ပြန်ခြင်း (Immutable Pattern)
          return {
            ...oldData,
            comments: [...oldData.comments, newComment],
          };
        },
      );

      setGlobalMsg("A comment added");
    },
  });

  const deleteComment = async (commentId: number | string) => {
    const token = getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${api}/comments/${commentId}`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) {
      throw new Error("Failed to remove comment");
    }
  };

  const handleRemove = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      setGlobalMsg("Comment removed successfully.");
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const contentText = commentInput.current?.value;
    if (!contentText) return;
    if (!id) return;

    addComment.mutate(
      { content: contentText, postId: id },
      {
        onSuccess: () => {
          if (commentInput.current) {
            commentInput.current.value = "";
          }
        },
      },
    );
  };

  return (
    <Box>
      {isError && (
        <Box>
          <Alert severity="warning">{error?.message}</Alert>
        </Box>
      )}
      {isLoading && <Loading message="Loading comments..." />}

      {/* Comment များကို Array map လုပ်ပြီး ပြသခြင်း */}
      {data &&
        data.comments?.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            remove={handleRemove.mutate}
          />
        ))}

      {/* Comment အသစ်ရေးရန် Form */}
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 3 }}>
          <TextField
            inputRef={commentInput}
            multiline
            placeholder="Your Comment"
            fullWidth
            disabled={addComment.isPending}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={addComment.isPending}>
            {addComment.isPending ? "Replying..." : "Reply"}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
