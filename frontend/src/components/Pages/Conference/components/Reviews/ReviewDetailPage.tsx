import React from "react";
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
} from "@mui/material";
import { tokens } from "../../../../../theme";
import { Track } from "../../../../../models/conference";
import AppTitle from "../../../../global/AppTitle";
import { Paper } from "../../../../../models/paper";

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

const ReviewDetailPage: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the state passed from navigation
  const state = location.state as LocationState | undefined;
  const activeTrack = state?.activeTrack || null;
  const reviewData = state?.reviewData;

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

  const selectedPaper = state?.paper;
  console.log("Selected Paper:", selectedPaper);

  const handleBackToReviews = () => {
    navigate("/review", {
      state: { activeTrack },
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
              Completed Reviews: {reviewDataDisplay.completed}, Pending: {reviewDataDisplay.pending}
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
                  <TableCell>Uploaded On</TableCell>
                  <TableCell>Decision</TableCell>
                  <TableCell>Confidence</TableCell>
                  <TableCell>Review</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reviewDataDisplay.reviewers && reviewDataDisplay.reviewers.length > 0 ? (
                  reviewDataDisplay.reviewers.map((r, idx) => (
                    <TableRow key={idx}>
                      <TableCell sx={{ color: colors.grey[100] }}>{r.name}</TableCell>
                      <TableCell sx={{ color: colors.grey[100] }}>{r.deadline}</TableCell>
                      <TableCell sx={{ color: colors.grey[100] }}>{r.uploaded}</TableCell>
                      <TableCell sx={{ color: colors.grey[100] }}>{r.decision}</TableCell>
                      <TableCell sx={{ color: colors.grey[100] }}>{r.confidence}</TableCell>
                      <TableCell sx={{ color: colors.grey[100] }}>{r.file}</TableCell>
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
                  ))
                ) : (
                  <TableRow>
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
