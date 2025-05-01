import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import AppTitle from "../../global/AppTitle";
import { tokens } from "../../../theme";
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Avatar,
  Typography,
  Paper,
  CircularProgress,
  Modal,
  ClickAwayListener,
  IconButton,
} from "@mui/material";
import {
  Send as SendIcon,
  Edit as EditIcon,
  Inbox as InboxIcon,
  Send as SentIcon,
  Forum as ForumIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Reply as ReplyIcon,
} from "@mui/icons-material";
import { useUser } from "../../../context/UserContext";

interface Message {
  id: string;
  from?: string;
  to?: string;
  subject: string;
  content: string;
  timestamp: string;
  read?: boolean;
}

interface User {
  id: string;
  name: string;
  surname: string;
}

interface SelectedUser {
  id: string;
  email: string;
}

const ChatPage: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user } = useUser();

  const [activeView, setActiveView] = useState<"inbox" | "sent" | "chats">(
    "inbox"
  );
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inboxMessages, setInboxMessages] = useState<Message[]>([]);
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeSubject, setComposeSubject] = useState("");
  const [composeContent, setComposeContent] = useState("");
  const [userDetails, setUserDetails] = useState<{ [key: string]: User }>({});
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<SelectedUser[]>([]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError("");
      const inboxResponse = await fetch("http://127.0.0.1:5000/chad/inbox", {
        credentials: "include",
      });
      if (!inboxResponse.ok) throw new Error("Failed to fetch inbox");
      const inboxData = await inboxResponse.json();
      setInboxMessages(inboxData.received_chads || []);
      const sentResponse = await fetch("http://127.0.0.1:5000/chad/outbox", {
        credentials: "include",
      });
      if (!sentResponse.ok) throw new Error("Failed to fetch sent messages");
      const sentData = await sentResponse.json();
      setSentMessages(sentData.sent_chads || []);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch messages");
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userIds: string[]) => {
    try {
      const uniqueIds = [...new Set(userIds)];
      const promises = uniqueIds.map((id) =>
        fetch(`http://127.0.0.1:5000/profile/${id}`, {
          credentials: "include",
        }).then((res) => res.json())
      );
      const users = await Promise.all(promises);
      const userMap = users.reduce((acc, user, index) => {
        const userId = uniqueIds[index];
        if (userId) {
          acc[userId] = user;
        } else {
          console.warn("User ID is missing for fetched user:", user);
        }
        return acc;
      }, {});
      console.log("Fetched user details:", userMap);
      setUserDetails((prevDetails) => ({ ...prevDetails, ...userMap }));
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
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

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    const userIds = [
      ...inboxMessages.map((m) => m.from),
      ...sentMessages.map((m) => m.to),
    ].filter((id): id is string => !!id && !userDetails[id]);
    if (userIds.length > 0) {
      console.log("userid ler bunlar AAAAAAAAAA", userIds);
      fetchUserDetails(userIds);
    }
  }, [inboxMessages, sentMessages]);

  useEffect(() => {
    if (composeOpen) {
      fetchUsers();
    }
  }, [composeOpen]);

  const groupMessagesBySubject = () => {
    const allMessages = [...inboxMessages, ...sentMessages];
    const grouped: { [subject: string]: Message[] } = {};
    allMessages.forEach((msg) => {
      const key = msg.subject || "No Subject";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(msg);
    });
    Object.values(grouped).forEach((msgs) =>
      msgs.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )
    );
    return grouped;
  };

  const getUserFullName = (userId: string) => {
    const user = userDetails[userId];
    console.log("User details:", userDetails);

    return user ? `${user.name} ${user.surname}` : "Unknown User";
  };

  const navButtonStyle = (active: boolean): React.CSSProperties => ({
    justifyContent: "flex-start",
    textTransform: "none",
    padding: "12px 16px",
    backgroundColor: active ? colors.blueAccent[700] : "transparent",
  });

  const contactItemStyle = (selected: boolean): React.CSSProperties => ({
    backgroundColor: selected ? colors.blueAccent[700] : "transparent",
    cursor: "pointer",
  });

  const filteredUsers = users.filter(
    (u) =>
      u._id !== user?.id &&
      `${u.name} ${u.surname} ${u.email}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const handleReply = async (message: Message) => {
    const replyToId = message.from;

    // Fetch users if not already loaded
    if (users.length === 0) {
      await fetchUsers();
    }

    const replyToUser = users.find((u) => u._id === replyToId);

    if (replyToId) {
      // If user not found in users array, fetch their details directly
      if (!replyToUser) {
        try {
          const response = await fetch(
            `http://127.0.0.1:5000/profile/${replyToId}`,
            {
              credentials: "include",
            }
          );
          const userData = await response.json();
          setSelectedUsers([{ id: replyToId, email: userData.email }]);
        } catch (error) {
          console.error("Failed to fetch user details:", error);
          return;
        }
      } else {
        setSelectedUsers([{ id: replyToId, email: replyToUser.email }]);
      }

      setComposeSubject(`${message.subject}`);
      setComposeOpen(true);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const displayedContacts =
    activeView === "chats"
      ? Object.entries(groupMessagesBySubject())
          .map(([subject, messages]) => ({
            id: subject,
            name: subject,
            lastMessage: messages[messages.length - 1],
          }))
          .sort(
            (a, b) =>
              new Date(b.lastMessage.timestamp).getTime() -
              new Date(a.lastMessage.timestamp).getTime()
          )
      : Array.from(
          new Map(
            (activeView === "inbox" ? inboxMessages : sentMessages).map(
              (msg) => {
                const contactId = activeView === "inbox" ? msg.from : msg.to;
                const contactName = getUserFullName(contactId || "");
                return [
                  contactId,
                  {
                    id: contactId,
                    name: contactName,
                    subject: msg.subject,
                    timestamp: msg.timestamp,
                  },
                ];
              }
            )
          ).values()
        ).sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

  const displayedMessages =
    activeView === "chats"
      ? selectedContact
        ? groupMessagesBySubject()[selectedContact] || []
        : []
      : selectedContact
      ? (activeView === "inbox" ? inboxMessages : sentMessages).filter(
          (msg) =>
            (activeView === "inbox" ? msg.from : msg.to) === selectedContact
        )
      : [];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",

        backgroundColor: theme.palette.background.default,
      }}
    >
      <div
        style={{ flex: 1, display: "flex", overflow: "hidden", padding: 16 }}
      >
        <Paper
          style={{
            width: 300,
            borderRight: `1px solid ${colors.grey[700]}`,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "transparent",
            flexShrink: 0,
          }}
          elevation={0}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            style={{
              margin: 16,
              padding: 12,
              textTransform: "none",
              borderRadius: 24,
              boxShadow: "none",
              backgroundColor: colors.blueAccent[700],
            }}
            onClick={() => {
              setComposeOpen(true);
            }}
          >
            New Message
          </Button>
          <Box>
            <Button
              fullWidth
              startIcon={<InboxIcon />}
              style={navButtonStyle(activeView === "inbox")}
              onClick={() => setActiveView("inbox")}
            >
              Inbox
            </Button>
            <Button
              fullWidth
              startIcon={<SentIcon />}
              style={navButtonStyle(activeView === "sent")}
              onClick={() => setActiveView("sent")}
            >
              Sent
            </Button>
            <Button
              fullWidth
              startIcon={<ForumIcon />}
              style={navButtonStyle(activeView === "chats")}
              onClick={() => setActiveView("chats")}
            >
              Chats
            </Button>
          </Box>
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              placeholder="Search messages..."
              size="small"
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
              }}
            />
          </Box>
          <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
            <Typography variant="subtitle1" sx={{ p: 2, fontWeight: "bold" }}>
              Recent
            </Typography>
            <List>
              {displayedContacts.map((item: any) => (
                <ListItem
                  key={typeof item === "string" ? item : item.id}
                  style={contactItemStyle(
                    selectedContact === (item.id || item)
                  )}
                  onClick={() => setSelectedContact(item.id || item)}
                >
                  <Avatar sx={{ bgcolor: colors.greenAccent[500], mr: 2 }}>
                    {activeView === "chats"
                      ? (item.name || "").substring(0, 2).toUpperCase()
                      : getUserFullName(item.id || "")
                          .substring(0, 2)
                          .toUpperCase()}
                  </Avatar>
                  <ListItemText
                    primary={
                      activeView === "chats"
                        ? item.name
                        : getUserFullName(item.id || "")
                    }
                    secondary={item.subject || ""}
                    primaryTypographyProps={{ fontWeight: "bold" }}
                    secondaryTypographyProps={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Paper>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: 20,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <AppTitle text={selectedContact || "Select a conversation"} />
          </div>

          {selectedContact && displayedMessages.length > 0 ? (
            activeView === "chats" ? (
              <Box
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  backgroundColor: "transparent",
                  borderRadius: 2,
                  padding: 2,
                  mb: 2,
                }}
              >
                <List>
                  {displayedMessages.map((message) => (
                    <React.Fragment key={message.id}>
                      <ListItem
                        style={{
                          display: "flex",
                          justifyContent:
                            message.from === user?.id
                              ? "flex-end"
                              : "flex-start",
                          marginBottom: 10,
                          width: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            minWidth: "120px",
                            maxWidth: "70%",
                            bgcolor:
                              message.from === user?.id
                                ? colors.blueAccent[500]
                                : colors.greenAccent[500],
                            color: theme.palette.getContrastText(
                              message.from === user?.id
                                ? colors.blueAccent[500]
                                : colors.greenAccent[500]
                            ),
                            borderRadius:
                              message.from === user?.id
                                ? "18px 18px 0 18px"
                                : "18px 18px 18px 0",
                            p: 2,
                            display: "flex",
                            flexDirection: "column",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            position: "relative",
                          }}
                        >
                          {message.from !== user?.id && (
                            <IconButton
                              size="small"
                              onClick={() => handleReply(message)}
                              sx={{
                                position: "absolute",
                                right: -40,
                                top: "50%",
                                transform: "translateY(-50%)",
                                backgroundColor: colors.primary[400],
                                "&:hover": {
                                  backgroundColor: colors.primary[300],
                                },
                              }}
                            >
                              <ReplyIcon fontSize="small" />
                            </IconButton>
                          )}
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: "bold",
                              mb: 0.5,
                              fontSize: "1.2rem",
                            }}
                          >
                            {message.subject}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {message.content}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ alignSelf: "flex-end", opacity: 0.7 }}
                          >
                            {new Date(message.timestamp).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </Typography>
                        </Box>
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            ) : (
              <Box
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  backgroundColor: "background.paper",
                  borderRadius: 2,
                  padding: 2,
                  mb: 2,
                }}
              >
                <List>
                  {displayedMessages.map((message) => (
                    <Paper
                      key={message.id}
                      elevation={2}
                      sx={{
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: theme.palette.background.default,
                        position: "relative",
                      }}
                    >
                      {activeView === "inbox" && (
                        <IconButton
                          size="small"
                          onClick={() => handleReply(message)}
                          sx={{
                            position: "absolute",
                            right: 16,
                            top: 16,
                            backgroundColor: colors.primary[400],
                            "&:hover": { backgroundColor: colors.primary[300] },
                          }}
                        >
                          <ReplyIcon fontSize="small" />
                        </IconButton>
                      )}
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "normal",
                          }}
                        >
                          <Box component="span" fontWeight="bold">
                            {activeView === "inbox" ? "From: " : "To: "}
                          </Box>{" "}
                          <Box component="span" fontWeight="normal">
                            {getUserFullName(
                              activeView === "inbox"
                                ? message.from ?? "Unknown"
                                : message.to ?? "Unknown"
                            )}
                          </Box>
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          {new Date(message.timestamp).toLocaleString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </Typography>
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{ mb: 1, whiteSpace: "normal" }}
                      >
                        <Box component="span" fontWeight="bold">
                          Subject:
                        </Box>{" "}
                        <Box component="span" fontWeight="normal">
                          {message.subject || "No Subject"}
                        </Box>
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          wordBreak: "break-word",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {message.content}
                      </Typography>
                    </Paper>
                  ))}
                </List>
              </Box>
            )
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: colors.grey[300],
              }}
            >
              <Typography variant="h6">
                Select a conversation to view messages
              </Typography>
            </Box>
          )}
        </div>
      </div>

      <Modal open={composeOpen} onClose={() => setComposeOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            maxHeight: "80vh",
            bgcolor: theme.palette.background.default,
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" mb={2}>
            New Message
          </Typography>
          <ClickAwayListener
            onClickAway={() => !selectedUsers.length && setSearchQuery("")}
          >
            <Box position="relative" mb={2}>
              <TextField
                fullWidth
                label="Search Users"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                sx={{ mb: 2 }}
              />
              {selectedUsers.length > 0 && (
                <Box
                  sx={{
                    mb: 2,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  {selectedUsers.map((selected) => (
                    <Box
                      key={selected.id}
                      sx={{
                        backgroundColor: colors.primary[400],
                        borderRadius: 1,
                        padding: "4px 8px",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Typography variant="body2">{selected.email}</Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          setSelectedUsers((prev) =>
                            prev.filter((user) => user.id !== selected.id)
                          )
                        }
                        sx={{ p: 0.5 }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
              {searchQuery && (
                <Paper
                  sx={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    maxHeight: "200px",
                    overflowY: "auto",
                    zIndex: 1300,
                    mt: 1,
                    backgroundColor: colors.primary[400],
                  }}
                >
                  <List>
                    {filteredUsers.length > 0 ? (
                      filteredUsers
                        .filter(
                          (u) =>
                            !selectedUsers.some(
                              (selected) => selected.id === u._id
                            )
                        )
                        .map((u) => (
                          <ListItem
                            key={u._id}
                            sx={{
                              cursor: "pointer",
                              "&:hover": {
                                bgcolor: colors.primary[500],
                              },
                            }}
                            onClick={() => {
                              setSelectedUsers((prev) => [
                                ...prev,
                                { id: u._id, email: u.email },
                              ]);
                              setSearchQuery("");
                            }}
                          >
                            <Box
                              display="flex"
                              flexDirection="column"
                              width="100%"
                            >
                              <Typography>
                                {u.name} {u.surname}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
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
          <TextField
            fullWidth
            label="Subject"
            value={composeSubject}
            onChange={(e) => setComposeSubject(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Message"
            multiline
            minRows={4}
            value={composeContent}
            onChange={(e) => setComposeContent(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<SendIcon />}
            fullWidth
            disabled={
              selectedUsers.length === 0 || !composeSubject || !composeContent
            }
            onClick={async () => {
              try {
                const sendPromises = selectedUsers.map((recipient) =>
                  fetch("http://127.0.0.1:5000/chad/send", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                      to_user: recipient.id,
                      subject: composeSubject,
                      content: composeContent,
                    }),
                  })
                );

                const results = await Promise.all(sendPromises);
                if (results.some((res) => !res.ok)) {
                  throw new Error("Failed to send some messages");
                }

                await fetchMessages();
                setSelectedUsers([]);
                setComposeSubject("");
                setComposeContent("");
                setSearchQuery("");
                setComposeOpen(false);
              } catch (error) {
                console.error(error);
                alert("Failed to send message. Try again.");
              }
            }}
          >
            Send
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default ChatPage;
