import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Slider,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useUser } from "../../../context/UserContext";

const ReviewPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const paper = location.state?.paper;

  const [reviewData, setReviewData] = useState({
    evaluation: "",
    confidence: 3,
    sub_firstname: "",
    sub_lastname: "",
    sub_email: "",
  });

  const handleDownloadPaper = async () => {
    try {
      console.log("Downloading paper with ID:", paper.id); // Debugging line
      const response = await fetch(
        `http://localhost:5000/paper/${paper.id}/download`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        // Create a blob from the PDF Stream
        const blob = await response.blob();
        // Create a link element
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `paper_${paper.id}.pdf`;
        // Trigger download
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        console.error("Failed to download paper");
      }
    } catch (error) {
      console.error("Error downloading paper:", error);
    }
  };

  if (!paper) {
    return <Typography>No paper data found</Typography>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/review/submit/${paper.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...reviewData,
            reviewer_name: `${user?.name} ${user?.surname}`,
          }),
          credentials: "include",
        }
      );

      if (response.ok) {
        navigate("/my-tasks");
      } else {
        console.error("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Review Paper
      </Typography>

      {/* Paper Details Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6">Paper Details</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography>
                <strong>Title:</strong> {paper.title}
              </Typography>
              <Typography>
                <strong>Authors:</strong> {paper.authors}
              </Typography>
              <Typography>
                <strong>Keywords:</strong> {paper.keywords}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography>
                <strong>Track:</strong> {paper.track}
              </Typography>
              <Typography>
                <strong>Submission Date:</strong> {paper.submission_date}
              </Typography>
              <Typography>
                <strong>Paper: </strong>
                <Button onClick={handleDownloadPaper} color="primary">
                  Download Paper
                </Button>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Review Form */}
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Evaluation"
                value={reviewData.evaluation}
                onChange={(e) =>
                  setReviewData({ ...reviewData, evaluation: e.target.value })
                }
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Typography gutterBottom>Confidence Level (1-5)</Typography>
              <Slider
                value={reviewData.confidence}
                min={1}
                max={5}
                step={1}
                marks
                onChange={(_, value) =>
                  setReviewData({ ...reviewData, confidence: value as number })
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Sub-reviewer Information (Optional)
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Sub-reviewer First Name"
                value={reviewData.sub_firstname}
                onChange={(e) =>
                  setReviewData({
                    ...reviewData,
                    sub_firstname: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Sub-reviewer Last Name"
                value={reviewData.sub_lastname}
                onChange={(e) =>
                  setReviewData({ ...reviewData, sub_lastname: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Sub-reviewer Email"
                type="email"
                value={reviewData.sub_email}
                onChange={(e) =>
                  setReviewData({ ...reviewData, sub_email: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/my-tasks")}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Submit Review
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ReviewPage;
