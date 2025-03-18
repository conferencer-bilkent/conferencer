import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import SelectPeopleItem, { Person } from "./SelectPeopleItem";

interface SelectPeoplePopupProps {
  buttonText: string; // e.g., "Invite People", "Assign Superchair(s)", etc.
  onClose: () => void; // callback to close the popup
}

// Five example people (just for demo)
const EXAMPLE_PEOPLE: Person[] = [
  { id: 1, name: "Alice Johnson" },
  { id: 2, name: "Bob Smith" },
  { id: 3, name: "Charlie Brown" },
  { id: 4, name: "Diana Prince" },
  { id: 5, name: "Evan Stone" },
];

const styles = {
  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  popupContent: {
    background: "#2b3c47",
    padding: "1rem 1.5rem",
    borderRadius: "8px",
    width: "300px",
    textAlign: "center" as const,
    position: "relative" as const,
  },
  closeButton: {
    position: "absolute" as const,
    top: "8px",
    right: "10px",
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "1.2rem",
    cursor: "pointer",
  },
  // --- Search Bar Styles ---
  searchContainer: {
    display: "flex",
    alignItems: "center",
    border: "2px solid #00aaff",   // Light blue border
    borderRadius: "20px",
    background: "#1f2a32",
    padding: "0.5rem 1rem",
    // No margin-bottom here, we separate with the line below
    color: "#fff",
  } as React.CSSProperties,
  searchIcon: {
    marginRight: "0.5rem",
    cursor: "pointer",
  },
  searchInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#fff",
    fontSize: "1rem",
  } as React.CSSProperties,
  // Horizontal divider under the search bar
  divider: {
    border: "none",
    borderBottom: "2px solid #fff",
    margin: "1rem 0",
  } as React.CSSProperties,
  // --- Button at the bottom ---
  popupButton: {
    padding: "0.75rem 1rem",
    border: "none",
    borderRadius: "4px",
    background: "#2cbbf7",
    color: "#fff",
    cursor: "pointer",
  } as React.CSSProperties,
};

const SelectPeoplePopup: React.FC<SelectPeoplePopupProps> = ({
  buttonText,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeople, setSelectedPeople] = useState<number[]>([]);

  const handleToggle = (id: number) => {
    setSelectedPeople((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Filter by search term
  const filteredPeople = EXAMPLE_PEOPLE.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Click handler for the search icon
  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Search icon clicked, ignoring typed text for now.");
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.popupContent} onClick={(e) => e.stopPropagation()}>
        {/* Close button in the top-right corner */}
        <button style={styles.closeButton} onClick={onClose}>
          ✕
        </button>

        {/* Custom search bar with left icon and input to the right */}
        <div style={styles.searchContainer}>
          <FaSearch style={styles.searchIcon} onClick={handleIconClick} />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            style={styles.searchInput}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 2px white line to separate from the rest */}
        <hr style={styles.divider} />

        {/* Child component that shows the filtered example people */}
        <SelectPeopleItem
          people={filteredPeople}
          selectedIds={selectedPeople}
          onToggle={handleToggle}
        />

        <button style={styles.popupButton} onClick={onClose}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default SelectPeoplePopup;
