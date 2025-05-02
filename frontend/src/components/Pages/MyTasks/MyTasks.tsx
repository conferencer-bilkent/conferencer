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

interface User {
  id: string;
  name: string;
  surname: string;
}

interface Assignment {
  id: number;
  paper_id: number;
  reviewer_id: string;
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

  const fetchPaperDetails = async (paperId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/paper/${paperId}`);
      const paperData = await response.json();
      console.log("Paper Data:", paperData); // Debugging line
      return paperData;
    } catch (error) {
      console.error(`Error fetching paper ${paperId}:`, error);
      return null;
    }
  };

  const handleMakeReview = (paper: Paper) => {
    navigate(`/review/${paper.id}`, { state: { paper } });
  };

  useEffect(() => {
    const fetchPapers = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(
          `http://localhost:5000/assignment/reviewer/${user.id}`
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
            };
          })
        );

        // Split papers into reviewed and unreviewed
        const reviewed = papersWithDetails.filter((paper) => paper.review);
        const unreviewed = papersWithDetails.filter((paper) => !paper.review);

        setReviewedPapers(reviewed);
        setUnreviewedPapers(unreviewed);
      } catch (error) {
        console.error("Error fetching papers:", error);
      }
    };

    fetchPapers();
  }, [user?.id]);

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
                  <TableCell>#</TableCell>
                  <TableCell>Authors</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Keywords</TableCell>
                  <TableCell>Track</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Paper</TableCell>
                  <TableCell>Decision</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {unreviewedPapers.map((paper) => (
                  <TableRow key={paper.id}>
                    <TableCell>{paper.id}</TableCell>
                    <TableCell>{paper.authors}</TableCell>
                    <TableCell>{paper.title}</TableCell>
                    <TableCell>{paper.keywords}</TableCell>
                    <TableCell>{paper.track}</TableCell>
                    <TableCell>{paper.submission_date}</TableCell>
                    <TableCell>
                      <a href={`/${paper.file_path}`}>{paper.file_path}</a>
                    </TableCell>
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
                  <TableCell>#</TableCell>
                  <TableCell>Authors</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Keywords</TableCell>
                  <TableCell>Track</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Paper</TableCell>
                  <TableCell>Decision</TableCell>
                  <TableCell>Review</TableCell>
                  <TableCell>Confidence</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reviewedPapers.map((paper) => (
                  <TableRow key={paper.id}>
                    <TableCell>{paper.id}</TableCell>
                    <TableCell>{paper.authors}</TableCell>
                    <TableCell>{paper.title}</TableCell>
                    <TableCell>{paper.keywords}</TableCell>
                    <TableCell>{paper.track}</TableCell>
                    <TableCell>{paper.submission_date}</TableCell>
                    <TableCell>
                      <a href={`/${paper.file_path}`}>{paper.file_path}</a>
                    </TableCell>
                    <TableCell>{paper.decision}</TableCell>
                    <TableCell>
                      <a href={`/${paper.review}`}>{paper.review}</a>
                    </TableCell>
                    <TableCell>{paper.confidence}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <AppButton
                          icon={<Edit />}
                          text="Update Review"
                          onClick={() =>
                            console.log(`Updating review ${paper.id}`)
                          }
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
