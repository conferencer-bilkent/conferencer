import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppTitle from "../../../../global/AppTitle";
import AppButton from "../../../../global/AppButton";
import { FaFilter, FaSearch } from "react-icons/fa";
import {
  Box,
  TextField,
  InputAdornment,
  useTheme,
  Collapse,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import { tokens } from "../../../../../theme";
import { useConference } from "../../../../../context/ConferenceContext";
import { Track } from "../../../../../models/conference";
import { getTrackById, getPapersForTrack } from "../../../../../services/trackService";
import { Paper } from "../../../../../models/paper";
import { parseAuthorsInfo } from "../../../../../utils/parseAuthors";

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
  
  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [decisionFilter, setDecisionFilter] = useState<string>("all");
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

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

  // Filter papers based on search term and decision filter
  const filteredPapers = papers.filter(paper => {
    // Search by title or author name
    const titleMatch = paper.title.toLowerCase().includes(searchTerm.toLowerCase());
    const authorsString = parseAuthorsInfo(paper.authors).toLowerCase();
    const authorMatch = authorsString.includes(searchTerm.toLowerCase());
    const searchMatch = titleMatch || authorMatch;
    
    // Filter by decision status
    if (decisionFilter === "all") return searchMatch;
    if (decisionFilter === "accepted") return searchMatch && paper.decision === true;
    if (decisionFilter === "rejected") return searchMatch && paper.decision === false;
    if (decisionFilter === "pending") return searchMatch && paper.decision === null;
    
    return searchMatch;
  });

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
    <div className="conference-page" style={{ backgroundColor: colors.transparent, color: colors.grey[100] }}>
      <div className="conference-container">
        <div 
          className="content-container" 
          style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: "24px",
            width: "800px", 
            margin: "0 auto" 
          }}
        >
          <AppTitle text={getPageTitle()} />
          
          <div className="buttons-row" style={{ marginBottom: 20, gap: "12px" }}>
            <Box display="flex" gap={2} alignItems="center" flexGrow={1}>
              <AppButton 
                icon={<FaFilter />} 
                text="Back to Track View" 
                onClick={handleBackToTrackView} 
              />
              
              <FormControl component="fieldset" sx={{ ml: 3 }}>
                <RadioGroup 
                  row 
                  value={decisionFilter} 
                  onChange={(e) => setDecisionFilter(e.target.value)}
                >
                  <FormControlLabel
                    value="all"
                    control={<Radio size="small" sx={{ 
                      color: colors.grey[300],
                      '&.Mui-checked': { color: colors.blueAccent[300] }
                    }} />}
                    label="All"
                    sx={{ color: colors.grey[100], mr: 2 }}
                  />
                  <FormControlLabel
                    value="accepted"
                    control={<Radio size="small" sx={{ 
                      color: colors.grey[300],
                      '&.Mui-checked': { color: colors.greenAccent[500] }
                    }} />}
                    label="Accepted"
                    sx={{ color: colors.grey[100], mr: 2 }}
                  />
                  <FormControlLabel
                    value="rejected"
                    control={<Radio size="small" sx={{ 
                      color: colors.grey[300],
                      '&.Mui-checked': { color: colors.redAccent[500] }
                    }} />}
                    label="Rejected"
                    sx={{ color: colors.grey[100], mr: 2 }}
                  />
                  <FormControlLabel
                    value="pending"
                    control={<Radio size="small" sx={{ 
                      color: colors.grey[300],
                      '&.Mui-checked': { color: colors.grey[100] }
                    }} />}
                    label="Pending"
                    sx={{ color: colors.grey[100] }}
                  />
                </RadioGroup>
              </FormControl>
            </Box>

            <TextField
              placeholder="Search by Title or Author"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                borderRadius: "10px",
                input: { color: colors.grey[100] },
                minWidth: "250px",
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaSearch color={colors.grey[300]} />
                  </InputAdornment>
                ),
              }}
            />
          </div>

          {/* Display info about which track/view we're looking at */}
          {activeTrack && (
            <Box 
              width="100%" 
              mb={3} 
              p={2} 
              bgcolor={colors.primary[400]}
              borderRadius="8px"
              border={`1px solid ${colors.grey[700]}`}
            >
              <Typography variant="body1">
                Currently viewing: <strong>{'Assignments'}</strong> for track <strong>{activeTrack.track_name || "Unnamed Track"}</strong>
              </Typography>
            </Box>
          )}

          {/* Paper count and filter info */}
          <Box 
            width="100%" 
            mb={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" color={colors.grey[300]}>
              {filteredPapers.length} paper{filteredPapers.length !== 1 ? 's' : ''} found
              {searchTerm && ` matching "${searchTerm}"`}
              {decisionFilter !== "all" && ` with status "${decisionFilter}"`}
            </Typography>
          </Box>

          {/* Paper/Review list */}
          {filteredPapers.length > 0 ? (
            filteredPapers.map((paper, index) => (
              <Box
                key={index}
                width="100%"
                p={2}
                mb={3}
                borderRadius="12px"
                bgcolor={colors.primary[400]}
                border={`1px solid ${colors.grey[700]}`}
                boxShadow={2}
                onClick={() => handleToggleExpand(index)}
                sx={{
                  transition: "all 0.3s ease-in-out",
                  cursor: "pointer",
                  '&:hover': {
                    backgroundColor: colors.primary[500],
                  },
                }}
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
                      {parseAuthorsInfo(paper.authors)}
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      mt={1}
                      color={getReviewColor()}
                    >
                      Created At: {new Date(paper.createdAt).toLocaleDateString()}
                    </Typography>
                    
                    {paper.decision !== undefined && (
                      <Typography 
                        variant="body2" 
                        fontWeight="bold"
                        color={paper.decision === true 
                          ? colors.greenAccent[500] 
                          : paper.decision === false 
                            ? colors.redAccent[500] 
                            : colors.grey[300]}
                      >
                        Status: {paper.decision === true 
                          ? "Accepted" 
                          : paper.decision === false 
                            ? "Rejected" 
                            : "Pending Decision"}
                      </Typography>
                    )}
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
                        border: `1px solid ${colors.grey[700]}`,
                        borderRadius: "8px", 
                        p: 2,
                        mt: 1,
                        mb: 1,
                        bgcolor: colors.primary[500],
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
                      <AppButton
                        onClick={() => {
                          handleToggleExpand(index);
                        }}
                        text="Close"
                      />
                    </Box>
                  </Box>
                </Collapse>
              </Box>
            ))
          ) : (
            <Box 
              width="100%" 
              p={4} 
              textAlign="center" 
              color={colors.grey[300]}
              bgcolor={colors.primary[400]}
              borderRadius="12px"
              border={`1px solid ${colors.grey[700]}`}
            >
              No papers found matching your criteria
            </Box>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
