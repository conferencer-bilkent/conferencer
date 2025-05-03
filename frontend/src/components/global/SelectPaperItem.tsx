import React, { useState } from "react";
import { FaBook, FaRegSquare, FaCheckSquare } from "react-icons/fa";

export interface Paper {
  id: number;
  title: string;
  authors: string; // This will now receive JSON string of authors
  abstract?: string;
  keywords?: string[];
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
    maxWidth: "100%",
    overflow: "hidden",
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
    flex: 1,
    wordBreak: "break-word",
    minWidth: 0, // This helps with flexbox text wrapping
    width: "100%", // Added to ensure full width
  } as React.CSSProperties,
  title: {
    fontWeight: "bold",
    wordWrap: "break-word",
    display: "-webkit-box",
    WebkitLineClamp: 2, // Show max 2 lines
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    marginBottom: "0.5rem", // Added spacing
  } as React.CSSProperties,
  authors: {
    fontSize: "0.85rem",
    opacity: 0.8,
    wordWrap: "break-word",
    display: "-webkit-box",
    WebkitLineClamp: 3, // Show max 3 lines
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    marginBottom: "0.5rem",
  } as React.CSSProperties,
};

const SelectPaperItem: React.FC<SelectPaperItemProps> = ({
  papers,
  selectedIds,
  onToggle,
}) => {
  const formatAuthors = (authors: string) => {
    try {
      const authorArray = JSON.parse(authors);
      return authorArray
        .map((author: any) => `${author.lastname}, ${author.firstname}`)
        .join("; ");
    } catch {
      return authors; // Fallback to original string if parsing fails
    }
  };

  return (
    <>
      {papers.map((paper) => {
        const isSelected = selectedIds.includes(paper.id);
        return (
          <div
            key={paper.id}
            style={{ ...styles.item, ...(isSelected ? styles.selected : {}) }}
          >
            <div style={styles.left}>
              <FaBook style={styles.icon} />
              <div style={styles.details} onClick={() => onToggle(paper.id)}>
                <span style={styles.title}>{paper.title}</span>
                <span style={styles.authors}>
                  By {formatAuthors(paper.authors)}
                </span>
              </div>
            </div>
            <div onClick={() => onToggle(paper.id)}>
              {isSelected ? <FaCheckSquare /> : <FaRegSquare />}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default SelectPaperItem;
