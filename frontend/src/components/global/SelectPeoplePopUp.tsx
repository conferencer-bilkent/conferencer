import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import SelectPeopleItem, { Person } from "./SelectPeopleItem";
import { UserData } from "../../models/user";

interface Props {
  buttonText: string;
  people?: UserData[];
  onClose: () => void;
  onSelect?: (selectedUserIds: string[]) => void; // New callback prop
}

const styles = {
  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  popup: {
    background: "#2b3c47",
    padding: "1rem 1.5rem",
    borderRadius: "8px",
    width: "300px",
    position: "relative" as const,
  },
  close: {
    position: "absolute" as const,
    top: 8,
    right: 10,
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "1.2rem",
    cursor: "pointer",
  },
  search: {
    display: "flex",
    alignItems: "center",
    border: "2px solid #00aaff",
    borderRadius: "20px",
    background: "#1f2a32",
    padding: "0.5rem 1rem",
    color: "#fff",
    marginBottom: "1rem",
  } as React.CSSProperties,
  action: {
    marginTop: "1rem",
    padding: "0.75rem 1rem",
    border: "none",
    borderRadius: "4px",
    background: "#2cbbf7",
    color: "#fff",
    width: "100%",
    cursor: "pointer",
  } as React.CSSProperties,
};

const SelectPeoplePopup: React.FC<Props> = ({
  buttonText,
  people = [],
  onClose,
  onSelect = () => {},
}) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);

  // Map users to a person structure that works with our component
  const mapUserToPerson = (user: UserData, index: number): Person => ({
    id: index,
    name: `${user.name || ""} ${user.surname || ""}`.trim(),
    email: user.email || "",
    userId: user.id || "", // Use _id as the actual user identifier
  });

  // Convert UserData[] to Person[] for the component - initial setup
  useEffect(() => {
    const mappedPeople = people.map(mapUserToPerson);
    setFilteredPeople(mappedPeople);
  }, [people]);

  // Filter people based on search input
  useEffect(() => {
    if (!search.trim()) {
      // If search is empty, show all people
      const mappedPeople = people.map(mapUserToPerson);
      setFilteredPeople(mappedPeople);
      return;
    }

    // Filter based on search
    const searchLower = search.toLowerCase();
    const filtered = people
      .filter(
        (user) =>
          `${user.name || ""} ${user.surname || ""}`
            .toLowerCase()
            .includes(searchLower) ||
          (user.email && user.email.toLowerCase().includes(searchLower))
      )
      .map(mapUserToPerson);

    setFilteredPeople(filtered);
  }, [search, people]);

  const toggle = (id: number) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );

  // Handle the final selection when the button is clicked
  const handleSelection = () => {
    console.log("Selected IDs:", selected); // Debugging line
    // Map selected indices back to actual user IDs
    const selectedUserIds = selected
      .map((index) => {
        const person = filteredPeople.find((p) => p.id === index);
        return person?.userId || "";
      })
      .filter((id) => id); // Filter out any empty strings
    console.log("Selected User IDs:", selectedUserIds); // Debugging line
    // Pass selected user IDs to parent component
    onSelect(selectedUserIds);
    onClose();
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.popup} onClick={(e) => e.stopPropagation()}>
        <button style={styles.close} onClick={onClose}>
          ✕
        </button>
        <div style={styles.search}>
          <FaSearch style={{ marginRight: 8 }} />
          <input
            type="text"
            placeholder="Search people..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
            }}
          />
        </div>

        <SelectPeopleItem
          people={filteredPeople}
          selectedIds={selected}
          onToggle={toggle}
        />

        <button style={styles.action} onClick={handleSelection}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default SelectPeoplePopup;
