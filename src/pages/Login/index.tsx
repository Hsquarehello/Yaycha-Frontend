import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { postLogin } from "../../lib/fetcher";
import { useMutation } from "@tanstack/react-query";
import type { User } from "../../types/user";

import { useApp } from "../../ThemedApp";

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

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useApp();

  const usernameInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>("");

  const login = useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: async ({ username, password }: LoginCredentials) =>
      await postLogin(username, password),

    onError: (err) => {
      setError(err.message || "Incorrect username or password");
    },
    onSuccess: (result) => {
      setAuth(result.user);
      localStorage.setItem("token", result.token);
      navigate("/");
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const username = usernameInput.current?.value;
    const password = passwordInput.current?.value;

    if (!username || !password) {
      setError("username and password required");
      return;
    }
    login.mutate({ username, password });
  };

  return (
    <Box sx={{ maxWidth: 420, mx: "auto", mt: 4 }}>
      <Typography variant="h3">Login</Typography>
      {error && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
          <TextField
            inputRef={usernameInput}
            label="Username"
            variant="outlined"
            fullWidth
            disabled={login.isPending}
          />
          <TextField
            inputRef={passwordInput}
            type="password"
            label="Password"
            variant="outlined"
            fullWidth
            disabled={login.isPending}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={login.isPending}>
            Login
          </Button>
        </Box>
      </form>
    </Box>
  );
}
