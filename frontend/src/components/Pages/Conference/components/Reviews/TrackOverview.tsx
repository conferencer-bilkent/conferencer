import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppTitle from "../../../../global/AppTitle";
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
import { useConference } from "../../../../../context/ConferenceContext";
import { Track } from "../../../../../models/conference";
import { getTrackById, getPapersForTrack } from "../../../../../services/trackService";
import { Paper } from "../../../../../models/paper";
import { parseAuthorsInfo } from "../../../../../utils/parseAuthors";
import App from "../../../../../App";

// Define a type for the location state
interface LocationState {
  activeTrack: Track | null;
}

const ReviewsPage: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const location = useLocation();
  const { activeConference } = useConference();
  
  // Get the track and view type from location state
  const state = location.state as LocationState;
  const activeTrack = state?.activeTrack || null;

  // State for fetched papers
  const [papers, setPapers] = useState<Paper[]>([]);
  
  useEffect(() => {
    const fetchTrack = async () => {
      if (activeTrack) {
        const actualActiveTrack = await getTrackById(activeTrack._id)
        console.log("actualActiveTrack", actualActiveTrack);
      }
    };

    fetchTrack();
  }, [activeTrack]);
  
  useEffect(() => {
    const fetchPapers = async () => {
      if (activeTrack) {
        try {
          const fetchedPapers = await getPapersForTrack(activeTrack._id);
          setPapers(fetchedPapers);
        } catch (error) {
          console.error("Error fetching papers:", error);
        }
      }
    };

    fetchPapers();
  }, [activeTrack]);

  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  // Title based on what we're viewing
  const getPageTitle = () => {
    console.log("activeTrack", activeTrack);
    if (activeTrack) {
      return `${activeTrack.track_name || "Track"}: ${'Assignments'}`;
    }
    return `${activeConference?.name || "Conference"}: ${'All Assignments'}`;
  };

  // Toggle expanded state for a paper
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

  const handleNavigateToDetail = (paper: Paper) => {
    navigate("/review/detail", { state: { paper, activeTrack } });
  };

  // Handler to navigate back to the conference page
  const handleBackToTrackView = () => {
    navigate('/conference');
  };

  // Helper to format keywords with proper parsing for JSON strings in arrays
  const formatKeywords = (keywords: any) => {
    try {
      // Handle case where keywords is an array with a single JSON string element
      if (Array.isArray(keywords) && keywords.length > 0 && typeof keywords[0] === 'string') {
        try {
          // Parse the JSON string inside the array
          const parsedKeywords = JSON.parse(keywords[0]);
          
          // If parsedKeywords is an array, return it joined
          if (Array.isArray(parsedKeywords)) {
            return parsedKeywords.join(", ");
          }
          
          // If it's a string, return it as is
          if (typeof parsedKeywords === 'string') {
            return parsedKeywords;
          }
          
          // If it's an object with a name property (like {name: "keyword"}), return the name
          if (typeof parsedKeywords === 'object' && parsedKeywords.name) {
            return parsedKeywords.name;
          }
        } catch (e) {
          // If parsing fails, return the raw string
          return keywords[0];
        }
      }
      
      // If keywords is already an array (not containing JSON strings)
      if (Array.isArray(keywords)) {
        return keywords
          .map((kw) => (typeof kw === 'object' && kw.name ? kw.name : String(kw)))
          .join(", ");
      }
      
      // Default fallback
      return "No keywords";
    } catch (error) {
      console.error("Error formatting keywords:", error);
      return "No keywords";
    }
  };

  const getReviewColor = () => {
    // For paper objects these values are not provided so we choose a default color
    return colors.greenAccent[400];
  };

  return (
    <>
      <Box display="flex">
        <Box
          flex="1"
          p={3}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <AppTitle text={getPageTitle()} />

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
            my={3}
            width="800px"
          >
            <AppButton 
              icon={<FaFilter />} 
              text="Switch Back to Track View" 
              onClick={handleBackToTrackView} 
            />
            <TextField
              placeholder="Search by Title or Author Name"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

          {/* Display info about which track/view we're looking at */}
          {activeTrack && (
            <Box 
              width="800px" 
              mb={3} 
              p={2} 
              bgcolor={colors.primary[600]}
              borderRadius="8px"
            >
              <Typography variant="body1">
                Currently viewing: <strong>{ 'Assignments'}</strong> for track <strong>{activeTrack.track_name || "Unnamed Track"}</strong>
              </Typography>
            </Box>
          )}

          {/* Paper/Review list */}
          {papers.length > 0 ? (
            papers.map((paper, index) => (
              <Box
                key={index}
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
                onClick={() => handleToggleExpand(index)}
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
                      By annen {parseAuthorsInfo(paper.authors)}
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      mt={1}
                      color={getReviewColor()}
                    >
                      Created At: {new Date(paper.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>

                  <AppButton
                    onClick={() => {
                      handleNavigateToDetail(paper);
                    }}
                    text="View Details"
                  />
                </Box>

                <Collapse in={isExpanded(index)} timeout="auto" unmountOnExit>
                  <Box mt={2} p={2} borderTop={`1px solid ${colors.grey[700]}`}>
                    <Typography variant="body2" color={colors.grey[300]} mb={1}>
                      <strong>Abstract:</strong> {paper.abstract}
                    </Typography>
                    <Box
                      sx={{
                        maxHeight: "150px",
                        overflowY: "auto",
                        pr: 1,
                        color: colors.grey[100],
                      }}
                    >
                    </Box>
                    <Typography variant="body2" color={colors.grey[300]} mt={2}>
                      <strong>Keywords:</strong>{" "}
                        {formatKeywords(paper.keywords).split(", ").map((kw: string, i: number) => (
                        <Box key={i} component="span" mr={1}>
                          #{kw}
                        </Box>
                        ))}
                    </Typography>

                    {/* Close Button */}
                    <Box mt={2} display="flex" justifyContent="flex-end">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleExpand(index);
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
            ))
          ) : (
            <Box 
              width="800px" 
              p={4} 
              textAlign="center" 
              color={colors.grey[300]}
              bgcolor={colors.primary[400]}
              borderRadius="12px"
            >
              No {"Assignments"} found {activeTrack ? `for ${activeTrack.track_name || "this track"}` : "in this conference"}
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default ReviewsPage;
