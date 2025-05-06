import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from "@mui/material";

import AppButton from "../../../components/global/AppButton";
import { RateReview, Edit } from "@mui/icons-material";
import { useUser } from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../../theme";
interface Assignment {
  id: number;
  paper_id: number;
  reviewer_id: string;
  is_pending: boolean;
  review?: string;
  decision?: string;
  confidence?: number;
}

interface Paper {
  _id: string;
  authors: string;
  title: string;
  keywords: string;
  track: string;
  submission_date: string;
  file_path: string;
  review?: string;
  decision?: string;
  confidence?: number;
}

const MyTasks: React.FC = () => {
  const theme = useTheme();
  const { user } = useUser();
  const navigate = useNavigate();
  const [unreviewedPapers, setUnreviewedPapers] = useState<Paper[]>([]);
  const [reviewedPapers, setReviewedPapers] = useState<Paper[]>([]);
  const [trackNames, setTrackNames] = useState<{ [key: string]: string }>({});

  const colors = tokens(theme.palette.mode);

  const tableCellStyle: React.CSSProperties = {
    padding: "8px",
    color: colors.grey[100],
    borderBottom: `1px solid ${colors.grey[100]}`,
    borderRight: `1px solid ${colors.grey[100]}`,
    borderTop: `1px solid ${colors.grey[100]}`,
    borderLeft: `1px solid ${colors.grey[100]}`,
    backgroundColor: colors.primary[400],
  };

  const titleCellStyle: React.CSSProperties = {
    ...tableCellStyle,
    maxWidth: "300px", // Limit width
    whiteSpace: "normal", // Allow text wrapping
    wordWrap: "break-word", // Break long words if needed
  };

  const tableContainerStyle: React.CSSProperties = {
    border: `1px solid ${colors.grey[100]}`,
    borderRadius: "12px",
    backgroundColor: colors.primary[500],
  };

  const formatAuthors = (authors: any[]) => {
    if (!Array.isArray(authors)) return "";
    return authors
      .map((author) => `${author.lastname}, ${author.firstname}`)
      .join("; ");
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

  const fetchPaperDetails = async (paperId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/paper/${paperId}`, {
        credentials: "include",
      });
      const paperData = await response.json();
      console.log("Paper Data:", paperData); // Debugging line
      return paperData;
    } catch (error) {
      console.error(`Error fetching paper ${paperId}:`, error);
      return null;
    }
  };

  const fetchTrackDetails = async (trackId: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/track/${trackId}`, {
        credentials: "include",
      });
      const trackData = await response.json();
      console.log("Track Data:", trackData); // Debugging line
      return trackData.track_name || "Unknown Track";
    } catch (error) {
      console.error(`Error fetching track ${trackId}:`, error);
      return "Unknown Track";
    }
  };

  const handleMakeReview = (paper: Paper) => {
    navigate(`/review/${paper._id}`, { state: { paper } });
  };

  const handleUpdateReview = async (paper: Paper) => {
    try {
      // 1. Get all reviews for the paper
      const reviewsResponse = await fetch(
        `http://127.0.0.1:5000/review/paper/${paper._id}`,
        {
          credentials: "include",
        }
      );
      const reviewsData = await reviewsResponse.json();
      console.log("Reviews Data:", reviewsData); // Debugging line
      // 2. Find the review by the current user
      const userReview = reviewsData.reviews.find(
        (review: any) => review.reviewer_id === user?.id
      );
      if (!userReview) {
        console.error("Review not found for this user");
        return;
      }

      // 3. Get the specific review details
      const reviewResponse = await fetch(
        `http://127.0.0.1:5000/review/${userReview._id}`,
        {
          credentials: "include",
        }
      );
      const reviewDetails = await reviewResponse.json();

      // Navigate to review page with both paper and review data
      navigate(`/review/${paper._id}`, {
        state: {
          paper,
          isUpdate: true,
          reviewData: reviewDetails,
        },
      });
    } catch (error) {
      console.error("Error fetching review details:", error);
    }
  };

  useEffect(() => {
    const fetchPapers = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(
          `http://localhost:5000/assignment/reviewer/${user.id}`,
          { credentials: "include" }
        );
        const assignments: Assignment[] = await response.json();

        // Fetch complete paper details for each assignment
        const papersWithDetails = await Promise.all(
          assignments.map(async (assignment) => {
            const paperDetails = await fetchPaperDetails(assignment.paper_id);
            return {
              ...paperDetails,
              review: assignment.review,
              decision: assignment.decision,
              confidence: assignment.confidence,
              is_pending: assignment.is_pending,
            };
          })
        );

        // Split papers based on is_pending flag
        const reviewed = papersWithDetails.filter((paper) => !paper.is_pending);
        const unreviewed = papersWithDetails.filter(
          (paper) => paper.is_pending
        );

        setReviewedPapers(reviewed);
        setUnreviewedPapers(unreviewed);
      } catch (error) {
        console.error("Error fetching papers:", error);
      }
    };

    fetchPapers();
  }, [user?.id]);

  useEffect(() => {
    const fetchTrackNames = async () => {
      const tracks: { [key: string]: string } = {};
      const uniqueTrackIds = [
        ...new Set(
          [...unreviewedPapers, ...reviewedPapers].map((paper) => paper.track)
        ),
      ];

      for (const trackId of uniqueTrackIds) {
        const trackName = await fetchTrackDetails(trackId);
        tracks[trackId] = trackName;
      }
      console.log("Track Nsssames:", unreviewedPapers); // Debugging line

      setTrackNames(tracks);
    };

    if (unreviewedPapers.length > 0 || reviewedPapers.length > 0) {
      fetchTrackNames();
    }
  }, [unreviewedPapers, reviewedPapers]);

  return (
    <div style={{ display: "flex", minHeight: "100%" }}>
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.primary,
          padding: "2rem",
        }}
      >
        <Typography variant="h4" gutterBottom>
          {user?.name} {user?.surname}'s Tasks
        </Typography>

        {/* Unreviewed Papers */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Unreviewed Papers
          </Typography>
          <TableContainer component={Paper} style={tableContainerStyle}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={titleCellStyle}>Title</TableCell>
                  <TableCell style={tableCellStyle}>Authors</TableCell>
                  <TableCell style={tableCellStyle}>Track</TableCell>
                  <TableCell style={tableCellStyle}>Date</TableCell>
                  <TableCell style={tableCellStyle}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {unreviewedPapers.map((paper) => (
                  <TableRow key={paper._id}>
                    <TableCell style={titleCellStyle}>{paper.title}</TableCell>
                    <TableCell style={tableCellStyle}>
                      {formatAuthors(JSON.parse(paper.authors))}
                    </TableCell>
                    <TableCell style={tableCellStyle}>
                      {trackNames[paper.track] || "Loading..."}
                    </TableCell>
                    <TableCell style={tableCellStyle}>
                      {formatDate(paper.submission_date)}
                    </TableCell>
                    <TableCell style={tableCellStyle}>
                      <AppButton
                        icon={<RateReview />}
                        text="Make Review"
                        onClick={() => handleMakeReview(paper)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Reviewed Papers */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Reviewed Papers
          </Typography>
          <TableContainer component={Paper} style={tableContainerStyle}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={titleCellStyle}>Title</TableCell>
                  <TableCell style={tableCellStyle}>Authors</TableCell>
                  <TableCell style={tableCellStyle}>Track</TableCell>
                  <TableCell style={tableCellStyle}>Date</TableCell>
                  <TableCell style={tableCellStyle}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reviewedPapers.map((paper) => (
                  <TableRow key={paper._id}>
                    <TableCell style={titleCellStyle}>{paper.title}</TableCell>
                    <TableCell style={tableCellStyle}>
                      {formatAuthors(JSON.parse(paper.authors))}
                    </TableCell>
                    <TableCell style={tableCellStyle}>
                      {trackNames[paper.track] || "Loading..."}
                    </TableCell>
                    <TableCell style={tableCellStyle}>
                      {formatDate(paper.submission_date)}
                    </TableCell>
                    <TableCell style={tableCellStyle}>
                      <AppButton
                        icon={<Edit />}
                        text="Update Review"
                        onClick={() => handleUpdateReview(paper)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </div>
  );
};

export default MyTasks;
