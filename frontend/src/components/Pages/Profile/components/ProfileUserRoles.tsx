import React, { useEffect, useState } from "react";
import RoleItem from "./RoleItem";
import { tokens } from "../../../../theme";
import { useTheme } from "@mui/material";
import { getConferenceById } from "../../../../services/conferenceService";
import { useNavigate } from "react-router-dom";
import { useConference } from "../../../../context/ConferenceContext";
import { CircularProgress, Box } from "@mui/material";

interface Role {
  name: string;
  conferenceId?: string;
  conferenceName?: string;
}

interface UserRolesProps {
  activeRoles: Role[];
  pastRoles: Role[];
}

const UserRoles: React.FC<UserRolesProps> = ({ activeRoles, pastRoles }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { setActiveConference } = useConference();
  const [enhancedActiveRoles, setEnhancedActiveRoles] = useState<Role[]>([]);
  const [enhancedPastRoles, setEnhancedPastRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchConferenceData = async () => {
      setLoading(true);
      
      // Create a map to track which conferences we've already processed
      const processedConferences = new Map<string, string>();
      
      // Group roles by conference
      const conferenceRolesMap = new Map<string, Role[]>();
      
      // Process active roles
      for (const role of activeRoles) {
        if (role.conferenceId) {
          if (!conferenceRolesMap.has(role.conferenceId)) {
            conferenceRolesMap.set(role.conferenceId, []);
          }
          conferenceRolesMap.get(role.conferenceId)!.push(role);
        }
      }
      
      // Fetch conference names for active roles
      const enhancedActive = await Promise.all(
        activeRoles.map(async (role) => {
          if (role.conferenceId && !role.conferenceName) {
            try {
              // Only fetch if we haven't processed this conference yet
              if (!processedConferences.has(role.conferenceId)) {
                const conference = await getConferenceById(role.conferenceId);
                processedConferences.set(role.conferenceId, conference.name);
              }
              
              return {
                ...role,
                conferenceName: processedConferences.get(role.conferenceId)
              };
            } catch (error) {
              console.error(`Error fetching conference ${role.conferenceId}:`, error);
              return role;
            }
          }
          return role;
        })
      );
      
      // Do the same for past roles
      const enhancedPast = await Promise.all(
        pastRoles.map(async (role) => {
          if (role.conferenceId && !role.conferenceName) {
            try {
              if (!processedConferences.has(role.conferenceId)) {
                const conference = await getConferenceById(role.conferenceId);
                processedConferences.set(role.conferenceId, conference.name);
              }
              
              return {
                ...role,
                conferenceName: processedConferences.get(role.conferenceId)
              };
            } catch (error) {
              console.error(`Error fetching conference ${role.conferenceId}:`, error);
              return role;
            }
          }
          return role;
        })
      );
      
      // Filter out duplicate roles based on hierarchy
      const filteredActiveRoles = filterRolesByHierarchy(enhancedActive);
      const filteredPastRoles = filterRolesByHierarchy(enhancedPast);
      
      setEnhancedActiveRoles(filteredActiveRoles);
      setEnhancedPastRoles(filteredPastRoles);
      setLoading(false);
    };
    
    fetchConferenceData();
  }, [activeRoles, pastRoles]);
  
  // Function to filter roles by hierarchy
  const filterRolesByHierarchy = (roles: Role[]): Role[] => {
    const conferenceRolesMap = new Map<string, Role[]>();
    
    // Group roles by conference
    for (const role of roles) {
      if (role.conferenceId) {
        if (!conferenceRolesMap.has(role.conferenceId)) {
          conferenceRolesMap.set(role.conferenceId, []);
        }
        conferenceRolesMap.get(role.conferenceId)!.push(role);
      }
    }
    
    const filteredRoles: Role[] = [];
    
    // Keep roles without conferenceId
    roles.forEach(role => {
      if (!role.conferenceId) {
        filteredRoles.push(role);
      }
    });
    
    // For each conference, only keep the highest role in the hierarchy
    conferenceRolesMap.forEach((conferenceRoles) => {
      // Check for Superchair
      const superchair = conferenceRoles.find(r => r.name.toLowerCase().includes('superchair'));
      if (superchair) {
        filteredRoles.push({
          ...superchair,
          name: `Superchair - ${superchair.conferenceName || ''}`
        });
        return;
      }
      
      // Check for Track Chair
      const trackchair = conferenceRoles.find(r => r.name.toLowerCase().includes('track chair'));
      if (trackchair) {
        filteredRoles.push({
          ...trackchair,
          name: `Track Chair - ${trackchair.conferenceName || ''}`
        });
        return;
      }
      
      // Check for PC Member
      const pcMember = conferenceRoles.find(r => r.name.toLowerCase().includes('pc member'));
      if (pcMember) {
        filteredRoles.push({
          ...pcMember,
          name: `PC Member - ${pcMember.conferenceName || ''}`
        });
        return;
      }
      
      // If no specific role is found, add all roles for this conference
      conferenceRoles.forEach(role => {
        filteredRoles.push({
          ...role,
          name: `${role.name} - ${role.conferenceName || ''}`
        });
      });
    });
    
    return filteredRoles;
  };
  
  // Function to handle role click
  const handleRoleClick = async (role: Role) => {
    if (role.conferenceId) {
      try {
        // Fetch the full conference data
        const conference = await getConferenceById(role.conferenceId);
        
        // Set as active conference
        setActiveConference(conference);
        
        // Navigate to conference page
        navigate(`/conference`)
      } catch (error) {
        console.error("Error navigating to conference:", error);
      }
    }
  };

  const containerStyle: React.CSSProperties = {
    border: `1px solid ${colors.grey[100]}`,
    borderRadius: "12px",
    padding: "15px",
    color: "white",
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden", // Hide overflow from the main container
  };
  
  const titleStyle: React.CSSProperties = {
    fontWeight: "bold",
    marginBottom: "10px",
    color: colors.grey[100],
    fontFamily: theme.typography.fontFamily,
  };
  
  const listStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  };
  
  const scrollableSectionStyle: React.CSSProperties = {
    overflowY: "auto",
    flex:1, // Takes up available space
    paddingRight: "8px", // Space for the scrollbar
  };
  
  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>Active Roles</h3>
      <div style={scrollableSectionStyle}>
        {loading ? (
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            height="100%" 
            minHeight="120px"
          >
            <CircularProgress 
              size={40} 
              thickness={4} 
              sx={{ 
                color: colors.blueAccent[400],
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                }
              }} 
            />
          </Box>
        ) : (
          <>
            <div style={listStyle}>
              {enhancedActiveRoles.map((role, index) => (
                <div 
                  key={index} 
                  onClick={() => handleRoleClick(role)}
                  style={{ cursor: role.conferenceId ? 'pointer' : 'default' }}
                  title={role.conferenceId ? "Click to go to conference" : ""}
                >
                  <RoleItem name={role.name} />
                </div>
              ))}
            </div>

            {/* Past Roles Section */}
            <h3 style={{ ...titleStyle, marginTop: "20px" }}>Past Roles</h3>
            <div style={listStyle}>
              {enhancedPastRoles.map((role, index) => (
                <div 
                  key={index} 
                  onClick={() => handleRoleClick(role)}
                  style={{ cursor: role.conferenceId ? 'pointer' : 'default' }}
                  title={role.conferenceId ? "Click to go to conference" : ""}
                >
                  <RoleItem name={role.name} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserRoles;
