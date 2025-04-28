import React from "react";
import { FaBook, FaRegSquare, FaCheckSquare } from "react-icons/fa";

export interface Paper {
  id: number;
  title: string;
  authors: string;
}

interface SelectPaperItemProps {
  papers: Paper[];
  selectedIds: number[];
  onToggle: (id: number) => void;
}

const styles = {
  item: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.75rem",
    margin: "0.5rem 0",
    borderRadius: "12px",
    border: "2px solid #2cbbf7",
    background: "#1f2a32",
    color: "#fff",
    cursor: "pointer",
  } as React.CSSProperties,
  selected: {
    background: "#2cbbf7",
    color: "#000",
  } as React.CSSProperties,
  left: {
    display: "flex",
    alignItems: "center",
    flex: 1,
  } as React.CSSProperties,
  icon: {
    marginRight: "0.75rem",
    fontSize: "1.2rem",
  } as React.CSSProperties,
  details: {
    display: "flex",
    flexDirection: "column",
  } as React.CSSProperties,
  title: {
    fontWeight: "bold",
  } as React.CSSProperties,
  authors: {
    fontSize: "0.85rem",
    opacity: 0.8,
  } as React.CSSProperties,
  seeMore: {
    fontSize: "0.85rem",
    color: "#4aa8f7",
    textDecoration: "underline",
    cursor: "pointer",
  } as React.CSSProperties,
};

const SelectPaperItem: React.FC<SelectPaperItemProps> = ({
  papers,
  selectedIds,
  onToggle,
}) => (
  <>
    {papers.map((paper) => {
      const isSelected = selectedIds.includes(paper.id);
      return (
        <div
          key={paper.id}
          style={{ ...styles.item, ...(isSelected ? styles.selected : {}) }}
          onClick={() => onToggle(paper.id)}
        >
          <div style={styles.left}>
            <FaBook style={styles.icon} />
            <div style={styles.details}>
              <span style={styles.title}>{paper.title}</span>
              <span style={styles.authors}>By {paper.authors}</span>
              <span style={styles.seeMore}>See more</span>
            </div>
          </div>
          {isSelected ? <FaCheckSquare /> : <FaRegSquare />}
        </div>
      );
    })}
  </>
);

export default SelectPaperItem;
