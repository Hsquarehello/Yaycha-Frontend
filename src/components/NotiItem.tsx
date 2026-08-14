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
  PersonAdd as PersonAddIcon,
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

  const sender = noti.sender;

  const renderIcon = () => {
    switch (noti.type) {
      case "comment":
        return <CommentIcon color="success" />;
      case "like":
      case "likeComment":
        return <FavoriteIcon color="error" />;
      case "follow":
        return <PersonAddIcon color="primary" />;
      default:
        return <CommentIcon color="action" />;
    }
  };

  const handleClick = () => {
    if (!noti.read) {
      readNoti(noti.id);
    }

    if (noti.type === "follow") {
      // Follow Noti ဖြစ်ပါက Follow လုပ်သူ၏ Profile Page သို့ သွားမည်
      navigate(`/profile/${noti.senderId}`);
    } else if (noti.postId) {
      // Post/Comment Noti ဖြစ်ပါက Post/Comment Page သို့ သွားမည်
      navigate(`/comments/${noti.postId}`);
    }
  };

  return (
    <Card
      sx={{
        mb: 2,
        opacity: noti.read ? 0.4 : 1,
        transition: "opacity 0.2s ease-in-out",
      }}
      key={noti.id}>
      <CardActionArea onClick={handleClick}>
        <CardContent
          sx={{
            display: "flex",
            opacity: 1,
          }}>
          <Box sx={{ mr: 2 }}>{renderIcon()}</Box>

          <Box sx={{ ml: 3 }}>
            <Avatar src={sender?.username || ""} alt={sender?.username}>
              {sender?.username?.charAt(0).toUpperCase()}
            </Avatar>

            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="body2">
                <b>{sender?.username}</b>{" "}
                <Box component="span" sx={{ color: "text.secondary", ml: 0.5 }}>
                  {noti.content}
                </Box>
              </Typography>

              <Typography variant="caption" color="text.disabled">
                {formattedDate}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
