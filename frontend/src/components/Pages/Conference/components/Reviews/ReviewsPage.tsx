import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../../../global/TopBar";
import AppTitle from "../../../../global/AppTitle";
import SideMenu from "../../../../global/SideMenu";
import { getMenuItemsForPage } from "../../../../global/sideMenuConfig";
import AppButton from "../../../../global/AppButton";
import { FaFilter, FaSearch } from "react-icons/fa";
import {
  Box,
  IconButton,
  TextField,
  Button,
  InputAdornment,
  useTheme,
  Collapse,
  Typography,
} from "@mui/material";
import { tokens } from "../../../../../theme";

const mockReviews = [
  {
    id: 1,
    title:
      "Impact of Virtual Reality on Cognitive Learning in Higher Education",
    authors: "Jane Doe, Memduh Tutus, Bilal Kar, et al.",
    reviewsCompleted: 3,
    reviewsAssigned: 4,
    abstract:
      "This study explores the dynamics of [Insert research topic] to address key problems or research questions. With growing relevance in the context of technological and educational innovation, the study investigates immersive environments and their cognitive effects on higher education learners. Specific methods include controlled experiments, survey evaluations, and simulation modeling. Results show significant engagement patterns and retention improvements...",
    keywords: [
      "Virtual Reality",
      "Cognitive Learning",
      "STEM Education",
      "Immersive Learning",
    ],
    assignedReviewers: "None",
    publicationDate: "21.12.2024",
  },
  {
    id: 2,
    title: "Different Paper Named Something Else",
    authors: "John Doe, Atilla Emre Söylemez",
    reviewsCompleted: 5,
    reviewsAssigned: 6,
    abstract:
      "This paper investigates emerging methods in learning science using experimental models and simulation-based instruction. Our key finding highlights the role of adaptive technologies in increasing learner agency and performance outcomes.",
    keywords: ["AI", "Learning Models", "Simulated Environments"],
    assignedReviewers: "Reviewer A, Reviewer B",
    publicationDate: "10.01.2025",
  },
];

const ReviewsPage: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const menuItems = getMenuItemsForPage("home");
  const navigate = useNavigate();

  // Allow multiple expanded items using a Set
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const handleToggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const isExpanded = (id: number) => expandedIds.has(id);

  const handleNavigateToDetail = (id: number) => {
    navigate(`/reviews/`);
  };

  const getReviewColor = (completed: number, assigned: number) => {
    return completed < assigned
      ? colors.redAccent[400]
      : colors.greenAccent[400];
  };

  return (
    <>
      <Topbar />
      <Box display="flex">
        <SideMenu items={menuItems} onItemClick={() => {}} />

        <Box
          flex="1"
          p={3}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <AppTitle text="CS FAIR 2024: Reviews" />

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
            my={3}
            width="800px"
          >
            <AppButton icon={<FaFilter />} text="Switch Back to Track View" />
            <TextField
              placeholder="Search by Title or Author Name"
              variant="outlined"
              size="small"
              sx={{
                borderRadius: "10px",
                input: { color: colors.grey[100] },
                minWidth: "300px",
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton>
                      <FaSearch />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {mockReviews.map((paper) => (
            <Box
              key={paper.id}
              width="800px"
              p={2}
              mb={3}
              borderRadius="12px"
              bgcolor={colors.primary[400]}
              boxShadow={4}
              sx={{
                transition: "all 0.3s ease-in-out",
                cursor: "pointer",
              }}
              onClick={() => handleToggleExpand(paper.id)}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={2}
                borderRadius="8px"
              >
                <Box>
                  <Typography variant="h6" color={colors.grey[100]}>
                    {paper.title}
                  </Typography>
                  <Typography variant="body2" color={colors.grey[300]}>
                    By {paper.authors}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    mt={1}
                    color={getReviewColor(
                      paper.reviewsCompleted,
                      paper.reviewsAssigned
                    )}
                  >
                    Completed/Assigned Reviews: {paper.reviewsCompleted}/
                    {paper.reviewsAssigned}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent expand toggle
                    handleNavigateToDetail(paper.id);
                  }}
                  sx={{
                    borderRadius: "8px",
                    fontWeight: "bold",
                    backgroundColor: colors.blueAccent[500],
                    "&:hover": {
                      backgroundColor: colors.blueAccent[400],
                    },
                  }}
                >
                  View Reviews
                </Button>
              </Box>

              <Collapse in={isExpanded(paper.id)} timeout="auto" unmountOnExit>
                <Box mt={2} p={2} borderTop={`1px solid ${colors.grey[700]}`}>
                  <Typography variant="body2" color={colors.grey[300]} mb={1}>
                    <strong>Publication Date:</strong> {paper.publicationDate}
                  </Typography>
                  <Box
                    sx={{
                      maxHeight: "150px",
                      overflowY: "auto",
                      pr: 1,
                      color: colors.grey[100],
                    }}
                  >
                    <Typography variant="body2">
                      <strong>Abstract:</strong> {paper.abstract}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color={colors.grey[300]} mt={2}>
                    <strong>Keywords:</strong>{" "}
                    {paper.keywords.map((kw, i) => (
                      <Box key={i} component="span" mr={1}>
                        #{kw}
                      </Box>
                    ))}
                  </Typography>
                  <Typography variant="body2" color={colors.grey[300]} mt={1}>
                    <strong>Assigned Reviewer(s):</strong>{" "}
                    {paper.assignedReviewers}
                  </Typography>

                  {/* Close Button */}
                  <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleExpand(paper.id);
                      }}
                      variant="outlined"
                      sx={{
                        borderRadius: "8px",
                        color: colors.grey[100],
                        borderColor: colors.grey[300],
                        "&:hover": {
                          backgroundColor: colors.primary[500],
                        },
                      }}
                    >
                      Close
                    </Button>
                  </Box>
                </Box>
              </Collapse>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default ReviewsPage;
