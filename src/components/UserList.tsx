import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import type { JSX } from "react";

// Component ရဲ့ Props Type ကို သတ်မှတ်ခြင်း
interface UserListProps {
  title: string;
}

export default function UserList({ title }: UserListProps): JSX.Element {
  return (
    <Box>
      {/* စာမျက်နှာ ခေါင်းစဉ် */}
      <Typography variant="h4" sx={{ mb: 3 }}>
        {title}
      </Typography>

      {/* User စာရင်း ပြသသည့် List */}
      <List>
        <ListItem>
          <ListItemAvatar>
            <Avatar />
          </ListItemAvatar>
          <ListItemText
            primary="Alice @alice"
            secondary="Alice's profile bio"
          />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar />
          </ListItemAvatar>
          <ListItemText
            primary="Alice @alice"
            secondary="Alice's profile bio"
          />
        </ListItem>
      </List>
    </Box>
  );
}