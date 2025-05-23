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
  Grow,
  ClickAwayListener,
  Badge,
} from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useUser } from "../../context/UserContext";
import { useNotifications } from "../../context/NotificationsContext";
import { useNavigate } from "react-router-dom";

const Topbar: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { user, logout } = useUser();
  const { notifications, setNotifications, fetchNotifications } =
    useNotifications();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [users, setUsers] = useState<any[]>([]);
  const [showUsers, setShowUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

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
    navigate(`/profile/${user?.id}`);
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

  // Compute unread count
  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const handleSearchFocus = async () => {
    if (users.length === 0) {
      await fetchUsers();
    }
    setShowUsers(true);
    setShowNotifications(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value && users.length === 0) {
      fetchUsers();
    }
  };

  const handleNotificationsClick = async () => {
    if (!showNotifications) {
      // Mark all as read on the server
      await fetch("http://127.0.0.1:5000/notification/mark_read", {
        method: "POST",
        credentials: "include",
      });

      // Update local state so badge clears
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    }
    setShowNotifications(!showNotifications);
    setShowUsers(false);
  };

  const handleUserClick = (id: string) => {
    navigate(`/profile/${id}`);
    setShowUsers(false);
    setSearchTerm("");
  };

  const handleChatClick = (user: any) => {
    navigate("/chat", {
      state: {
        selectedUser: {
          id: user._id,
          email: user.email,
          openCompose: true,
        },
      },
    });
    setShowUsers(false);
    setSearchTerm("");
  };

  const handleNotificationResponse = async (
    id: string,
    isAccepted: boolean
  ) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/notification/mark_answered/${id}/${isAccepted}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === id
              ? { ...notification, is_answered: true, is_accepted: isAccepted }
              : notification
          )
        );
      } else {
        console.error("Failed to update notification");
      }
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  // Filter out the logged-in user by comparing MongoDB _id
  const filteredUsers = users.filter(
    (u) =>
      u._id !== user?.id &&
      `${u.name} ${u.surname} ${u.email}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      position={"fixed"}
      width={"100%"}
      zIndex={1000}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={2}
      paddingRight={"50px"}
    >
      {/* Logo */}
      <Box
        display="flex"
        alignItems="center"
        sx={{
          cursor: "pointer",
          left: 0,
        }}
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

      {/* Search */}
      <ClickAwayListener onClickAway={() => setShowUsers(false)}>
        <Box position="relative" flexGrow={1} mx={10}>
          <Box
            display="flex"
            sx={{
              backgroundColor: colors.transparent,
              borderRadius: "3px",
              borderColor: colors.grey[300],
              borderWidth: "1px",
              borderStyle: "solid",
            }}
          >
            <InputBase
              sx={{ ml: 2, flex: 1 }}
              placeholder="Search for people..."
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
            />
            <IconButton type="button" sx={{ p: 1 }} onClick={handleSearchFocus}>
              <SearchIcon />
            </IconButton>
          </Box>

          {/* User List */}
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
                backgroundColor: colors.primary[400],
                boxShadow: theme.shadows[3],
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
                            onClick={() => handleChatClick(u)}
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
                  <ListItem key="no-users-found">
                    <Typography>No users found</Typography>
                  </ListItem>
                )}
              </List>
            </Paper>
          )}
        </Box>
      </ClickAwayListener>

      {/* Right Icons */}
      <Box display="flex" alignItems="center" ml="auto">
        {/* Create Conference Button */}
        <Button
          variant="outlined"
          sx={{
            mr: 2,
            borderColor: colors.greenAccent[500],
            color: colors.greenAccent[500],
            "&:hover": {
              backgroundColor: colors.transparent,
              borderColor: colors.greenAccent[400],
              color: colors.greenAccent[400],
            },
          }}
          onClick={() => navigate("/conference/create")}
        >
          Create Conference
        </Button>

        {/* Theme toggle */}
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>

        {/* Notifications */}
        <ClickAwayListener onClickAway={() => setShowNotifications(false)}>
          <Box position="relative">
            <IconButton onClick={handleNotificationsClick}>
              <Badge
                badgeContent={unreadCount}
                color="error"
                overlap="circular"
                invisible={unreadCount === 0}
              >
                <NotificationsOutlinedIcon />
              </Badge>
            </IconButton>
            <Grow
              in={showNotifications}
              style={{ transformOrigin: "top right" }}
            >
              <Paper
                sx={{
                  position: "absolute",
                  top: "45px",
                  right: 0,
                  width: "320px",
                  maxHeight: "400px",
                  overflowY: "auto",
                  zIndex: 1300,
                  p: 2,
                  backgroundColor: colors.primary[400],
                  boxShadow: theme.shadows[6],
                  border: `1px solid ${colors.grey[300]}`,
                  borderRadius: "8px",
                  "&::-webkit-scrollbar": { width: "6px" },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: colors.grey[500],
                    borderRadius: "10px",
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: "-10px",
                    right: "14px",
                    width: 0,
                    height: 0,
                    borderLeft: "10px solid transparent",
                    borderRight: "10px solid transparent",
                    borderBottom: `10px solid ${colors.primary[400]}`,
                  },
                }}
              >
                <List>
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <ListItem
                        key={`notification-${notif.id}`}
                        sx={{
                          mb: 1,
                          borderRadius: "4px",
                          bgcolor: notif.is_interactive
                            ? notif.is_answered
                              ? notif.is_accepted
                                ? colors.greenAccent[600]
                                : colors.redAccent[600]
                              : colors.primary[800]
                            : colors.blueAccent[400],
                          flexDirection: "column",
                          alignItems: "flex-start",
                          "&:hover": { bgcolor: colors.primary[700] },
                        }}
                      >
                        <Typography fontWeight="bold">{notif.title}</Typography>
                        <Typography variant="body2">{notif.content}</Typography>
                        {notif.is_interactive && !notif.is_answered && (
                          <Box display="flex" mt={1} gap={1}>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() =>
                                handleNotificationResponse(notif.id, true)
                              }
                            >
                              Accept
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              onClick={() =>
                                handleNotificationResponse(notif.id, false)
                              }
                            >
                              Reject
                            </Button>
                          </Box>
                        )}
                      </ListItem>
                    ))
                  ) : (
                    <ListItem key="no-notifications">
                      <Typography variant="body2" color="textSecondary">
                        No new notifications
                      </Typography>
                    </ListItem>
                  )}
                </List>
              </Paper>
            </Grow>
          </Box>
        </ClickAwayListener>

        {/* Settings */}
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>

        {/* User profile */}
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
  );
};

export default Topbar;
