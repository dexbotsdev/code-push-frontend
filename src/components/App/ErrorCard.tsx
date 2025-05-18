import React from "react";
import { Box, Typography } from "@mui/material";

interface ErrorCardProps {
  title?: string;
  message: string;
}

const ErrorCard: React.FC<ErrorCardProps> = ({ title = "Error", message }) => (
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
      mx: 2, // horizontal margin
    }}
  >
    <Typography
      variant="h5"
      sx={{ color: "#ff6f61", fontWeight: "bold", mb: 2 }}
    >
      {title}
    </Typography>
    <Typography
      variant="body1"
      sx={{ color: "white", textAlign: "center", mb: 2 }}
    >
      {message}
    </Typography>
  </Box>
);

export default ErrorCard;
