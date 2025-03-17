import React from "react";
import { FaUser, FaRegSquare, FaCheckSquare } from "react-icons/fa";

export interface Person {
  id: number;
  name: string;
}

interface SelectPeopleItemProps {
  people: Person[];
  selectedIds: number[];
  onToggle: (id: number) => void;
}

const styles = {
  container: {
    marginBottom: "1rem",
  },
  personItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.5rem 1rem",
    margin: "0.5rem 0",
    borderRadius: "20px",
    border: "2px solid #fff", // default border color (white)
    cursor: "pointer",
    // Default text/icon color (white):
    color: "#fff",
  } as React.CSSProperties,

  // Overrides when selected:
  selectedPersonItem: {
    border: "2px solid #00aaff", // blue border when selected
    color: "#00aaff",            // text/icon color when selected
  } as React.CSSProperties,

  // The user icon on the left
  leftIcon: {
    marginRight: "0.5rem",
  } as React.CSSProperties,
};

const SelectPeopleItem: React.FC<SelectPeopleItemProps> = ({
  people,
  selectedIds,
  onToggle,
}) => {
  // Handler specifically for the user icon
  const handleUserIconClick = (e: React.MouseEvent, name: string) => {
    e.stopPropagation(); // Prevent toggling the selection
    console.log("User Icon Clicked:", name);
  };

  return (
    <div style={styles.container}>
      {people.map((person) => {
        const isSelected = selectedIds.includes(person.id);

        // Merge default item style with selected style if needed
        const containerStyle = {
          ...styles.personItem,
          ...(isSelected ? styles.selectedPersonItem : {}),
        };

        // Checkbox icon to show on the right
        const checkboxIcon = isSelected ? <FaCheckSquare /> : <FaRegSquare />;

        return (
          <div
            key={person.id}
            style={containerStyle}
            onClick={() => onToggle(person.id)}
          >
            {/* Left side user icon + name */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <FaUser
                style={styles.leftIcon}
                onClick={(e) => handleUserIconClick(e, person.name)}
              />
              <span>{person.name}</span>
            </div>

            {/* Right side checkbox icon */}
            {checkboxIcon}
          </div>
        );
      })}
    </div>
  );
};

export default SelectPeopleItem;
