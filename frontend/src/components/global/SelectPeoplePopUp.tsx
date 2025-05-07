// src/global/SelectPeoplePopUp.tsx

import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import SelectPeopleItem, { Person } from "./SelectPeopleItem";
import { UserData } from "../../models/user";

interface Props {
  buttonText: string;
  people?: UserData[];
  onClose: () => void;
  onSelect?: (selectedUserIds: string[]) => void;
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
    maxHeight: "80vh", // Add maximum height
    display: "flex",
    flexDirection: "column" as const,
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
  contentContainer: {
    overflowY: "auto" as const,
    flex: 1,
    marginRight: "-0.5rem", // Compensate for padding
    paddingRight: "0.5rem", // Add padding for scrollbar
  },
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

  // Map UserData -> Person for rendering and selection
  const mapUserToPerson = (user: UserData, index: number): Person => ({
    id: index,
    name: `${user.name || ""} ${user.surname || ""}`.trim(),
    email: user.email || "",
    userId: user._id?.toString() ?? "",
  });

  // Initialize filtered list whenever the people prop changes
  useEffect(() => {
    setFilteredPeople(people.map(mapUserToPerson));
  }, [people]);

  // Filter by name or email on search input
  useEffect(() => {
    if (!search.trim()) {
      setFilteredPeople(people.map(mapUserToPerson));
      return;
    }
    const lower = search.toLowerCase();
    const filtered = people
      .filter(
        (u) =>
          `${u.name || ""} ${u.surname || ""}`.toLowerCase().includes(lower) ||
          (u.email?.toLowerCase().includes(lower) ?? false)
      )
      .map(mapUserToPerson);
    setFilteredPeople(filtered);
  }, [search, people]);

  const toggle = (id: number) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleSelection = () => {
    const selectedIds = selected
      .map((idx) => filteredPeople.find((p) => p.id === idx)?.userId)
      .filter((id): id is string => Boolean(id));
    onSelect(selectedIds);
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

        <div style={styles.contentContainer}>
          <SelectPeopleItem
            people={filteredPeople}
            selectedIds={selected}
            onToggle={toggle}
          />
        </div>

        <button style={styles.action} onClick={handleSelection}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default SelectPeoplePopup;
