import { Box, Card, CardContent, Typography, IconButton } from "@mui/material";
import { formatRelative } from "date-fns";
import type { Post } from "../types/post.js";

import {
  Alarm as TimeIcon,
  AccountCircle as UserIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

import { green } from "@mui/material/colors";

import { useNavigate } from "react-router-dom";
import { useApp } from "../ThemedApp.js";
import LikeButton from "./LikeButton.js";
import CommentButton from "./CommentButton.js";

type ItemProps = {
  item: Post;
  remove: (id: number | string) => void;
};

export default function Item({ item, remove }: ItemProps) {
  const navigate = useNavigate();
  const { auth } = useApp();

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
            }}>
            <TimeIcon sx={{ fontSize: 10 }} color="success" />
            <Typography variant="caption" sx={{ color: green[500] }}>
              {formatRelative(item.created, new Date())}
            </Typography>
          </Box>
          {auth && auth.username === item.user?.username && (
            <IconButton
              size="small"
              onClick={() => {
                remove(item.id);
              }}>
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          )}
        </Box>
        <Typography sx={{ my: 3 }}>{item.content}</Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <Box
            onClick={() => {
              navigate(`/profile/${item.user?.id}`);
            }}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
            }}>
            <UserIcon sx={{ fontSize: 26 }} color="info" />
            <Typography variant="caption">{item.user?.name}</Typography>
          </Box>
          <Box>
            <LikeButton item={{ ...item, type: "post" }} />
            <CommentButton item={{ ...item, type: "post" }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
