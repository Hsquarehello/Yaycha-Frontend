import {
  Card,
  CardActionArea,
  Box,
  Typography,
  CardContent,
  Avatar,
} from "@mui/material";
import {
  Favorite as FavoriteIcon,
  Comment as CommentIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import type { Noti } from "../types/noti";

interface NotiItemParams {
  noti: Noti;
  readNoti: (id: number) => void;
}

export default function NotiItem({ noti, readNoti }: NotiItemParams) {
  const navigate = useNavigate();
  const formattedDate = noti.created
    ? format(new Date(noti.created), "MMM dd, yyyy")
    : "";

  return (
    <Card
      sx={{
        mb: 2,
        opacity: noti.read ? 0.4 : 1,
        transition: "opacity 0.2s ease-in-out",
      }}
      key={noti.id}>
      <CardActionArea
        onClick={() => {
          if (!noti.read) {
            readNoti(noti.id);
          }
          navigate(`/comments/${noti.postId}`);
        }}>
        <CardContent
          sx={{
            display: "flex",
            opacity: 1,
          }}>
          {noti.type === "comment" ? (
            <CommentIcon color="success" />
          ) : (
            <FavoriteIcon color="error" />
          )}
          <Box sx={{ ml: 3 }}>
            <Avatar />
            <Box sx={{ mt: 1 }}>
              <Typography component="span" sx={{ mr: 1 }}>
                <b>{noti.user?.username}</b>
              </Typography>
              <Typography
                component="span"
                sx={{
                  mr: 1,
                  color: "text.secondary",
                }}>
                {noti.content}
              </Typography>
              <Typography component="span" color="primary">
                <small>{formattedDate}</small>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
