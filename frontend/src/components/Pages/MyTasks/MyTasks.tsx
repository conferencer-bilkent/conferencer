import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
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
  id: number;
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
    navigate(`/review/${paper.id}`, { state: { paper } });
  };

  const handleUpdateReview = (paper: Paper) => {
    navigate(`/review/${paper.id}`, {
      state: {
        paper,
        isUpdate: true,
      },
    });
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
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Authors</TableCell>
                  <TableCell>Track</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {unreviewedPapers.map((paper) => (
                  <TableRow key={paper.id}>
                    <TableCell>{paper.title}</TableCell>
                    <TableCell>
                      {formatAuthors(JSON.parse(paper.authors))}
                    </TableCell>
                    <TableCell>
                      {trackNames[paper.track] || "Loading..."}
                    </TableCell>
                    <TableCell>{formatDate(paper.submission_date)}</TableCell>
                    <TableCell>
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
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Authors</TableCell>
                  <TableCell>Track</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reviewedPapers.map((paper) => (
                  <TableRow key={paper.id}>
                    <TableCell>{paper.title}</TableCell>
                    <TableCell>
                      {formatAuthors(JSON.parse(paper.authors))}
                    </TableCell>
                    <TableCell>
                      {trackNames[paper.track] || "Loading..."}
                    </TableCell>
                    <TableCell>{formatDate(paper.submission_date)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <AppButton
                          icon={<Edit />}
                          text="Update Review"
                          onClick={() => handleUpdateReview(paper)}
                        />
                        <Button variant="contained" color="error">
                          Delete Review
                        </Button>
                      </Box>
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
