import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import type { FormEvent } from "react";
import { useState, useRef } from "react";
import { useApp } from "../../ThemedApp";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { postUser } from "../../lib/fetcher";
import type { User, RegisterUser } from "../../types/user";

export default function Register() {
  const { setGlobalMsg } = useApp();
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const nameInput = useRef<HTMLInputElement>(null);
  const usernameInput = useRef<HTMLInputElement>(null);
  const bioInput = useRef<HTMLTextAreaElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);

  const create = useMutation<User, Error, RegisterUser>({
    mutationFn: postUser,
    onError: (error) => {
      setError(error.message || "Cannot create account");
      console.error(error);
    },
    onSuccess: () => {
      setGlobalMsg("Account Created");
      navigate("/login");
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const name = nameInput.current?.value;
    const username = usernameInput.current?.value;
    const bio = bioInput.current?.value;
    const password = passwordInput.current?.value;

    if (!name || !username || !password) {
      setError("name, username and password required");
      return;
    }

    const newUser: RegisterUser = { name, username, bio, password };
    create.mutate(newUser);
  };

  return (
    <Box sx={{ maxWidth: 420, mx: "auto", mt: 4 }}>
      <Typography variant="h3">Register</Typography>

      {error && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
          <TextField
            inputRef={nameInput}
            label="Name"
            fullWidth
            disabled={create.isPending}
          />
          <TextField
            inputRef={usernameInput}
            label="Username"
            fullWidth
            disabled={create.isPending}
          />
          <TextField
            inputRef={bioInput}
            multiline
            rows={3}
            label="Bio"
            fullWidth
            disabled={create.isPending}
          />
          <TextField
            inputRef={passwordInput}
            type="password"
            label="Password"
            fullWidth
            disabled={create.isPending}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={create.isPending}>
            Register
          </Button>
        </Box>
      </form>
    </Box>
  );
}
