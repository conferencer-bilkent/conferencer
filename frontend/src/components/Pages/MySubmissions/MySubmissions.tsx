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
  Button,
} from "@mui/material";
import { tokens } from "../../../theme";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPen } from "react-icons/fa";

const MySubmissions = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleEditPaper = (paper: any) => {
    navigate("/addSubmission", {
      state: {
        isEditing: true,
        paperData: paper,
      },
    });
  };

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
        sx={{ backgroundColor: colors.primary[400] }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: colors.grey[100] }}>Title</TableCell>
              <TableCell sx={{ color: colors.grey[100] }}>Abstract</TableCell>
              <TableCell sx={{ color: colors.grey[100] }}>Status</TableCell>
              <TableCell sx={{ color: colors.grey[100] }}>
                Submission Date
              </TableCell>
              <TableCell sx={{ color: colors.grey[100] }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {papers.map((paper: any) => (
              <TableRow key={paper._id}>
                <TableCell sx={{ color: colors.grey[100] }}>
                  {paper.title}
                </TableCell>
                <TableCell sx={{ color: colors.grey[100] }}>
                  {paper.abstract}
                </TableCell>
                <TableCell sx={{ color: colors.grey[100] }}>
                  {paper.status || "Pending"}
                </TableCell>
                <TableCell sx={{ color: colors.grey[100] }}>
                  {formatDate(paper.submission_date)}
                </TableCell>
                <TableCell>
                  <Button
                    startIcon={<FaPen />}
                    variant="contained"
                    onClick={() => handleEditPaper(paper)}
                    sx={{
                      backgroundColor: colors.primary[600],
                      "&:hover": { backgroundColor: colors.blueAccent[400] },
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  >
                    Edit Paper
                  </Button>
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
