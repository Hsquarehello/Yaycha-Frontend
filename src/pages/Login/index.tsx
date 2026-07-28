import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import type { FormEvent, JSX } from "react";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { postLogin } from "../../lib/fetcher";
import { useMutation } from "@tanstack/react-query";
import type { User } from "../../types/user";

import { useApp } from "../../ThemedApp";

export default function Login(): JSX.Element {
  const navigate = useNavigate();
  const { setAuth,setShowDrawer } = useApp();
  setShowDrawer(false)

  const usernameInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = usernameInput.current?.value;
    const password = passwordInput.current?.value;

    if (!username || !password) {
      setError("username and password required");
      return;
    }
    login.mutate({ username, password });
  };

  // 1. Request Data အတွက် Interface သတ်မှတ်ပါ
  interface LoginCredentials {
    username: string;
    password: string;
  }

  // 2. Response Data (postLogin က ပြန်ပေးမယ့် Data) အတွက် Interface သတ်မှတ်ပါ
  interface LoginResponse {
    token: string;
    user: User;
  }

  const login = useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: async ({ username, password }: LoginCredentials) =>
      await postLogin(username, password),

    onError: () => {
      setError("Incorrect username or password");
    },
    onSuccess: (result) => {
      setAuth(result.user);
      localStorage.setItem("token", result.token);
      navigate("/");
    },
  });

  return (
    <Box>
      <Typography variant="h3">Login</Typography>
      {error && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
          <TextField inputRef={usernameInput} placeholder="Username" fullWidth />
          <TextField inputRef={passwordInput} type="password" placeholder="Password" fullWidth />
          <Button type="submit" variant="contained" fullWidth>
            Login
          </Button>
        </Box>
      </form>
    </Box>
  );
}
