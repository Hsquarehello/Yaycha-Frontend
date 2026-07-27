import {
  Avatar,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import { Alarm as TimeIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {formatRelative} from "date-fns";

import { blue, green } from "@mui/material/colors";
import type { Comment } from "../types/comment.js";
import type { User } from "../types/user.js";

export default function Comment({
  comment,
  user,
  remove,
}: {
  comment: Comment;
  user?: User | undefined;
  remove: (id: number | string) => void;
}) {
  const initials = user?.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
        },
      }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack
          direction="row"
          sx={{
            mb: 1.5,
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <Chip
            icon={<TimeIcon sx={{ fontSize: 14 }} />}
            label={formatRelative(new Date(comment.created), new Date())}
            size="small"
            sx={{
              bgcolor: green[50],
              color: green[700],
              fontWeight: 600,
              borderRadius: "999px",
              px: 0.5,
              "& .MuiChip-icon": {
                color: green[600],
              },
            }}
          />

          <IconButton
            size="small"
            onClick={() => remove(comment.id)}
            sx={{
              color: "text.secondary",
              "&:hover": {
                bgcolor: "error.light",
                color: "error.main",
              },
            }}>
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </Stack>

        <Typography
          sx={{
            my: 2,
            color: "text.primary",
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
          }}>
          {comment.content}
        </Typography>

        <Divider sx={{ my: 1.5 }} />

        <Stack direction="row" sx={{ alignItems: "center" }} spacing={1.2}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: 14,
              fontWeight: 600,
              bgcolor: blue[500],
            }}>
            {initials}
          </Avatar>

          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "text.secondary" }}>
            {user?.name}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
