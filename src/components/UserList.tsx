import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
  ListItemSecondaryAction
} from "@mui/material";
import type { CommentLike } from "../types/comment";
import type { PostLike } from "../types/post";
import { useNavigate } from "react-router-dom";
import FollowButton from "./FollowButton";

// Component ရဲ့ Props Type ကို သတ်မှတ်ခြင်း
interface UserListProps {
  title: string;
  data?: PostLike[] | CommentLike[];
}

export default function UserList({ title, data }: UserListProps) {
  const navigate = useNavigate();

  return (
    <Box>
      {/* စာမျက်နှာ ခေါင်းစဉ် */}
      <Typography variant="h4" sx={{ mb: 3 }}>
        {title}
      </Typography>

      {/* User စာရင်း ပြသသည့် List */}
      <List>
        {data &&
          data.map((item) => (
            <ListItem key={item.user?.id}>
              <ListItemButton
                onClick={() => navigate(`/profile/${item.user?.id}`)}>
                <ListItemAvatar>
                  <Avatar />
                </ListItemAvatar>
                <ListItemText
                  primary={`${item.user?.name} @${item.user?.username}`}
                  secondary={item.user?.bio}
                />
                <ListItemSecondaryAction>
                  {item.user && <FollowButton user={item.user} />}
                </ListItemSecondaryAction>
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </Box>
  );
}
