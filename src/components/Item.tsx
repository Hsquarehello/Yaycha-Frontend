import { Box, Card, CardContent, Typography, IconButton } from "@mui/material";
import type { FormEvent } from "react";
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

type ItemProps = {
  item: Post;
  remove: (id: number | string) => void;
};

export default function Item({ item, remove }: ItemProps) {
  const navigate = useNavigate();
  const { auth } = useApp();

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent onClick={() => navigate(`/comments/${item.id}`)}>
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
              onClick={(e: FormEvent) => {
                remove(item.id);
                e.stopPropagation();
              }}>
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          )}
        </Box>
        <Typography sx={{ my: 3 }}>{item.content}</Typography>
        <Box
          onClick={(e: FormEvent<HTMLElement>) => {
            navigate(`/profile/${item.user?.id}`);
            e.stopPropagation();
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
      </CardContent>
    </Card>
  );
}
