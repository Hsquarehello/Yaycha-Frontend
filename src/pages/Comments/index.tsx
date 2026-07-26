import { Box, Button, TextField } from "@mui/material";
import type { FormEvent, JSX } from "react";
import { useState } from "react";
import Comment from "../../components/Comment";
import { useApp } from "../../ThemedApp";

// Comment Item ရဲ့ Props Type သတ်မှတ်ခြင်း
interface CommentItem {
  id: number;
  content: string;
  name: string;
}

export default function Comments(): JSX.Element {
  const { setGlobalMsg } = useApp();
  const [commentsData, setCommentsData] = useState<CommentItem[]>([
    {
      id: 1,
      content: "Initial post content from Alice",
      name: "Alice",
    },
    {
      id: 2,
      content: "A comment from Bob",
      name: "Bob",
    },
    {
      id: 3,
      content: "A comment reply from Alice",
      name: "Alice",
    },
  ]);
  // Dummy Data လေးများကို Type စနစ်တကျဖြင့် သတ်မှတ်ခြင်း

  const handleRemove = (id: number | string): void => {
    // Comment ဖျက်မည့် Logic ကို ဤနေရာတွင် ရေးသားနိုင်ပါသည်
    setCommentsData(commentsData.filter((comment) => comment.id !== id));
    setGlobalMsg("Comment removed successfully.");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Comment သစ် ပို့မည့် Logic ကို ဤနေရာတွင် ရေးသားနိုင်ပါသည်
    setGlobalMsg("Comment added");
  };

  return (
    <Box>
      {/* Comment များကို Array map လုပ်ပြီး ပြသခြင်း */}
      {commentsData.map((comment) => (
        <Comment
          key={comment.id}
          item={comment}
          remove={() => handleRemove(comment.id)}
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
