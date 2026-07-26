import { Box } from "@mui/material";
import type { JSX } from "react";
import UserList from "../../components/UserList";

export default function Likes(): JSX.Element {
  return (
    <Box>
      <UserList title="Likes" />
    </Box>
  );
}
