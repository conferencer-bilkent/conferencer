import React from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import AppButton from "../../../../global/AppButton";
import { FaArrowLeft, FaDownload, FaUserPlus, FaPen } from "react-icons/fa";
import {
  Box,
  Button,
  Typography,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { tokens } from "../../../../../theme";
import { Track } from "../../../../../models/conference";
import AppTitle from "../../../../global/AppTitle";

// Define the interface for location state
interface LocationState {
  paperId: number;
  activeTrack: Track | null;
  reviewData?: ReviewData;
}

// Define the interface for review data
interface ReviewData {
  title: string;
  completed: number;
  pending: number;
  decision: string;
  reviewers: Reviewer[];
}

interface Reviewer {
  name: string;
  deadline: string;
  uploaded: string;
  decision: string;
  confidence: number | string;
  file: string;
  feedback: boolean;
}

const mockReviewData = {
  title: "Impact of Virtual Reality on Cognitive Learning in Higher Education",
  completed: 3,
  pending: 1,
  decision: "None",
  reviewers: [
    {
      name: "Stephen Hawking",
      deadline: "17.12.2024",
      uploaded: "16.12.2024",
      decision: "reject -1",
      confidence: 3,
      file: "review-v1.txt",
      feedback: false,
    },
    {
      name: "Atilla Emre Söylemez",
      deadline: "17.12.2024",
      uploaded: "16.12.2024",
      decision: "neutral 0",
      confidence: 4,
      file: "myrev.txt",
      feedback: true,
    },
    {
      name: "Albert Einstein",
      deadline: "17.12.2024",
      uploaded: "16.12.2024",
      decision: "reject -4",
      confidence: 5,
      file: "review.txt",
      feedback: false,
    },
    {
      name: "Napoleon",
      deadline: "17.12.2024",
      uploaded: "Pending",
      decision: "Pending",
      confidence: "-",
      file: "-",
      feedback: false,
    },
  ],
};

const ReviewDetailPage: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the state passed from navigation
  const state = location.state as LocationState | undefined;
  const activeTrack = state?.activeTrack || null;
  const reviewData = state?.reviewData || mockReviewData;

  const handleBackToReviews = () => {
    navigate("/review", { 
      state: { 
        activeTrack
      } 
    });
  };

  return (
    <>
      <Box display="flex">
        {/* Main Content */}
        <Box flex="1" p={3}>
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography color={colors.grey[100]} variant="h4" fontWeight="bold">
              Completed Reviews: {reviewData.completed}, Pending:{" "}
              {reviewData.pending}
            </Typography>
            <AppButton
              onClick={handleBackToReviews}
              icon={<FaArrowLeft style={{ marginRight: 8 }} />}
              text="Switch Back to Reviews"
              
            />
          </Box>

          {/* Paper Title */}
          <AppTitle
            text={reviewData.title}>
              
            </AppTitle>

          {/* Actions Row */}
          <Box
            display="flex"
            justifyContent="center"
            gap={2}
            mb={3}
            flexWrap="wrap"
          >
            <AppButton icon={<FaPen />} text="Edit Decision" />
            <AppButton icon={<FaDownload />} text="Download Paper" />
            <AppButton icon={<FaUserPlus />} text="Assign More Reviewers" />
          </Box>

          {/* Current Decision */}
          <Typography
            variant="body1"
            mb={1}
            fontWeight="bold"
            color={colors.grey[300]}
          >
            Current decision:{" "}
            <Box
              display="inline"
              px={1.5}
              py={0.5}
              bgcolor={colors.redAccent[900]}
              borderRadius="8px"
              color={colors.grey[100]}
              ml={1}
            >
              {reviewData.decision}
            </Box>
          </Typography>

          {/* Table */}
          <TableContainer
            component={Paper}
            sx={{ backgroundColor: colors.primary[400], mt: 2 }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Reviewer</TableCell>
                  <TableCell>Deadline</TableCell>
                  <TableCell>Uploaded On</TableCell>
                  <TableCell>Decision</TableCell>
                  <TableCell>Confidence</TableCell>
                  <TableCell>Review</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reviewData.reviewers.map((r, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{r.deadline}</TableCell>
                    <TableCell>{r.uploaded}</TableCell>
                    <TableCell>{r.decision}</TableCell>
                    <TableCell>{r.confidence}</TableCell>
                    <TableCell>{r.file}</TableCell>
                    <TableCell align="center">
                      <Box display="flex" flexDirection="column" gap={1}>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: r.feedback
                              ? colors.blueAccent[500]
                              : colors.primary[600],
                            "&:hover": {
                              backgroundColor: colors.blueAccent[400],
                            },
                            borderRadius: "8px",
                            fontSize: "12px",
                          }}
                        >
                          {r.feedback ? "View/Edit Feedback" : "Add Feedback"}
                        </Button>
                        <Button
                          variant="outlined"
                          sx={{
                            borderColor: colors.grey[300],
                            color: colors.grey[100],
                            "&:hover": {
                              backgroundColor: colors.primary[500],
                            },
                            borderRadius: "8px",
                            fontSize: "12px",
                          }}
                        >
                          Reviewer's Profile
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
    </>
  );
};

export default ReviewDetailPage;
