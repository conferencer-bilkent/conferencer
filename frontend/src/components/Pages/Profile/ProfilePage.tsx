import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Autocomplete,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import AppTitle from "../../global/AppTitle";
import ProfileUserRoles from "./components/ProfileUserRoles";
import { tokens } from "../../../theme";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import { getUserStats, UserData, Role } from "../../../models/user";
import { getUserById } from "../../../services/userService";
import userService from "../../../services/userService";
import AppButton from "../../global/AppButton";
import { RateReview } from "@mui/icons-material";

const ProfilePage: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user: currentUser } = useUser();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState<UserData | null>(null);
  const [userRoles, setUserRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    surname: "",
    bio: "",
    email: "",
    affiliation: "",
  });
  const [allKeywords, setAllKeywords] = useState<string[]>([]);
  const [preferredKeywords, setPreferredKeywords] = useState<string[]>([]);
  const [unwantedKeywords, setUnwantedKeywords] = useState<string[]>([]);
  const [affiliations, setAffiliations] = useState<string[]>([]);
  const [selectedAffiliation, setSelectedAffiliation] = useState<string>("");
  const [affiliationInput, setAffiliationInput] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Fetching user data for ID:", id);
        const userData = await getUserById(id!);
        const roleObjs: Role[] = [];

        if (userData.roles) {
          for (const rid of userData.roles) {
            try {
              const role = await userService.getRoleById(rid);
              if (role) {
                roleObjs.push(role);
              }
            } catch (err) {
              console.warn(`Failed to fetch role ${rid}:`, err);
            }
          }
        }

        setProfileUser(userData);
        setUserRoles(roleObjs);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchUserData();
    }
  }, [id]);

  const isOwnProfile = currentUser?.id === id;

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/keywords", {
          credentials: "include",
        });
        const data = await response.json();
        setAllKeywords(
          Array.isArray(data.keywords.keywords) ? data.keywords.keywords : []
        );
      } catch (error) {
        console.error("Error fetching keywords:", error);
      }
    };
    fetchKeywords();
  }, []);

  useEffect(() => {
    const fetchAffiliations = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:5000/profile/affiliations",
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        setAffiliations(data.affiliations || []);
      } catch (error) {
        console.error("Error fetching affiliations:", error);
      }
    };
    fetchAffiliations();
  }, []);

  useEffect(() => {
    if (profileUser) {
      setEditData({
        name: profileUser.name || "",
        surname: profileUser.surname || "",
        bio: profileUser.bio || "",
        email: profileUser.email || "",
        affiliation: profileUser.affiliation || "",
      });
      setPreferredKeywords(profileUser.preferred_keywords || []);
      setUnwantedKeywords(profileUser.not_preferred_keywords || []);
      setSelectedAffiliation(profileUser.affiliation || "");
      setAffiliationInput(profileUser.affiliation || "");
    }
    console.log("Profile User:", profileUser);
    console.log("Preferred Keywords:", preferredKeywords);
  }, [profileUser]);

  const activeRoles = userRoles.filter((r) => r.is_active);
  const pastRoles = userRoles.filter((r) => !r.is_active);

  const handleEditOpen = () => setIsEditOpen(true);
  const handleEditClose = () => setIsEditOpen(false);
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: editData.name,
          surname: editData.surname,
          bio: editData.bio,
          email: editData.email,
          preferred_keywords: preferredKeywords,
          not_preferred_keywords: unwantedKeywords,
          affiliation: affiliationInput,
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      handleEditClose();
      window.location.reload(); // Force refresh of the page
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: "red", textAlign: "center", marginTop: "50px" }}>
        <p>{error}</p>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div style={{ color: "red", textAlign: "center", marginTop: "50px" }}>
        <p>User not found</p>
      </div>
    );
  }

  const userStats = profileUser.stats
    ? getUserStats(profileUser)
    : {
        avg_rating_given: "-",
        avg_submit_time_before_deadline: "-",
        avg_time_to_review: "-",
        deadline_compliance_rate: "-",
        review_rating: "-",
        totalReviews: 0,
        conferencesWorked: 0,
        submissions: 0,
      };

  // Add this style for the flex container
  const flexContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: "20px",
    marginTop: "20px",
  };

  // Update the roles container wrapper style
  const rolesContainerStyle: React.CSSProperties = {
    flex: "1",
    maxHeight: "300px", // Set a fixed max height
    minHeight: "250px", // Set a minimum height to match stats container
    overflow: "auto", // Add scrollability
  };

  // Update stats container style
  const statsContainerStyle: React.CSSProperties = {
    flex: "1",
    border: `1px solid ${colors.grey[100]}`,

    borderRadius: "12px",
    padding: "15px",
    height: "fit-content", // Adapt to content size
    minHeight: "190px", // Set minimum height
  };

  const statsTableStyle: React.CSSProperties = {
    borderCollapse: "collapse",
    width: "100%",

    marginTop: "10px",
  };

  // BUNU AL
  const statsCellStyle: React.CSSProperties = {
    padding: "8px",
    color: colors.grey[100],
    width: "50%",
    borderBottom: `1px solid ${colors.grey[100]}`,
    borderRight: `1px solid ${colors.grey[100]}`,
    borderTop: `1px solid ${colors.grey[100]}`,
    borderLeft: `1px solid ${colors.grey[100]}`,
    backgroundColor: colors.primary[400],
  };

  // Add a style for the last column cells without right border
  const lastCellStyle: React.CSSProperties = {
    padding: "8px",
    color: colors.grey[100],
    width: "50%",
    borderBottom: `1px solid ${colors.grey[100]}`,
    borderRight: `1px solid ${colors.grey[100]}`,
    borderTop: `1px solid ${colors.grey[100]}`,
    borderLeft: `1px solid ${colors.grey[100]}`,
    backgroundColor: colors.primary[400],
  };

  const statsTitleStyle: React.CSSProperties = {
    fontWeight: "bold",
    marginBottom: "10px",
    color: colors.grey[100],
    fontFamily: theme.typography.fontFamily,
  };

  // Define a new keywords container style
  const keywordsContainerStyle: React.CSSProperties = {
    marginTop: "20px",
    border: `1px solid ${colors.grey[100]}`,
    borderRadius: "12px",
    padding: "15px",
    backgroundColor: colors.primary[500],
  };

  const keywordsTitleStyle: React.CSSProperties = {
    fontWeight: "bold",
    marginBottom: "10px",
    color: colors.grey[100],
    fontFamily: theme.typography.fontFamily,
    backgroundColor: colors.primary[500],
  };

  return (
    <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <AppTitle
            text={
              isOwnProfile
                ? `Welcome! ${profileUser.name} ${profileUser.surname}`
                : `${profileUser.name} ${profileUser.surname}'s Profile Page`
            }
          />
          {isOwnProfile && (
            <AppButton
              onClick={handleEditOpen}
              icon={<RateReview />}
              text="Edit Profile"
            />
          )}
        </div>

        <div style={{ marginTop: "20px" }}>
          <p>Name: {profileUser.name}</p>
          <p>Surname: {profileUser.surname}</p>
          <p>Bio: {profileUser.bio || "No bio provided"}</p>
          <p>Email: {profileUser.email}</p>
          <p>
            Affiliation: {profileUser.affiliation || "No affiliation provided"}
          </p>
        </div>

        {/* New flex container for roles and stats */}
        <div style={flexContainerStyle}>
          {/* Roles section with scrollability */}
          <div style={rolesContainerStyle}>
            <ProfileUserRoles
              activeRoles={activeRoles.map((role) => ({
                name: role.position || "Unknown",
                conferenceId: role.conference_id || undefined,
              }))}
              pastRoles={pastRoles.map((role) => ({
                name: role.position || "Unknown",
                conferenceId: role.conference_id || undefined,
              }))}
            />
          </div>

          {/* Stats section */}
          <div style={statsContainerStyle}>
            <h3 style={statsTitleStyle}>Stats</h3>
            <div>
              <table style={statsTableStyle}>
                <tbody>
                  <tr>
                    <td style={statsCellStyle}>Average Rating Given:</td>
                    <td style={lastCellStyle}>{userStats.avg_rating_given}</td>
                  </tr>
                  <tr>
                    <td style={statsCellStyle}>Avg Time Before Deadline:</td>
                    <td style={lastCellStyle}>
                      {userStats.avg_submit_time_before_deadline}
                    </td>
                  </tr>
                  <tr>
                    <td style={statsCellStyle}>Avg Time to Review:</td>
                    <td style={lastCellStyle}>
                      {userStats.avg_time_to_review}
                    </td>
                  </tr>
                  <tr>
                    <td style={statsCellStyle}>Deadline Compliance Rate:</td>
                    <td style={lastCellStyle}>
                      {userStats.deadline_compliance_rate}
                    </td>
                  </tr>
                  <tr>
                    <td style={statsCellStyle}>Review Rating:</td>
                    <td style={lastCellStyle}>{userStats.review_rating}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div style={keywordsContainerStyle}>
          <h3 style={keywordsTitleStyle}>Keywords</h3>
          <Table size="small" style={{ color: colors.grey[100] }}>
            <TableHead>
              <TableRow>
                <TableCell style={statsCellStyle}>
                  <strong>Preferred Keywords</strong>
                </TableCell>
                <TableCell style={statsCellStyle}>
                  <strong>Unwanted Keywords</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({
                length: Math.max(
                  preferredKeywords.length,
                  unwantedKeywords.length
                ),
              }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell style={statsCellStyle}>
                    {preferredKeywords[index] || "-"}
                  </TableCell>
                  <TableCell style={statsCellStyle}>
                    {unwantedKeywords[index] || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog
        open={isEditOpen}
        onClose={handleEditClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Personal Information</DialogTitle>
        <DialogContent
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            marginTop: "10px",
          }}
        >
          <TextField
            label="Name"
            name="name"
            value={editData.name}
            onChange={handleEditChange}
          />
          <TextField
            label="Surname"
            name="surname"
            value={editData.surname}
            onChange={handleEditChange}
          />
          <TextField
            label="Bio"
            name="bio"
            multiline
            rows={3}
            value={editData.bio}
            onChange={handleEditChange}
          />
          <TextField
            label="Email"
            name="email"
            value={editData.email}
            onChange={handleEditChange}
          />

          <Autocomplete
            multiple
            options={allKeywords}
            value={preferredKeywords}
            onChange={(_, newValue) => setPreferredKeywords(newValue)}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Preferred Keywords"
                placeholder="Search keywords"
              />
            )}
          />

          <Autocomplete
            multiple
            options={allKeywords}
            value={unwantedKeywords}
            onChange={(_, newValue) => setUnwantedKeywords(newValue)}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Unwanted Keywords"
                placeholder="Search keywords"
              />
            )}
          />

          <Autocomplete
            freeSolo
            value={affiliationInput}
            onChange={(_, newValue) => setAffiliationInput(newValue || "")}
            onInputChange={(_, newValue) => setAffiliationInput(newValue)}
            inputValue={affiliationInput}
            options={affiliations}
            ListboxProps={{
              style: { maxHeight: "200px" }, // Makes the dropdown scrollable after ~5 items
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Affiliation"
                variant="outlined"
                fullWidth
              />
            )}
            slotProps={{
              popper: {
                style: { maxHeight: "300px", overflow: "auto" },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
