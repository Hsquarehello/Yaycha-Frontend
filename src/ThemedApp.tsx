import { createContext, useContext, useState, useMemo } from "react";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";

import { deepPurple, grey } from "@mui/material/colors";

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

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Template from "./Template";
import { routes } from "./routes/routes";

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
  auth: any;
  setAuth: React.Dispatch<React.SetStateAction<any>>;
};

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
  const [mode, setMode] = useState<"light" | "dark">("dark");
  const [showDrawer, setShowDrawer] = useState(false);
  const [globalMsg, setGlobalMsg] = useState<string | null>(null);
  const [auth, setAuth] = useState(null);

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

  return (
    <ThemeProvider theme={theme}>
      <AppContext.Provider
        value={{
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
        }}>
        <RouterProvider router={router} />
        <CssBaseline />
      </AppContext.Provider>
    </ThemeProvider>
  );
}
