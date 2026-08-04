import { Box, Typography, Paper } from "@mui/material";
import { keyframes } from "@mui/system";

const moveBar = keyframes`
  0% {
    left: -35%;
    width: 30%;
  }
  50% {
    left: 40%;
    width: 50%;
  }
  100% {
    left: 100%;
    width: 30%;
  }
`;

const textPulse = keyframes`
  0%, 100% { opacity: 0.9; }
  50% { opacity: 0.4; }
`;

type LoadingProps = {
  message?: string;
  fullScreen?: boolean;
};

export default function Loading({
  message = "Loading...",
  fullScreen = false,
}: LoadingProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: fullScreen ? "100vh" : "200px",
        width: "100%",
        p: 2,
        backgroundColor: "#121212", // ပုံထဲက Main Dark Background အရောင်
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          minWidth: 260,
          borderRadius: 2,
          backgroundColor: "#212121", // ပုံထဲက Card background အရောင်
          border: "1px solid #2d2d2d", // Card Border အရောင်
        }}
      >
        {/* Animated Custom Line Loader */}
        <Box
          sx={{
            height: 4,
            width: "100%",
            backgroundColor: "#2c3b32", // Bar ရဲ့ Track background အရောင်
            borderRadius: 2,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              height: "100%",
              backgroundColor: "#00e676", // Yaycha ရဲ့ Accent Green အရောင်
              borderRadius: 2,
              boxShadow: "0 0 10px rgba(0, 230, 118, 0.5)",
              animation: `${moveBar} 1.5s infinite ease-in-out`,
            }}
          />
        </Box>

        {/* Loading Message */}
        {message && (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: "#aaa", // Muted Text Color
              animation: `${textPulse} 1.5s infinite ease-in-out`,
            }}
          >
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}