import { Box, CircularProgress, Typography } from "@mui/material";

type LoadingProps = {
  message?: string;
};

export default function Loading({ message = "Loading..." }: LoadingProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        py: 4,
        minHeight: 120,
      }}>
      <CircularProgress size={28} thickness={4} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
}
