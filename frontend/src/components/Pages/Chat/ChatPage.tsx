import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import AppTitle from "../../global/AppTitle";
import SideMenu from "../../global/SideMenu";
import TopBar from "../../global/TopBar";
import { getMenuItemsForPage } from "../../global/sideMenuConfig";
import { tokens } from "../../../theme";
import { useNavigate } from "react-router-dom";
import { handleMenuItemClick } from "../../../utils/navigation/menuNavigation";
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
} from "@mui/material";
import {
  Send as SendIcon,
  Edit as EditIcon,
  Inbox as InboxIcon,
  Send as SentIcon,
  Search as SearchIcon,
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

const ChatPage: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const menuItems = getMenuItemsForPage("default");
  const navigate = useNavigate();
  const { user } = useUser();

  const [activeView, setActiveView] = useState<"inbox" | "sent">("inbox");
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inboxMessages, setInboxMessages] = useState<Message[]>([]);
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);

  const [composeOpen, setComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeContent, setComposeContent] = useState("");

  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null); // NEW STATE

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

  useEffect(() => {
    fetchMessages();
  }, []);
  useEffect(() => {
    setCurrentMessages(activeView === "inbox" ? inboxMessages : sentMessages);
  }, [activeView, inboxMessages, sentMessages]);

  const handleItemClick = (item: string) => {
    handleMenuItemClick(item, navigate);
  };
  const handleViewChange = (view: "inbox" | "sent") => {
    setActiveView(view);
  };
  const handleContactSelect = (contactId: string) => {
    setSelectedContact(contactId);
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

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* TopBar */}
      <TopBar />

      {/* SideMenu + Content */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <SideMenu items={menuItems} onItemClick={handleItemClick} />

        <div
          style={{
            flex: 1,
            display: "flex",
            overflow: "hidden",
            padding: "16px",
          }}
        >
          {/* Left Panel */}
          <Paper
            style={{
              width: "300px",
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
                margin: "16px",
                padding: "12px",
                textTransform: "none",
                borderRadius: "24px",
                boxShadow: "none",
                backgroundColor: colors.blueAccent[700],
              }}
              onClick={() => {
                setComposeOpen(true);
                setReplyToMessage(null); // NEW: normal compose resets reply
              }}
            >
              New Message
            </Button>

            <Box>
              <Button
                fullWidth
                startIcon={<InboxIcon />}
                style={navButtonStyle(activeView === "inbox")}
                onClick={() => handleViewChange("inbox")}
              >
                Inbox
              </Button>
              <Button
                fullWidth
                startIcon={<SentIcon />}
                style={navButtonStyle(activeView === "sent")}
                onClick={() => handleViewChange("sent")}
              >
                Sent
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
                Recent Conversations
              </Typography>
              <List>
                {Array.from(
                  new Map(
                    currentMessages.map((msg) => {
                      const contactId =
                        activeView === "inbox" ? msg.from : msg.to;
                      return [
                        contactId,
                        {
                          id: contactId,
                          name: contactId ?? "Unknown",
                          subject: msg.subject,
                        },
                      ];
                    })
                  ).values()
                ).map((contact) => (
                  <ListItem
                    key={contact.id}
                    style={contactItemStyle(selectedContact === contact.id)}
                    onClick={() => handleContactSelect(contact.id ?? "Unknown")}
                  >
                    <Avatar sx={{ bgcolor: colors.greenAccent[500], mr: 2 }}>
                      {contact.name.substring(0, 2).toUpperCase()}
                    </Avatar>
                    <ListItemText
                      primary={contact.name}
                      secondary={contact.subject}
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

          {/* Chat Content */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "20px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <AppTitle text={selectedContact || "Select a conversation"} />
              {selectedContact && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<SendIcon />}
                  onClick={() => {
                    const firstMessage = currentMessages.find(
                      (msg) =>
                        (activeView === "inbox" ? msg.from : msg.to) ===
                        selectedContact
                    );
                    if (firstMessage) {
                      setReplyToMessage(firstMessage);
                      setComposeTo(firstMessage.from || "");
                      setComposeSubject("Re: " + firstMessage.subject);
                      setComposeContent("");
                      setComposeOpen(true);
                    }
                  }}
                  style={{ marginLeft: "16px" }}
                >
                  Reply
                </Button>
              )}
            </div>

            {selectedContact ? (
              <Box
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  backgroundColor: "transparent",
                  borderRadius: "8px",
                  padding: "15px",
                  marginBottom: "20px",
                }}
              >
                <List>
                  {currentMessages
                    .filter(
                      (msg) =>
                        (activeView === "inbox" ? msg.from : msg.to) ===
                        selectedContact
                    )
                    .map((message) => (
                      <React.Fragment key={message.id}>
                        <ListItem
                          style={{
                            display: "flex",
                            justifyContent:
                              message.from === user?.id
                                ? "flex-start"
                                : "flex-end",
                            marginBottom: "10px",
                            width: "100%",
                          }}
                        >
                          <Box
                            sx={{
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
                                  ? "18px 18px 18px 0"
                                  : "18px 18px 0 18px",
                              p: 2,
                              display: "flex",
                              flexDirection: "column",
                              overflowWrap: "break-word",
                              wordBreak: "break-word",
                              whiteSpace: "pre-wrap",
                            }}
                          >
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
                                { hour: "2-digit", minute: "2-digit" }
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
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: colors.grey[300],
                }}
              >
                <Typography variant="h6">
                  Select a conversation to start chatting
                </Typography>
              </Box>
            )}
          </div>
        </div>
      </div>

      {/* Compose Modal */}
      <Modal open={composeOpen} onClose={() => setComposeOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" textAlign="center">
            {replyToMessage ? "Reply to Message" : "New Message"}
          </Typography>

          <TextField
            label="To (User ID)"
            value={composeTo}
            onChange={(e) => setComposeTo(e.target.value)}
            fullWidth
            size="small"
            disabled={!!replyToMessage}
          />
          <TextField
            label="Subject"
            value={composeSubject}
            onChange={(e) => setComposeSubject(e.target.value)}
            fullWidth
            size="small"
            disabled={!!replyToMessage}
          />
          <TextField
            label="Content"
            value={composeContent}
            onChange={(e) => setComposeContent(e.target.value)}
            multiline
            maxRows={10}
            minRows={4}
            fullWidth
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                setComposeOpen(false);
                setComposeTo("");
                setComposeSubject("");
                setComposeContent("");
                setReplyToMessage(null);
              }}
            >
              Discard
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={async () => {
                if (
                  !composeTo.trim() ||
                  !composeSubject.trim() ||
                  !composeContent.trim()
                )
                  return;
                try {
                  await fetch("http://127.0.0.1:5000/chad/send", {
                    credentials: "include",
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      to_user: composeTo,
                      subject: composeSubject,
                      content: composeContent,
                    }),
                  });
                  await fetchMessages();
                  setComposeOpen(false);
                  setComposeTo("");
                  setComposeSubject("");
                  setComposeContent("");
                  setReplyToMessage(null);
                } catch (err) {
                  console.error("Error sending composed message:", err);
                }
              }}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ChatPage;
