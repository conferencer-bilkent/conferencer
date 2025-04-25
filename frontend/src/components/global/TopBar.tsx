import {
  Box,
  IconButton,
  useTheme,
  InputBase,
  Menu,
  MenuItem,
  Typography,
  Avatar,
  List,
  ListItem,
  Paper,
  Button,
} from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const Topbar: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { user, logout } = useUser();
  const navigate = useNavigate();

  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // User list state
  const [users, setUsers] = useState<any[]>([]);
  const [showUsers, setShowUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/login");
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate("/profile");
  };

  const getInitials = () => {
    return user?.name ? user.name.charAt(0).toUpperCase() : "U";
  };

  const handleSearchClick = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/profile/users", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setUsers(data);
      setShowUsers(true);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleUserClick = (id: string) => {
    navigate(`/profile/${id}`);
  };

  const handleChatClick = (id: string) => {
    navigate(`/chat/${id}`);
  };

  return (
    <Box display="flex" flexDirection="column" position="relative">
      <Box display="flex" justifyContent="space-between" p={2}>
        <Box
          display="flex"
          sx={{
            backgroundColor: colors.primary[400],
            borderRadius: "3px",
            position: "relative",
          }}
        >
          <InputBase
            sx={{ ml: 2, flex: 1 }}
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IconButton type="button" sx={{ p: 1 }} onClick={handleSearchClick}>
            <SearchIcon />
          </IconButton>
        </Box>

        <Box display="flex" alignItems="center">
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
          <IconButton>
            <NotificationsOutlinedIcon />
          </IconButton>
          <IconButton>
            <SettingsOutlinedIcon />
          </IconButton>

          {/* User section with menu */}
          <Box display="flex" alignItems="center" ml={1}>
            {user && (
              <Typography variant="body1" mr={1}>
                {user.name}
              </Typography>
            )}
            <IconButton
              onClick={handleMenuOpen}
              aria-controls={open ? "user-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              {user ? (
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: colors.greenAccent[500],
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                  }}
                >
                  {getInitials()}
                </Avatar>
              ) : (
                <PersonOutlinedIcon />
              )}
            </IconButton>
            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              MenuListProps={{
                "aria-labelledby": "user-button",
              }}
            >
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleMenuClose}>My account</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Box>

      {/* Scrollable user list */}
      {showUsers && (
        <Paper
          sx={{
            position: "absolute",
            top: "70px",
            left: "16px",
            right: "16px",
            maxHeight: "300px",
            overflowY: "auto",
            zIndex: 1300,
            p: 1,
          }}
        >
          <List>
            {users
              .filter((u) =>
                `${u.name} ${u.surname}`
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
              .map((u) => (
                <ListItem key={u._id} divider>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                  >
                    <Typography
                      sx={{ cursor: "pointer", fontWeight: 500 }}
                      onClick={() => handleUserClick(u._id)}
                    >
                      {u.name} {u.surname}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleChatClick(u._id)}
                    >
                      Chat
                    </Button>
                  </Box>
                </ListItem>
              ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default Topbar;
