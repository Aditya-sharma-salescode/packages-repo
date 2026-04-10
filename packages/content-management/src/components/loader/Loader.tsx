import { Box, CircularProgress } from "@mui/material";

export function Loader({ size = 32 }: { size?: number }) {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress size={size} />
    </Box>
  );
}

