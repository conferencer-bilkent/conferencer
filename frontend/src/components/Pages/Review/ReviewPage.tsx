import React, { useState, useEffect } from "react";
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
  const isUpdate = location.state?.isUpdate;
  const existingReview = location.state?.reviewData;

  const [reviewData, setReviewData] = useState({
    evaluation: 0,
    evaluation_text: "",
    confidence: 3, // Changed default to 3
    remarks: "",
    sub_firstname: "",
    sub_lastname: "",
    sub_email: "",
  });

  useEffect(() => {
    if (isUpdate && existingReview) {
      setReviewData({
        evaluation: existingReview.evaluation || 0,
        evaluation_text: existingReview.evaluation_text || "",
        confidence: existingReview.confidence || 3,
        remarks: existingReview.remarks || "",
        sub_firstname: existingReview.subreviewer?.first_name || "",
        sub_lastname: existingReview.subreviewer?.last_name || "",
        sub_email: existingReview.subreviewer?.email || "",
      });
    }
  }, [isUpdate, existingReview]);

  // Add evaluation level labels
  const evaluationLabels = {
    "-2": "Rejected",
    "-1": "Slightly Rejected",
    "0": "Neutral",
    "1": "Slightly Accepted",
    "2": "Accepted",
  };

  const [trackName, setTrackName] = useState<string>("Loading...");

  useEffect(() => {
    const fetchTrackName = async () => {
      if (!paper?.track) return;
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/track/${paper.track}`,
          {
            credentials: "include",
          }
        );
        const trackData = await response.json();
        setTrackName(trackData.track_name || "Unknown Track");
      } catch (error) {
        console.error("Error fetching track:", error);
        setTrackName("Unknown Track");
      }
    };

    fetchTrackName();
  }, [paper?.track]);

  const formatAuthors = (authors: string) => {
    try {
      const authorArray = JSON.parse(authors);
      return authorArray
        .map((author: any) => `${author.lastname}, ${author.firstname}`)
        .join("; ");
    } catch (e) {
      return authors;
    }
  };

  const formatDate = (dateObj: any) => {
    if (!dateObj || !dateObj.$date) return "No date";
    const date = new Date(dateObj.$date);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownloadPaper = async () => {
    try {
      console.log("Downloading paper with ID:", paper._id); // Debugging line
      const response = await fetch(
        `http://localhost:5000/paper/${paper._id}/download`,
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
        link.download = `paper_${paper.title}.pdf`;
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
      // Prepare submission data
      const submissionData = {
        reviewer_name: `${user?.name} ${user?.surname}`,
        evaluation: reviewData.evaluation,
        evaluation_text: reviewData.evaluation_text,
        confidence: reviewData.confidence,
        remarks: reviewData.remarks,
        // Only include sub-reviewer info if any field is filled
        ...(reviewData.sub_firstname ||
        reviewData.sub_lastname ||
        reviewData.sub_email
          ? {
              sub_firstname: reviewData.sub_firstname,
              sub_lastname: reviewData.sub_lastname,
              sub_email: reviewData.sub_email,
            }
          : {}),
      };
      console.log("Submission Data:", submissionData); // Debugging line
      console.log(existingReview._id); // Debugging line
      const url = isUpdate
        ? `http://127.0.0.1:5000/review/${existingReview._id}/update`
        : `http://127.0.0.1:5000/review/submit/${paper._id}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
        credentials: "include",
      });

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
                <strong>Authors:</strong> {formatAuthors(paper.authors)}
              </Typography>
              <Typography>
                <strong>Keywords:</strong> {paper.keywords}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography>
                <strong>Track:</strong> {trackName}
              </Typography>
              <Typography>
                <strong>Submission Date:</strong>{" "}
                {formatDate(paper.submission_date)}
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
                label="Evaluation Text"
                value={reviewData.evaluation_text}
                onChange={(e) =>
                  setReviewData({
                    ...reviewData,
                    evaluation_text: e.target.value,
                  })
                }
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Typography gutterBottom>Evaluation Score</Typography>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={reviewData.evaluation}
                  min={-2}
                  max={2}
                  step={1}
                  sx={{
                    "& .MuiSlider-markLabel": {
                      "&[data-index='0']": { ml: -2 },
                      "&[data-index='4']": { mr: -2 },
                    },
                  }}
                  marks={Object.entries(evaluationLabels).map(
                    ([value, label]) => ({
                      value: Number(value),
                      label,
                    })
                  )}
                  onChange={(_, value) =>
                    setReviewData({
                      ...reviewData,
                      evaluation: value as number,
                    })
                  }
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography gutterBottom>Confidence Level (1-5)</Typography>
              <Slider
                value={reviewData.confidence}
                min={1}
                max={5}
                step={1}
                marks={[
                  { value: 1, label: "1" },
                  { value: 2, label: "2" },
                  { value: 3, label: "3" },
                  { value: 4, label: "4" },
                  { value: 5, label: "5" },
                ]}
                onChange={(_, value) =>
                  setReviewData({ ...reviewData, confidence: value as number })
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Remarks"
                placeholder="e.g., Minor revisions required before acceptance."
                value={reviewData.remarks}
                onChange={(e) =>
                  setReviewData({ ...reviewData, remarks: e.target.value })
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
