import {
  Box,
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
import { tokens } from "../../../theme";
import { useEffect, useState } from "react";

const MySubmissions = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paperReviews, setPaperReviews] = useState<{ [key: string]: any[] }>(
    {}
  );

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/paper/my_papers", {
          credentials: "include",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPapers(data.papers);
      } catch (error) {
        console.error("Error fetching papers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPapers();
  }, []);

  const fetchReviews = async (paperId: string) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/review/paper/${paperId}`,
        {
          credentials: "include",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await response.json();
      setPaperReviews((prev) => ({
        ...prev,
        [paperId]: data.reviews,
      }));
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    if (papers.length > 0) {
      papers.forEach((paper: any) => {
        fetchReviews(paper._id);
      });
    }
  }, [papers]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box m="20px">
      <Typography variant="h2" mb="20px">
        My Submissions
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          border: `1px solid ${colors.grey[100]}`,
          borderRadius: "12px",
          backgroundColor: colors.primary[500],
          padding: "15px",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  padding: "8px",
                  color: colors.grey[100],
                  borderBottom: `1px solid ${colors.grey[100]}`,
                  borderRight: `1px solid ${colors.grey[100]}`,
                  borderTop: `1px solid ${colors.grey[100]}`,
                  borderLeft: `1px solid ${colors.grey[100]}`,
                  backgroundColor: colors.primary[400],
                }}
              >
                Title
              </TableCell>
              <TableCell
                sx={{
                  padding: "8px",
                  color: colors.grey[100],
                  borderBottom: `1px solid ${colors.grey[100]}`,
                  borderRight: `1px solid ${colors.grey[100]}`,
                  borderTop: `1px solid ${colors.grey[100]}`,
                  borderLeft: `1px solid ${colors.grey[100]}`,
                  backgroundColor: colors.primary[400],
                }}
              >
                Abstract
              </TableCell>
              <TableCell
                sx={{
                  padding: "8px",
                  color: colors.grey[100],
                  borderBottom: `1px solid ${colors.grey[100]}`,
                  borderRight: `1px solid ${colors.grey[100]}`,
                  borderTop: `1px solid ${colors.grey[100]}`,
                  borderLeft: `1px solid ${colors.grey[100]}`,
                  backgroundColor: colors.primary[400],
                }}
              >
                Status
              </TableCell>
              <TableCell
                sx={{
                  padding: "8px",
                  color: colors.grey[100],
                  borderBottom: `1px solid ${colors.grey[100]}`,
                  borderRight: `1px solid ${colors.grey[100]}`,
                  borderTop: `1px solid ${colors.grey[100]}`,
                  borderLeft: `1px solid ${colors.grey[100]}`,
                  backgroundColor: colors.primary[400],
                }}
              >
                Submission Date
              </TableCell>
              <TableCell
                sx={{
                  padding: "8px",
                  color: colors.grey[100],
                  borderBottom: `1px solid ${colors.grey[100]}`,
                  borderRight: `1px solid ${colors.grey[100]}`,
                  borderTop: `1px solid ${colors.grey[100]}`,
                  borderLeft: `1px solid ${colors.grey[100]}`,
                  backgroundColor: colors.primary[400],
                }}
              >
                Feedback
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {papers.map((paper: any) => (
              <TableRow key={paper._id}>
                <TableCell
                  sx={{
                    padding: "8px",
                    color: colors.grey[100],
                    borderBottom: `1px solid ${colors.grey[100]}`,
                    borderRight: `1px solid ${colors.grey[100]}`,
                    borderTop: `1px solid ${colors.grey[100]}`,
                    borderLeft: `1px solid ${colors.grey[100]}`,
                    backgroundColor: colors.primary[400],
                  }}
                >
                  {paper.title}
                </TableCell>
                <TableCell
                  sx={{
                    padding: "8px",
                    color: colors.grey[100],
                    borderBottom: `1px solid ${colors.grey[100]}`,
                    borderRight: `1px solid ${colors.grey[100]}`,
                    borderTop: `1px solid ${colors.grey[100]}`,
                    borderLeft: `1px solid ${colors.grey[100]}`,
                    backgroundColor: colors.primary[400],
                  }}
                >
                  {paper.abstract}
                </TableCell>
                <TableCell
                  sx={{
                    padding: "8px",
                    color: colors.grey[100],
                    borderBottom: `1px solid ${colors.grey[100]}`,
                    borderRight: `1px solid ${colors.grey[100]}`,
                    borderTop: `1px solid ${colors.grey[100]}`,
                    borderLeft: `1px solid ${colors.grey[100]}`,
                    backgroundColor: colors.primary[400],
                  }}
                >
                  {paper.decision === true
                    ? "Accepted"
                    : paper.decision === false
                    ? "Rejected"
                    : paper.status || "Pending"}
                </TableCell>
                <TableCell
                  sx={{
                    padding: "8px",
                    color: colors.grey[100],
                    borderBottom: `1px solid ${colors.grey[100]}`,
                    borderRight: `1px solid ${colors.grey[100]}`,
                    borderTop: `1px solid ${colors.grey[100]}`,
                    borderLeft: `1px solid ${colors.grey[100]}`,
                    backgroundColor: colors.primary[400],
                  }}
                >
                  {formatDate(paper.submission_date)}
                </TableCell>
                <TableCell
                  sx={{
                    padding: "8px",
                    color: colors.grey[100],
                    borderBottom: `1px solid ${colors.grey[100]}`,
                    borderRight: `1px solid ${colors.grey[100]}`,
                    borderTop: `1px solid ${colors.grey[100]}`,
                    borderLeft: `1px solid ${colors.grey[100]}`,
                    backgroundColor: colors.primary[400],
                  }}
                >
                  {paperReviews[paper._id]?.length > 0 && (
                    <Box mt={1}>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: colors.grey[100] }}
                      >
                        Reviews ({paperReviews[paper._id].length}):
                      </Typography>
                      {paperReviews[paper._id].map(
                        (review: any, index: number) => (
                          <Box key={review._id} ml={1} mt={0.5}>
                            <Typography
                              variant="body2"
                              sx={{ color: colors.grey[200] }}
                            >
                              Evaluation: {Math.round(review.evaluation) + 3}/5
                              {review.evaluation_text && (
                                <Typography
                                  variant="caption"
                                  display="block"
                                  sx={{ color: colors.grey[300] }}
                                >
                                  "{review.evaluation_text}"
                                </Typography>
                              )}
                            </Typography>
                          </Box>
                        )
                      )}
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MySubmissions;
