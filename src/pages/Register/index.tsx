import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import type { JSX, FormEvent } from "react";
import { useState, useRef } from "react";
import { useApp } from "../../ThemedApp";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { postUser } from "../../lib/fetcher";
import type { User } from "../../types/user";

export default function Register(): JSX.Element {
  const { setGlobalMsg } = useApp();

  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const nameInput = useRef<HTMLInputElement>(null);
  const usernameInput = useRef<HTMLInputElement>(null);
  const bioInput = useRef<HTMLTextAreaElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = nameInput.current?.value;
    const username = usernameInput.current?.value;
    const bio = bioInput.current?.value;
    const password = passwordInput.current?.value;

    if (!name || !username || !password) {
      setError("name, username and password required");
      return false;
    }
    const newUser: User = { name, username, bio, password };
    create.mutate(newUser);
  };

  const create = useMutation<User, Error, User>({
    mutationFn: (data: User) => postUser(data), // သို့မဟုတ် တိုတိုတုတ်တုတ် postUser ပဲ ထားနိုင်သည်
    onError: (error) => {
      setError("Cannot create account");
      console.error(error);
    },
    onSuccess: () => {
      setGlobalMsg("Account Created");
      navigate("/login");
    },
  });

  return (
    <Box>
      <Typography variant="h3">Register</Typography>
      {error && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
          <TextField inputRef={nameInput} placeholder="Name" fullWidth />
          <TextField
            inputRef={usernameInput}
            placeholder="Username"
            fullWidth
          />
          <TextField inputRef={bioInput} placeholder="Bio" fullWidth />
          <TextField
            inputRef={passwordInput}
            type="password"
            placeholder="Password"
            fullWidth
          />
          <Button type="submit" variant="contained" fullWidth>
            Register
          </Button>
        </Box>
      </form>
    </Box>
  );
}
