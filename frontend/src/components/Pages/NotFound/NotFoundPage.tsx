import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Typography, Box } from "@mui/material";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Extract the user ID from the URL

  const handleGoHome = () => {
    navigate("/home");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Typography variant="h1" sx={{ fontSize: "6rem", fontWeight: "bold" }}>
        404
      </Typography>
      <Typography variant="h6" sx={{ marginBottom: "20px" }}>
        Oops! The page you're looking for doesn't exist.
      </Typography>
      {id && (
        <Typography variant="body1" sx={{ marginBottom: "20px" }}>
          User ID: {id}
        </Typography>
      )}
      <Button variant="contained" color="primary" onClick={handleGoHome}>
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
