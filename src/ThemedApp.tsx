import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { deepPurple, grey } from "@mui/material/colors";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Template from "./Template";
import { routes } from "./routes/routes";
import { fetchVerify } from "./lib/fetcher";
import type { User } from "./types/user";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

declare module "@mui/material/styles" {
  // palette.banner အတွက်
  interface Palette {
    banner: string;
  }
  interface PaletteOptions {
    banner?: string;
  }

  interface TypeText {
    fade: string;
  }
}

// define AppContexType
type AppContextType = {
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  mode: "light" | "dark";
  setMode: React.Dispatch<React.SetStateAction<"light" | "dark">>;
  showDrawer: boolean;
  setShowDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  globalMsg: string | null;
  setGlobalMsg: React.Dispatch<React.SetStateAction<string | null>>;
  auth: User | null;
  setAuth: React.Dispatch<React.SetStateAction<User | null>>;
};

export const queryClient = new QueryClient();

const AppContext = createContext<AppContextType>({
  showForm: false,
  setShowForm: () => {},
  mode: "dark",
  setMode: () => {},
  showDrawer: false,
  setShowDrawer: () => {},
  globalMsg: null,
  setGlobalMsg: () => {},
  auth: null,
  setAuth: () => {},
});

export const useApp = () => {
  return useContext(AppContext);
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Template />,
    children: routes,
  },
]);

export default function ThemedApp() {
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState<"light" | "dark">(() => {
    const savedMode = localStorage.getItem("themeMode");
    return (savedMode as "light" | "dark") || "dark";
  });
  const [showDrawer, setShowDrawer] = useState(false);
  const [globalMsg, setGlobalMsg] = useState<string | null>(null);
  const [auth, setAuth] = useState<User | null>(null);

  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  useEffect(() => {
    fetchVerify().then((user) => {
      if (user) setAuth(user);
    });
  }, []);

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: mode,
        primary: deepPurple,
        banner: mode === "dark" ? grey[800] : grey[200],
        text: {
          fade: grey[500],
        },
      },
    });
  }, [mode]);

  const appContextValue = useMemo(
    () => ({
      showForm,
      setShowForm,
      mode,
      setMode,
      showDrawer,
      setShowDrawer,
      globalMsg,
      setGlobalMsg,
      auth,
      setAuth,
    }),
    [showForm, mode, showDrawer, globalMsg, auth],
  );

  return (
    <ThemeProvider theme={theme}>
      <AppContext.Provider value={appContextValue}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        <CssBaseline />
      </AppContext.Provider>
    </ThemeProvider>
  );
}
