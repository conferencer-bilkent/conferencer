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
import ClickAwayListener from "@mui/material/ClickAwayListener";

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

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/profile/users", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleSearchFocus = async () => {
    if (users.length === 0) {
      await fetchUsers();
    }
    setShowUsers(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value && users.length === 0) {
      fetchUsers();
    }
  };

  const handleUserClick = (id: string) => {
    navigate(`/profile/${id}`);
    setShowUsers(false);
    setSearchTerm("");
  };

  const handleChatClick = (id: string) => {
    navigate(`/chat/${id}`);
    setShowUsers(false);
    setSearchTerm("");
  };

  const filteredUsers = users.filter((u) =>
    `${u.name} ${u.surname} ${u.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <Box display="flex" flexDirection="column" position="relative">
      <Box display="flex" justifyContent="space-between" p={2}>
        {/* Logo on the left */}
        <Box
          display="flex"
          alignItems="center"
          mr={3}
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/home")}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              color: colors.greenAccent[500],
            }}
          >
            CONFERENCER
          </Typography>
        </Box>

        <ClickAwayListener onClickAway={() => setShowUsers(false)}>
          <Box position="relative" flexGrow={1} maxWidth="600px" mr={2}>
            <Box
              display="flex"
              sx={{
                backgroundColor: colors.primary[400],
                borderRadius: "3px",
              }}
            >
              <InputBase
                sx={{ ml: 2, flex: 1 }}
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
              />
              <IconButton
                type="button"
                sx={{ p: 1 }}
                onClick={handleSearchFocus}
              >
                <SearchIcon />
              </IconButton>
            </Box>

            {/* User list dropdown */}
            {showUsers && (
              <Paper
                sx={{
                  position: "absolute",
                  top: "50px",
                  left: 0,
                  right: 0,
                  maxHeight: "300px",
                  overflowY: "auto",
                  zIndex: 1300,
                  p: 1,
                }}
              >
                <List>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                      <ListItem key={u._id} divider>
                        <Box display="flex" flexDirection="column" width="100%">
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
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ cursor: "pointer" }}
                            onClick={() => handleUserClick(u._id)}
                          >
                            {u.email}
                          </Typography>
                        </Box>
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      <Typography>No users found</Typography>
                    </ListItem>
                  )}
                </List>
              </Paper>
            )}
          </Box>
        </ClickAwayListener>

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
    </Box>
  );
};

export default Topbar;
