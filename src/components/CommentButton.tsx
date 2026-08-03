import { IconButton, ButtonGroup, Button } from "@mui/material";

import { ChatBubbleOutlined as CommentIcon } from "@mui/icons-material";
import type { Post } from "../types/post";
import { useNavigate } from "react-router-dom";

export default function CommentButton({ item }: { item: Post }) {
  const navigate = useNavigate();
  return (
    <>
      <ButtonGroup
        sx={{ ml: 3 }}
        onClick={() => {
          navigate(`/comments/${item.id}`);
        }}>
        <IconButton size="small">
          <CommentIcon fontSize="small" color="info" />
        </IconButton>
        <Button sx={{ color: "text.fade" }} variant="text" size="small">
          {item.comments?.length || 0}
        </Button>
      </ButtonGroup>
    </>
  );
}
