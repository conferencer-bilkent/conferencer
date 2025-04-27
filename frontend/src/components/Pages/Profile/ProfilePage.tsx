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
  Checkbox,
  ListItemText,
  Autocomplete,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import AppTitle from "../../global/AppTitle";
import SideMenu from "../../global/SideMenu";
import TopBar from "../../global/TopBar";
import { getMenuItemsForPage } from "../../global/sideMenuConfig";
import ProfileUserRoles from "./components/ProfileUserRoles";
import { tokens } from "../../../theme";
import { useNavigate, useParams } from "react-router-dom";
import { handleMenuItemClick } from "../../../utils/navigation/menuNavigation";
import { useUser } from "../../../context/UserContext";
import { emptyRole, getUserStats, UserData } from "../../../models/user";
import { getUserById } from "../../../services/userService";

const ProfilePage: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const menuItems = getMenuItemsForPage("default");
  const navigate = useNavigate();
  const { user: currentUser, loading: contextLoading } = useUser();
  const { id } = useParams<{ id: string }>();
  const [profileUser, setProfileUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    surname: "",
    bio: "",
    email: "",
  });
  const [allKeywords, setAllKeywords] = useState<string[]>([]);
  const [preferredKeywords, setPreferredKeywords] = useState<string[]>([]);
  const [unwantedKeywords, setUnwantedKeywords] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (id == currentUser?.id || !id) {
          if (currentUser) {
            setProfileUser(currentUser);
          } else if (!contextLoading) {
            navigate("/login");
          }
        } else {
          const userData = await getUserById(id!);
          setProfileUser(userData);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load user profile");
      } finally {
        setLoading(contextLoading ? true : false);
      }
    };
    fetchUserData();
  }, [id, currentUser, contextLoading, navigate]);

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
    if (profileUser) {
      setEditData({
        name: profileUser.name || "",
        surname: profileUser.surname || "",
        bio: profileUser.bio || "",
        email: profileUser.email || "",
      });
      setPreferredKeywords(profileUser.preferred_keywords || []);
      setUnwantedKeywords(profileUser.unwanted_keywords || []);
    }
    console.log("Profile User:", profileUser);
    console.log("Preferred Keywords:", preferredKeywords);
  }, [profileUser]);

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editData.name,
          surname: editData.surname,
          bio: editData.bio,
          preferred_keywords: preferredKeywords,
          unwanted_keywords: unwantedKeywords,
        }),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      setProfileUser((prev) =>
        prev
          ? {
              ...prev,
              name: editData.name,
              surname: editData.surname,
              bio: editData.bio,
              preferred_keywords: preferredKeywords,
              unwanted_keywords: unwantedKeywords,
            }
          : null
      );
      handleEditClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleItemClick = (item: string) => {
    handleMenuItemClick(item, navigate);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
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

  const userRoles = profileUser.roles;
  const activeRoles = userRoles?.active || [emptyRole];
  const pastRoles = userRoles?.past || [emptyRole];

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      <div style={{ width: "220px" }}>
        <SideMenu items={menuItems} onItemClick={handleItemClick} />
      </div>
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <TopBar />
        <div style={{ padding: "20px", overflowY: "auto" }}>
          <Button
            variant="contained"
            onClick={handleEditOpen}
            style={{ alignSelf: "flex-end", marginBottom: "10px" }}
          >
            Edit Profile
          </Button>
          <AppTitle text={`${profileUser.name} ${profileUser.surname}`} />

          <div style={{ marginTop: "20px" }}>
            <p>Name: {profileUser.name}</p>
            <p>Surname: {profileUser.surname}</p>
            <p>Bio: {profileUser.bio || "No bio provided"}</p>
            <p>Email: {profileUser.email}</p>
          </div>

          <div style={{ marginTop: "20px" }}>
            <h3>Stats</h3>
            <ul>
              <li>Average Rating Given: {userStats.avg_rating_given}</li>
              <li>
                Avg Time Before Deadline:{" "}
                {userStats.avg_submit_time_before_deadline}
              </li>
              <li>Avg Time to Review: {userStats.avg_time_to_review}</li>
              <li>
                Deadline Compliance Rate: {userStats.deadline_compliance_rate}
              </li>
              <li>Review Rating: {userStats.review_rating}</li>
            </ul>
          </div>

          <div style={{ marginTop: "20px" }}>
            <ProfileUserRoles
              activeRoles={activeRoles.map((role) => ({
                name: role?.name || "Unknown",
              }))}
              pastRoles={pastRoles.map((role) => ({
                name: role?.name || "Unknown",
              }))}
            />
          </div>

          <div style={{ marginTop: "20px" }}>
            <h3>Keywords</h3>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Preferred Keywords</strong>
                  </TableCell>
                  <TableCell>
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
                    <TableCell>{preferredKeywords[index] || "-"}</TableCell>
                    <TableCell>{unwantedKeywords[index] || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
