import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../global/TopBar";
import SideMenu from "../../global/SideMenu";
import AppTitle, { SectionTitle } from "../../global/AppTitle";
import { getMenuItemsForPage } from "../../global/sideMenuConfig";
import { handleMenuItemClick } from "../../../utils/navigation/menuNavigation";
import { tokens } from "../../../theme";

interface Notification {
  id: string;
  title: string;
  content: string;
  is_interactive: boolean;
  is_answered: boolean;
  created_at: string;
  is_accepted: boolean;
}

const colors = tokens("dark");

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const menuItems = getMenuItemsForPage("default");

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/notification", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications);
        } else {
          console.error("Failed to fetch notifications");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleItemClick = (item: string) => {
    if (item === "LOG OUT") {
      handleLogout();
    } else {
      handleMenuItemClick(item, navigate);
    }
  };

  const handleResponse = async (id: string, isAccepted: boolean) => {
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

  const handleAccept = (id: string) => {
    handleResponse(id, true);
  };

  const handleReject = (id: string) => {
    handleResponse(id, false);
  };

  return (
    <>
      <Topbar />
      <div style={styles.notificationsContainer}>
        <SideMenu items={menuItems} onItemClick={handleItemClick} />

        <div style={styles.contentContainer}>
          <SectionTitle text="Notifications connect with topbar notifi" />

          <div style={styles.section}>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                style={{
                  ...styles.notificationCard,
                  backgroundColor: notification.is_answered
                    ? notification.is_accepted
                      ? colors.greenAccent[500]
                      : colors.redAccent[500]
                    : "#f9f9f9",
                }}
              >
                <h3>{notification.title}</h3>
                <p>{notification.content}</p>
                <small>
                  {new Date(notification.created_at).toLocaleString()}
                </small>
                {notification.is_interactive && !notification.is_answered && (
                  <div style={styles.buttonContainer}>
                    <button
                      style={styles.button}
                      onClick={() => handleAccept(notification.id)}
                    >
                      Accept
                    </button>
                    <button
                      style={styles.button}
                      onClick={() => handleReject(notification.id)}
                    >
                      Reject
                    </button>
                  </div>
                )}
                {notification.is_answered && (
                  <p>
                    <em>
                      Response:{" "}
                      {notification.is_accepted ? "Accepted" : "Rejected"}
                    </em>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  notificationsContainer: {
    display: "flex",
    height: "100vh",
    alignItems: "start",
  },
  contentContainer: {
    flex: 1,
    position: "relative",
    width: "70vw",
    display: "flex",
    paddingLeft: "30px",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
  section: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  notificationCard: {
    width: "80%",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "16px",
    backgroundColor: "#f9f9f9",
  },
  buttonContainer: {
    marginTop: "10px",
    display: "flex",
    gap: "10px",
  },
  button: {
    padding: "8px 16px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
  },
};

export default NotificationsPage;
