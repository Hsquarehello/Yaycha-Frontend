import { Box, Card, CardContent, Typography, IconButton } from "@mui/material";
import type { FormEvent } from "react";
import {
  Alarm as TimeIcon,
  AccountCircle as UserIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

import { green } from "@mui/material/colors";

import { useNavigate } from "react-router-dom";

interface ItemType {
  id: number;
  content: string;
  name: string;
}

export default function Item({
  item,
  remove,
}: {
  item: ItemType;
  remove: (id: number | string) => void;
}) {
  const navigate = useNavigate();
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent onClick={() => navigate("/comments/1")}>
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
              A few second ago
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={(e:FormEvent) => {
              remove(item.id);
              e.stopPropagation();
            }}>
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </Box>
        <Typography sx={{ my: 3 }}>{item.content}</Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
          }}>
          <UserIcon sx={{ fontSize: 12 }} color="info" />
          <Typography variant="caption">{item.name}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
