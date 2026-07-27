import { Box, Button, TextField, Alert } from "@mui/material";
import type { FormEvent, JSX } from "react";
import Comment from "../../components/Comment";
import { queryClient, useApp } from "../../ThemedApp";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { Post } from "../../types/post.js";
import { useParams } from "react-router-dom";

const api = import.meta.env.VITE_API_URL || "http://localhost:8000";
export default function Comments(): JSX.Element {
  const { setGlobalMsg } = useApp();
  const { id } = useParams<{ id: string }>();

  const {
    isLoading,
    isError,
    error,
    data,
  }: {
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    data: Post | undefined;
  } = useQuery({
    queryKey: ["comments"],
    queryFn: async () => {
      const response = await fetch(`${api}/api/posts/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      return response.json();
    },
  });

  const deleteComment = async (commentId: number | string): Promise<void> => {
    const response = await fetch(`${api}/api/comments/${commentId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to remove comment");
    }
    return response.json();
  };

  const handleRemove = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      setGlobalMsg("Comment removed successfully.");
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Comment သစ် ပို့မည့် Logic ကို ဤနေရာတွင် ရေးသားနိုင်ပါသည်
    setGlobalMsg("Comment added");
  };

  return (
    <Box>
      {isError && (
        <Box>
          <Alert severity="warning">{error?.message}</Alert>
        </Box>
      )}
      {isLoading && <Box sx={{ textAlign: "center" }}>Loading...</Box>}
      {/* Comment များကို Array map လုပ်ပြီး ပြသခြင်း */}
      {data &&
        data.comments?.map((comment) => (
          <Comment
            key={comment.id}
            user={data.user}
            comment={comment}
            remove={handleRemove.mutate}
          />
        ))}

      {/* Comment အသစ်ရေးရန် Form */}
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 3 }}>
          <TextField multiline placeholder="Your Comment" fullWidth />
          <Button type="submit" variant="contained">
            Reply
          </Button>
        </Box>
      </form>
    </Box>
  );
}
