import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingCard: React.FC = () => (
  <Box
    sx={{
      backgroundColor: "#2c2c3e",
      borderRadius: "8px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
      padding: "40px 32px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 2,
      minWidth: 350,
      width: "100%",
      maxWidth: 600,
      mx: 2,
    }}
  >
    <Typography
      variant="h5"
      sx={{ color: "#ffffff", fontWeight: "bold", mb: 2 }}
    >
      Loading Apps
    </Typography>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mt: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="body1" sx={{ marginLeft: 4, color: "white" }}>
        Please wait while we load your apps...
      </Typography>
    </Box>
  </Box>
);

export default LoadingCard;
