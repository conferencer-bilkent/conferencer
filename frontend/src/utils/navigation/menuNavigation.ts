import { NavigateFunction } from "react-router-dom";

// Interface for handling additional custom item handlers
interface CustomItemHandlers {
  [key: string]: (navigate: NavigateFunction) => void;
}

/**
 * Central navigation handler for menu items
 * @param item The menu item that was clicked
 * @param navigate The navigate function from useNavigate hook
 * @param customHandlers Optional custom handlers for specific items
 */
export const handleMenuItemClick = (
  item: string,
  navigate: NavigateFunction,
  customHandlers?: CustomItemHandlers
) => {
  console.log("Clicked:", item);

  // Check for custom handlers first
  if (customHandlers && customHandlers[item]) {
    customHandlers[item](navigate);
    return;
  }

  // Default navigation handlers
  switch (item) {
    case "CONFERENCES":
      navigate("/home");
      break;
    case "MY SUBMISSIONS":
      navigate("/submissions");
      break;
    case "MY TASKS":
      navigate("/tasks");
      break;
    case "PROFILE":
      navigate("/profile");
      break;
    case "MY ROLES":
      navigate("/roles");
      break;
    case "NOTIFICATIONS":
      navigate("/notifications");
      break;
    case "CHATS":
      navigate("/chat");
      break;
    case "SETTINGS":
      navigate("/settings");
      break;
    case "LOG OUT":
      // This should be handled by the component since it requires API calls
      console.log("Log out should be handled by component");
      break;
    default:
      console.log("No navigation defined for:", item);
  }
};