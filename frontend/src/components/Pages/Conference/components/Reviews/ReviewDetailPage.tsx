import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppButton from "../../../../global/AppButton";
import SelectPeoplePopup from "../../../../global/SelectPeoplePopUp";
import { FaArrowLeft, FaDownload, FaUserPlus, FaPen, FaTimes, FaCheck } from "react-icons/fa";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
} from "@mui/material";
import { tokens } from "../../../../../theme";
import { Track } from "../../../../../models/conference";
import AppTitle from "../../../../global/AppTitle";
import { Paper } from "../../../../../models/paper";
import { getAssignmentsByPaper, getReviewByAssignment, Review, updatePaperDecision, rateReview } from "../../../../../services/trackService";
import { getPaperById, downloadPaper } from "../../../../../services/paperService";
import { Assignment } from "../../../../../models/assignment";
import { getUserById } from "../../../../../services/userService";
import { UserData } from "../../../../../models/user";

// Updated LocationState interface to use only the Track interface
interface LocationState {
  paper?: Paper;
  activeTrack: Track | null;
}

// Extend the assignment interface to include the reviewer name and optional review data
interface AssignmentWithReviewer extends Assignment {
  reviewerName: string;
  reviewData?: Review;
}

const ReviewDetailPage: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true);
  const [paperAssignments, setPaperAssignments] = useState<AssignmentWithReviewer[]>([]);
  const [reviewPopupOpen, setReviewPopupOpen] = useState<boolean>(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<string>("");
  const [decisionPopupOpen, setDecisionPopupOpen] = useState<boolean>(false);
  const [decisionLoading, setDecisionLoading] = useState<boolean>(false);
  const [assignPopupOpen, setAssignPopupOpen] = useState<boolean>(false);
  const [trackMembers, setTrackMembers] = useState<UserData[]>([]);
  const [feedbackPopupOpen, setFeedbackPopupOpen] = useState(false);
  const [selectedFeedbackReviewId, setSelectedFeedbackReviewId] = useState<string | null>(null);
  const [selectedFeedbackValue, setSelectedFeedbackValue] = useState<number>(5);

  // Get the state passed from navigation
  const state = location.state as LocationState | undefined;
  const activeTrack = state?.activeTrack || null;
  const [selectedPaper, setSelectedPaper] = useState<Paper | undefined>(state?.paper);

  // Compute statistics based on activeTrack data
  const completedReviews = activeTrack?.reviews?.length || 0;
  // Calculate pending reviews based on assignments minus reviews
  const pendingReviews = activeTrack
    ? activeTrack.assignments.length - (activeTrack.reviews?.length || 0)
    : 0;

  // Update formatDate to handle both string and object formats
  const formatDate = (date: string | { $date: string } | undefined) => {
    if (!date) return "-";
    try {
      const d = typeof date === "string" ? new Date(date) : new Date(date.$date);
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return "-";
    }
  };

  const handleOpenReviewPopup = (evaluation: string) => {
    setSelectedEvaluation(evaluation);
    setReviewPopupOpen(true);
  };

  const handleCloseReviewPopup = () => {
    setReviewPopupOpen(false);
    setSelectedEvaluation("");
  };

  const handleOpenDecisionPopup = () => setDecisionPopupOpen(true);
  const handleCloseDecisionPopup = () => setDecisionPopupOpen(false);

  const handleSubmitDecision = async (accept: boolean) => {
    if (!selectedPaper?._id) return;
    try {
      setDecisionLoading(true);
      await updatePaperDecision(selectedPaper._id, accept);
      // reload updated paper
      const updated = await getPaperById(selectedPaper._id);
      if (updated) setSelectedPaper(updated);
    } catch (e) {
      console.error("Decision update failed", e);
    } finally {
      setDecisionLoading(false);
      handleCloseDecisionPopup();
    }
  };

  const handleDownloadPaper = async () => {
    if (!selectedPaper?._id) return;
    try {
      const blob = await downloadPaper(selectedPaper._id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedPaper.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      console.error("Error downloading paper:", e);
    }
  };

  const fetchAssignments = async () => {
    if (!selectedPaper?._id) return;
    setLoading(true);
    try {
      const assignments = await getAssignmentsByPaper(selectedPaper._id);
      
      
      // For each assignment, force is_pending to false for debugging and get the reviewer info and review details if available
      const assignmentsWithReviewers = await Promise.all(
        assignments.map(async (assignment) => {
          let reviewData = undefined;
          console.log("assignment", assignment);
          if (assignment.is_pending === false) {
            try {
              reviewData = await getReviewByAssignment(assignment._id);
              console.log("reviewData", reviewData);
            } catch (error) {
              console.error(`Error fetching review for assignment ${assignment._id}:`, error);
            }
          }
          try {
            const reviewer = await getUserById(assignment.reviewer_id);
            return {
              ...assignment,
              reviewerName: reviewer
                ? `${reviewer.name} ${reviewer.surname}`
                : "Unknown",
              reviewData,
            };
          } catch (error) {
            console.error(
              `Error fetching reviewer ${assignment.reviewer_id}:`,
              error
            );
            return {
              ...assignment,
              reviewerName: "Unknown",
              reviewData,
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

  useEffect(() => {
    fetchAssignments();
  }, [selectedPaper]);

  useEffect(() => {
    if (assignPopupOpen && activeTrack?._id) {
      fetch(`http://127.0.0.1:5000/track/${activeTrack._id}/members`, {
        credentials: "include",
      })
        .then((r) => r.json())
        .then((data) => setTrackMembers(data.track_members || []))
        .catch(console.error);
    }
  }, [assignPopupOpen, activeTrack]);

  const handleOpenAssignPopup = () => setAssignPopupOpen(true);
  const handleCloseAssignPopup = () => setAssignPopupOpen(false);

  const handleAssignReviewers = async (selectedUserIds: string[]) => {
    if (!activeTrack?._id || !selectedPaper?._id) return;
    try {
      for (const reviewerId of selectedUserIds) {
        await fetch(
          `http://127.0.0.1:5000/track/${activeTrack._id}/assign`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paper_id: selectedPaper._id,
              reviewer_id: reviewerId,
            }),
          }
        );
      }
      // refresh the table
      await fetchAssignments();
    } catch (error) {
      console.error("Error assigning reviewers:", error);
    } finally {
      handleCloseAssignPopup();
    }
  };

  const handleBackToReviews = () => {
    navigate("/review", {
      state: { activeTrack },
    });
  };

  const openFeedbackPopup = (reviewId: string) => {
    setSelectedFeedbackReviewId(reviewId);
    setFeedbackPopupOpen(true);
  };

  const closeFeedbackPopup = () => {
    setFeedbackPopupOpen(false);
    setSelectedFeedbackValue(5);
    setSelectedFeedbackReviewId(null);
  };

  const handleSubmitFeedback = async () => {
    if (!selectedFeedbackReviewId) return;
    try {
      await rateReview(selectedFeedbackReviewId, selectedFeedbackValue);
      console.log("Rating submitted");
      await fetchAssignments();
    } catch (e) {
      console.error("Failed to submit rating", e);
    } finally {
      closeFeedbackPopup();
    }
  };

  // derive the current decision display string
  const currentDecision =
    selectedPaper?.decision != null
      ? selectedPaper.decision
        ? "Accepted"
        : "Rejected"
      : "N/A";

  // choose badge color: green for accept, red for reject, grey if N/A
  const badgeBg =
    selectedPaper?.decision === true
      ? colors.greenAccent[400]
      : selectedPaper?.decision === false
      ? colors.redAccent[400]
      : colors.grey[700];

  // reuse your MyTasks styles via sx
  const tableContainerSx = {
    border: `1px solid ${colors.grey[100]}`,
    borderRadius: "12px",
    backgroundColor: colors.primary[500],
    mt: 2,
  };
  const tableCellSx = {
    padding: "8px",
    color: colors.grey[100],
    borderBottom: `1px solid ${colors.grey[100]}`,
    borderRight: `1px solid ${colors.grey[100]}`,
    borderTop: `1px solid ${colors.grey[100]}`,
    borderLeft: `1px solid ${colors.grey[100]}`,
    backgroundColor: colors.primary[400],
    whiteSpace: "normal" as const,
    wordWrap: "break-word" as const,
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
              Completed Reviews: {completedReviews}, Pending: {pendingReviews}
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
            <AppButton
              icon={<FaPen />}
              text="Edit Decision"
              onClick={handleOpenDecisionPopup}
            />
            <AppButton
              icon={<FaDownload />}
              text="Download Paper"
              onClick={handleDownloadPaper}
            />
            <AppButton
              icon={<FaUserPlus />}
              text="Assign More Reviewers"
              onClick={handleOpenAssignPopup}
            />
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
              component="span"
              px={1.5}
              py={0.5}
              bgcolor={badgeBg}
              borderRadius="8px"
              color={colors.grey[100]}
              ml={1}
            >
              {currentDecision}
            </Box>
          </Typography>

          {/* Table */}
          <TableContainer component={MuiPaper} sx={tableContainerSx}>
            <Table>
              <TableHead>
                <TableRow>
                  {["Reviewer", "Deadline", "Assigned On", "Uploaded On", "Decision", "Confidence", "Review", "Actions"].map((h) => (
                    <TableCell key={h} sx={tableCellSx}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={tableCellSx}>
                      <CircularProgress size={40} sx={{ color: colors.blueAccent[400] }} />
                    </TableCell>
                  </TableRow>
                ) : paperAssignments.length > 0 ? (
                  paperAssignments.map((assignment, i) => (
                    <TableRow key={assignment._id + i}>
                      <TableCell sx={tableCellSx}>
                        {assignment.reviewerName}
                      </TableCell>
                      <TableCell sx={tableCellSx}>-</TableCell>
                      <TableCell sx={tableCellSx}>
                        {formatDate(assignment.created_at)}
                      </TableCell>
                      <TableCell sx={tableCellSx}>
                        {assignment.is_pending
                          ? "-"
                          : assignment.reviewData
                          ? formatDate(assignment.reviewData.created_at)
                          : "-"}
                      </TableCell>
                      <TableCell sx={tableCellSx}>
                        {assignment.is_pending || !assignment.reviewData
                          ? "-"
                          : assignment.reviewData.evaluation}
                      </TableCell>
                      <TableCell sx={tableCellSx}>
                        {assignment.is_pending
                          ? "-"
                          : assignment.reviewData
                          ? assignment.reviewData.confidence
                          : "-"}
                      </TableCell>
                      <TableCell
                        sx={{
                          ...tableCellSx,
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                        onClick={() =>
                          handleOpenReviewPopup(
                            assignment.reviewData?.evaluation_text || "No review made yet!"
                          )
                        }
                      >
                        {assignment.is_pending || !assignment.reviewData
                          ? "-"
                          : "View Message"}
                      </TableCell>
                      <TableCell sx={tableCellSx} align="center">
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
                            disabled={!assignment.reviewData}
                            onClick={() =>
                              assignment.reviewData &&
                              openFeedbackPopup(assignment.reviewData._id)
                            }
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
                    {Array.from({ length: 8 }).map((_, idx) => (
                      <TableCell key={idx} sx={tableCellSx}>
                        -
                      </TableCell>
                    ))}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* Popup Dialog for Review Message */}
      <Dialog
        open={reviewPopupOpen}
        onClose={handleCloseReviewPopup}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            border: `1px solid ${colors.grey[100]}`,
          },
        }}
      >
        <DialogTitle>Review Message</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{selectedEvaluation}</Typography>
        </DialogContent>
        <DialogActions>
          <AppButton text="Close" onClick={handleCloseReviewPopup} />
        </DialogActions>
      </Dialog>

      {/* Edit Decision Dialog */}
      <Dialog
        open={decisionPopupOpen}
        onClose={handleCloseDecisionPopup}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            border: `1px solid ${colors.grey[100]}`,
          },
        }}
      >
        <DialogTitle>Set Paper Decision</DialogTitle>
        <DialogContent>
          <Typography>Do you want to accept or reject this paper?</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
          <AppButton
            icon={<FaTimes />}
            text="Reject"
            color="red"
            disabled={decisionLoading}
            onClick={() => handleSubmitDecision(false)}
          />
          <AppButton
            icon={<FaCheck />}
            text="Accept"
            color="green"
            disabled={decisionLoading}
            onClick={() => handleSubmitDecision(true)}
          />
        </DialogActions>
      </Dialog>

      {/* Assign Reviewers Popup */}
      {assignPopupOpen && (
        <SelectPeoplePopup
          buttonText="Assign Reviewers"
          people={trackMembers}
          onClose={handleCloseAssignPopup}
          onSelect={handleAssignReviewers}
        />
      )}

      {/* Feedback Rating Dialog */}
      <Dialog
        open={feedbackPopupOpen}
        onClose={closeFeedbackPopup}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Rate this Review</DialogTitle>
        <DialogContent sx={{ width: "100%", px: 3 }}>
          <Box sx={{ width: "100%", mt: 2 }}>
            <Slider
              value={selectedFeedbackValue}
              onChange={(_, v) => setSelectedFeedbackValue(v as number)}
              aria-labelledby="feedback-slider"
              valueLabelDisplay="on"
              step={1}
              marks={Array.from({ length: 11 }, (_, i) => ({
                value: i,
                label: `${i}`,
              }))}
              min={0}
              max={10}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <AppButton text="Cancel" onClick={closeFeedbackPopup} />
          <AppButton text="Submit" onClick={handleSubmitFeedback} />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReviewDetailPage;
