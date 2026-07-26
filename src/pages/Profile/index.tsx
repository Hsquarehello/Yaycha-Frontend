import { Avatar, Box, Typography } from "@mui/material";
import { pink } from "@mui/material/colors";
import type { JSX } from "react";
import Item from "../../components/Item";

// Item Component ရဲ့ Props Type သတ်မှတ်ခြင်း
interface ItemData {
  id: number;
  content: string;
  name: string;
}

export default function Profile(): JSX.Element {
  const dummyItem: ItemData = {
    id: 1,
    content: "A post content from Alice",
    name: "Alice",
  };

  const handleRemove = (): void => {
    // Post ဖျက်တဲ့ Logic ရေးရန်
  };

  return (
    <Box>
      {/* Profile Cover Banner */}
      <Box sx={{ bgcolor: "banner", height: 150, borderRadius: 4 }} />

      {/* Profile Avatar & Info Section */}
      <Box
        sx={{
          mb: 4,
          marginTop: "-60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Avatar sx={{ width: 100, height: 100, bgcolor: pink[500] }} />
        <Box sx={{ textAlign: "center" }}>
          <Typography>Alice</Typography>
          <Typography sx={{ fontSize: "0.8em", color: "text.fade" }}>
            Alice's profile bio content here
          </Typography>
        </Box>
      </Box>

      {/* User Post Item */}
      <Item key={dummyItem.id} remove={handleRemove} item={dummyItem} />
    </Box>
  );
}