import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import SelectPaperItem, { Paper } from "./SelectPaperItem";

interface Props {
  buttonText: string; // e.g. “Select Paper(s)”
  onClose: () => void;
}

// Demo data; replace with real fetch if needed
const EXAMPLE_PAPERS: Paper[] = [
  {
    id: 1,
    title: "Impact of Virtual Reality on Cognitive Learning",
    authors: "Jane Doe, Memduh Tutus",
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
  divider: {
    border: "none",
    borderBottom: "2px solid #fff",
    margin: "1rem 0",
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

const SelectPaperPopup: React.FC<Props> = ({ buttonText, onClose }) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);

  const toggle = (id: number) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );

  const filtered = EXAMPLE_PAPERS.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

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
            placeholder="Search papers..."
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
        <SelectPaperItem
          papers={filtered}
          selectedIds={selected}
          onToggle={toggle}
        />
        <button style={styles.action} onClick={onClose}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default SelectPaperPopup;
