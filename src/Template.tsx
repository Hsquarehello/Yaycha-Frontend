import { Box, Container, Snackbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import AppDrawer from "./components/AppDrawer";
import { useApp } from "./ThemedApp";

export default function Template() {
  const { globalMsg, setGlobalMsg, showDrawer } = useApp();
  return (
    <Box inert={showDrawer ? true : undefined}>
      <Header />
      <AppDrawer />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Outlet />
      </Container>
      <Snackbar
        anchorOrigin={{
          horizontal: "center",
          vertical: "top",
        }}
        open={Boolean(globalMsg)}
        autoHideDuration={6000}
        onClose={() => setGlobalMsg(null)}
        message={globalMsg}
      />
    </Box>
  );
}
