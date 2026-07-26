import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import type { FormEvent, JSX } from "react";
import { useNavigate } from "react-router-dom";

import { useApp } from "../../ThemedApp";

export default function Login(): JSX.Element {
  const navigate = useNavigate();
  const { setAuth } = useApp();

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setAuth(true);
    navigate("/");
  };

  return (
    <Box>
      <Typography variant="h3">Login</Typography>
      <Alert severity="warning" sx={{ mt: 2 }}>
        All fields required
      </Alert>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
          <TextField placeholder="Username" fullWidth />
          <TextField type="password" placeholder="Password" fullWidth />
          <Button type="submit" variant="contained" fullWidth>
            Login
          </Button>
        </Box>
      </form>
    </Box>
  );
}