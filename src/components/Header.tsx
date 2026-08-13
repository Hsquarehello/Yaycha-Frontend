import { useApp } from "../ThemedApp";

import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
} from "@mui/material";

import {
  Menu as MenuIcon,
  Add as AddIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Search as SearchIcon,
  Notifications as NotiIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchNotis } from "../lib/fetcher";
import type { Noti } from "../types/noti";
import { useMemo } from "react";

export default function Header() {
  const {
    showForm,
    auth,
    setShowForm,
    mode,
    setMode,
    setShowDrawer,
    setGlobalMsg,
  } = useApp();
  const navigate = useNavigate();

  const { data } = useQuery<Noti[]>({
    queryKey: ["notis"],
    queryFn: fetchNotis,
    enabled: !!auth,
  });

  const unreadCount = useMemo(() => {
    if (!auth || !data) return 0;
    return data.filter((noti) => !noti.read).length;
  }, [auth, data]);

  const handleAddClick = () => {
    if (!auth) {
      setGlobalMsg("Please login account!");
      return;
    }
    setShowForm(!showForm);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={() => setShowDrawer(true)}>
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, ml: 2, cursor: "pointer" }}
          onClick={() => navigate("/")}>
          Yaycha
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton color="inherit" onClick={handleAddClick}>
            <AddIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate("/search")}>
            <SearchIcon />
          </IconButton>
          {auth && (
            <IconButton color="inherit" onClick={() => navigate("/notis")}>
              <Badge
                color="error"
                badgeContent={unreadCount}
                max={99}
                invisible={unreadCount === 0}>
                <NotiIcon />
              </Badge>
            </IconButton>
          )}
          <IconButton
            color="inherit"
            edge="end"
            onClick={() => setMode(mode === "dark" ? "light" : "dark")}>
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
