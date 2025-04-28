import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import SelectPeopleItem, { Person } from "./SelectPeopleItem";
import SelectPaperItem, { Paper } from "./SelectPaperItem";

interface SelectPeoplePopupProps {
  buttonText: string; // e.g., "Invite People", "Assign Superchair(s)", etc.
  onClose: () => void; // callback to close the popup
}

// Example papers (demo)
const EXAMPLE_PAPERS: Paper[] = [
  {
    id: 1,
    title:
      "Impact of Virtual Reality on Cognitive Learning in Higher Education",
    authors: "Jane Doe, Memduh Tutus, Bilal Kar, et al.",
  },
  {
    id: 2,
    title: "AI-Powered Learning Tools: A Future Perspective",
    authors: "Alice Johnson, Bob Smith",
  },
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
  searchContainer: {
    display: "flex",
    alignItems: "center",
    border: "2px solid #00aaff",
    borderRadius: "20px",
    background: "#1f2a32",
    padding: "0.5rem 1rem",
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
  divider: {
    border: "none",
    borderBottom: "2px solid #fff",
    margin: "1rem 0",
  } as React.CSSProperties,
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
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);

  const isPaperMode = buttonText === "Select Paper(s)";

  const handleToggle = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Fetch people when popup opens (non-paper mode)
  const fetchPeople = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/profile/users", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Fetch failed");
      const data: Person[] = await res.json();
      setPeople(data);
    } catch (err) {
      console.error("Error fetching people:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isPaperMode) {
      fetchPeople();
    }
  }, [isPaperMode]);

  // Choose correct data list
  const dataList = isPaperMode ? EXAMPLE_PAPERS : people;

  // Filter based on search term
  const filteredItems = dataList.filter((item) =>
    (isPaperMode ? (item as Paper).title : (item as Person).name)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.popupContent} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>
          ✕
        </button>

        <div style={styles.searchContainer}>
          <FaSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder={isPaperMode ? "Search papers..." : "Search people..."}
            value={searchTerm}
            style={styles.searchInput}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <hr style={styles.divider} />

        {isPaperMode ? (
          <SelectPaperItem
            papers={filteredItems as Paper[]}
            selectedIds={selectedItems}
            onToggle={handleToggle}
          />
        ) : loading ? (
          <p style={{ color: "#fff" }}>Loading...</p>
        ) : (
          <SelectPeopleItem
            people={filteredItems as Person[]}
            selectedIds={selectedItems}
            onToggle={handleToggle}
          />
        )}

        <button style={styles.popupButton} onClick={onClose}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default SelectPeoplePopup;
