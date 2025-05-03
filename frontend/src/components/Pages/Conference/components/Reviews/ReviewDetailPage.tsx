import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  Paper as MuiPaper,
  CircularProgress,
} from "@mui/material";
import { tokens } from "../../../../../theme";
import { Track } from "../../../../../models/conference";
import AppTitle from "../../../../global/AppTitle";
import { Paper } from "../../../../../models/paper";
import { getAssignmentsByPaper } from "../../../../../services/trackService";
import { Assignment } from "../../../../../models/assignment";
import { getUserById } from "../../../../../services/userService";

// Define the interface for location state
interface LocationState {
  paper?: Paper;
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

// New interface to track assignment data with reviewer details
interface AssignmentWithReviewer extends Assignment {
  reviewerName: string;
}

const ReviewDetailPage: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true);
  const [paperAssignments, setPaperAssignments] = useState<
    AssignmentWithReviewer[]
  >([]);

  // Get the state passed from navigation
  const state = location.state as LocationState | undefined;
  const activeTrack = state?.activeTrack || null;
  const reviewData = state?.reviewData;
  const selectedPaper = state?.paper;

  // Assign a fallback for reviewData
  const reviewDataDisplay: ReviewData = reviewData
    ? reviewData
    : {
        title: "",
        completed: 0,
        pending: 0,
        decision: "-",
        reviewers: [],
      };

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!selectedPaper?._id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch assignments for this paper
        const assignments = await getAssignmentsByPaper(selectedPaper.id);

        // For each assignment, get the reviewer information
        const assignmentsWithReviewers = await Promise.all(
          assignments.map(async (assignment) => {
            try {
              const reviewer = await getUserById(assignment.reviewer_id);
              return {
                ...assignment,
                reviewerName: reviewer
                  ? `${reviewer.name} ${reviewer.surname}`
                  : "Unknown",
              };
            } catch (error) {
              console.error(
                `Error fetching reviewer ${assignment.reviewer_id}:`,
                error
              );
              return {
                ...assignment,
                reviewerName: "Unknown",
              };
            }
          })
        );

        setPaperAssignments(assignmentsWithReviewers);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [selectedPaper]);

  const handleBackToReviews = () => {
    navigate("/review", {
      state: { activeTrack },
    });
  };

  // Format date from MongoDB format to readable string
  const formatDate = (dateObj: { $date: string } | undefined) => {
    if (!dateObj) return "-";
    try {
      const date = new Date(dateObj.$date);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return "-";
    }
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
              Completed Reviews: {reviewDataDisplay.completed}, Pending:{" "}
              {reviewDataDisplay.pending}
            </Typography>
            <AppButton
              onClick={handleBackToReviews}
              icon={<FaArrowLeft style={{ marginRight: 8 }} />}
              text="Switch Back to Reviews"
            />
          </Box>

          {/* Paper Title */}
          <AppTitle text={selectedPaper?.title || "Untitled Paper"} />

          {/* Actions Row */}
          <Box
            padding={2}
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
              {reviewDataDisplay.decision}
            </Box>
          </Typography>

          {/* Table */}
          <TableContainer
            component={MuiPaper}
            sx={{ backgroundColor: colors.primary[400], mt: 2 }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Reviewer</TableCell>
                  <TableCell>Deadline</TableCell>
                  <TableCell>Assigned On</TableCell>
                  <TableCell>Review Uploaded On</TableCell>
                  <TableCell>Decision</TableCell>
                  <TableCell>Confidence</TableCell>
                  <TableCell>Review</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow key="loading-row">
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      <CircularProgress
                        size={40}
                        sx={{ color: colors.blueAccent[400] }}
                      />
                    </TableCell>
                  </TableRow>
                ) : paperAssignments.length > 0 ? (
                  paperAssignments.map((assignment, index) => (
                    <TableRow key={`${assignment._id}-${index}`}>
                      <TableCell sx={{ color: colors.grey[100] }}>
                        {assignment.reviewerName}
                      </TableCell>
                      <TableCell sx={{ color: colors.grey[100] }}>-</TableCell>
                      <TableCell sx={{ color: colors.grey[100] }}>
                        {formatDate(assignment.created_at)}
                      </TableCell>
                      <TableCell sx={{ color: colors.grey[100] }}>-</TableCell>
                      <TableCell sx={{ color: colors.grey[100] }}>-</TableCell>
                      <TableCell sx={{ color: colors.grey[100] }}>-</TableCell>
                      <TableCell sx={{ color: colors.grey[100] }}>-</TableCell>
                      <TableCell align="center">
                        <Box display="flex" flexDirection="column" gap={1}>
                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: colors.primary[600],
                              "&:hover": {
                                backgroundColor: colors.blueAccent[400],
                              },
                              borderRadius: "8px",
                              fontSize: "12px",
                            }}
                          >
                            Add Feedback
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
                            onClick={() =>
                              navigate(`/profile/${assignment.reviewer_id}`)
                            }
                          >
                            Reviewer's Profile
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell sx={{ color: colors.grey[100] }}>-</TableCell>
                    <TableCell sx={{ color: colors.grey[100] }}>-</TableCell>
                    <TableCell sx={{ color: colors.grey[100] }}>-</TableCell>
                    <TableCell sx={{ color: colors.grey[100] }}>-</TableCell>
                    <TableCell sx={{ color: colors.grey[100] }}>-</TableCell>
                    <TableCell sx={{ color: colors.grey[100] }}>-</TableCell>
                    <TableCell sx={{ color: colors.grey[100] }}>-</TableCell>
                    <TableCell align="center">
                      <Box display="flex" flexDirection="column" gap={1}>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: colors.primary[600],
                            "&:hover": {
                              backgroundColor: colors.blueAccent[400],
                            },
                            borderRadius: "8px",
                            fontSize: "12px",
                          }}
                        >
                          Add Feedback
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
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
};

export default ReviewDetailPage;
