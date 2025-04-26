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
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Send as SendIcon,
  Edit as EditIcon,
  Inbox as InboxIcon,
  Send as SentIcon,
  Forum as ChatIcon,
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

interface Conversation {
  contact: string;
  subject: string;
  messages: Message[];
  lastTimestamp: string;
}

const ChatPage: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const menuItems = getMenuItemsForPage("default");
  const navigate = useNavigate();
  const { user } = useUser();

  const [activeView, setActiveView] = useState<"inbox" | "sent" | "chats">(
    "inbox"
  );
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inboxMessages, setInboxMessages] = useState<Message[]>([]);
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const [composeOpen, setComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeContent, setComposeContent] = useState("");
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [toastOpen, setToastOpen] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const [inboxResponse, sentResponse] = await Promise.all([
        fetch("http://127.0.0.1:5000/chad/inbox", { credentials: "include" }),
        fetch("http://127.0.0.1:5000/chad/outbox", { credentials: "include" }),
      ]);

      if (!inboxResponse.ok) throw new Error("Failed to fetch inbox");
      if (!sentResponse.ok) throw new Error("Failed to fetch sent messages");

      const inboxData = await inboxResponse.json();
      const sentData = await sentResponse.json();

      setInboxMessages(inboxData.received_chads || []);
      setSentMessages(sentData.sent_chads || []);

      // Process conversations
      const allMessages = [...inboxData.received_chads, ...sentData.sent_chads];
      const conversationMap = new Map<string, Conversation>();

      allMessages.forEach((msg) => {
        const otherUser = msg.from === user?.id ? msg.to : msg.from;
        const key = `${otherUser}|${msg.subject}`;

        if (!conversationMap.has(key)) {
          conversationMap.set(key, {
            contact: otherUser || "Unknown",
            subject: msg.subject,
            messages: [msg],
            lastTimestamp: msg.timestamp,
          });
        } else {
          const conversation = conversationMap.get(key)!;
          conversation.messages.push(msg);
          if (new Date(msg.timestamp) > new Date(conversation.lastTimestamp)) {
            conversation.lastTimestamp = msg.timestamp;
          }
        }
      });

      setConversations(
        Array.from(conversationMap.values()).sort(
          (a, b) =>
            new Date(b.lastTimestamp).getTime() -
            new Date(a.lastTimestamp).getTime()
        )
      );

      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch messages");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const getCurrentMessages = () => {
    if (activeView === "inbox") return inboxMessages;
    if (activeView === "sent") return sentMessages;
    return [];
  };

  const handleItemClick = (item: string) => {
    handleMenuItemClick(item, navigate);
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

  const getConversationMessages = (): Message[] => {
    if (!selectedContact || !selectedSubject) return [];
    return [...inboxMessages, ...sentMessages]
      .filter((msg) => {
        const isParticipant =
          msg.from === selectedContact || msg.to === selectedContact;
        return isParticipant && msg.subject === selectedSubject;
      })
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
  };

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
      <TopBar />

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
          <Paper
            style={{
              width: "300px",
              borderRight: `1px solid ${colors.grey[700]}`,
              display: "flex",
              flexDirection: "column",
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
                backgroundColor: colors.blueAccent[700],
              }}
              onClick={() => {
                setComposeOpen(true);
                setReplyToMessage(null);
                setComposeTo("");
                setComposeSubject("");
                setComposeContent("");
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
                startIcon={<ChatIcon />}
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
                {activeView === "chats" ? "Conversations" : "Messages"}
              </Typography>
              <List>
                {activeView === "chats"
                  ? conversations.map((convo) => (
                      <ListItem
                        key={`${convo.contact}-${convo.subject}`}
                        style={contactItemStyle(
                          selectedContact === convo.contact &&
                            selectedSubject === convo.subject
                        )}
                        onClick={() => {
                          setSelectedContact(convo.contact);
                          setSelectedSubject(convo.subject);
                        }}
                      >
                        <Avatar
                          sx={{ bgcolor: colors.greenAccent[500], mr: 2 }}
                        >
                          {convo.contact.substring(0, 2).toUpperCase()}
                        </Avatar>
                        <ListItemText
                          primary={convo.contact}
                          secondary={convo.subject}
                          secondaryTypographyProps={{ noWrap: true }}
                        />
                      </ListItem>
                    ))
                  : getCurrentMessages().map((msg) => (
                      <ListItem
                        key={msg.id}
                        style={contactItemStyle(
                          selectedContact ===
                            (activeView === "inbox" ? msg.from : msg.to)
                        )}
                        onClick={() => {
                          setSelectedContact(
                            activeView === "inbox"
                              ? msg.from || null
                              : msg.to || null
                          );
                          setSelectedSubject(msg.subject);
                        }}
                      >
                        <Avatar
                          sx={{ bgcolor: colors.greenAccent[500], mr: 2 }}
                        >
                          {(activeView === "inbox" ? msg.from : msg.to)
                            ?.substring(0, 2)
                            .toUpperCase()}
                        </Avatar>
                        <ListItemText
                          primary={activeView === "inbox" ? msg.from : msg.to}
                          secondary={msg.subject}
                          secondaryTypographyProps={{ noWrap: true }}
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
              <AppTitle
                text={
                  selectedContact && selectedSubject
                    ? `${selectedContact} - ${selectedSubject}`
                    : activeView === "chats"
                    ? "Select a conversation"
                    : "Select a message"
                }
              />
            </div>

            {selectedContact && selectedSubject ? (
              <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                <List>
                  {(activeView === "chats"
                    ? getConversationMessages()
                    : getCurrentMessages().filter(
                        (msg) =>
                          (activeView === "inbox"
                            ? msg.from === selectedContact
                            : msg.to === selectedContact) &&
                          msg.subject === selectedSubject
                      )
                  ).map((message) => (
                    <React.Fragment key={message.id}>
                      <ListItem
                        style={{
                          display: "flex",
                          justifyContent:
                            message.from === user?.id
                              ? "flex-end"
                              : "flex-start",
                          marginBottom: "10px",
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
                                ? "18px 18px 0 18px"
                                : "18px 18px 18px 0",
                            p: 2,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {message.content}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="caption" sx={{ opacity: 0.7 }}>
                              {new Date(message.timestamp).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </Typography>
                            <Button
                              variant="text"
                              size="small"
                              sx={{
                                ml: 2,
                                textTransform: "none",
                                minWidth: 0,
                                p: 0,
                              }}
                              onClick={() => {
                                setReplyToMessage(message);
                                setComposeTo(
                                  message.from === user?.id
                                    ? message.to || ""
                                    : message.from || ""
                                );
                                setComposeSubject(message.subject);
                                setComposeContent("");
                                setComposeOpen(true);
                              }}
                            >
                              Reply
                            </Button>
                          </Box>
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
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  {activeView === "chats"
                    ? "Select a conversation to start"
                    : "Select a message to view"}
                </Typography>
              </Box>
            )}
          </div>
        </div>
      </div>

      {/* Compose Modal and Snackbar remain the same as original */}
      {/* ... rest of the modal and snackbar code ... */}
    </div>
  );
};

export default ChatPage;
