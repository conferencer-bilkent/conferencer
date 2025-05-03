import React, { useEffect } from "react";
import { SectionTitle } from "../../global/AppTitle";
import { tokens } from "../../../theme";
import { useNotifications } from "../../../context/NotificationsContext";

const colors = tokens("dark");

const NotificationsPage: React.FC = () => {
  const { notifications, setNotifications, fetchNotifications } =
    useNotifications();

  useEffect(() => {
    const markNotificationsAsRead = async () => {
      try {
        await fetch("http://127.0.0.1:5000/notification/mark_read", {
          method: "POST",
          credentials: "include",
        });
        setNotifications((prev) =>
          prev.map((notification) => ({ ...notification, is_read: true }))
        );
      } catch (error) {
        console.error("Error marking notifications as read:", error);
      }
    };

    fetchNotifications();
    markNotificationsAsRead();
  }, []);

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
    <div style={styles.notificationsContainer}>
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
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  notificationsContainer: {
    display: "flex",
    height: "100%",
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
