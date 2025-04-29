import React from "react";
import { FaUser, FaRegSquare, FaCheckSquare } from "react-icons/fa";

export interface Person {
  id: number;        // Changed from _id to id to match what's created in SelectPeoplePopUp
  name: string;
  email?: string;    // Added email field
  userId?: string;   // Added userId field to store the actual user ID
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
  item: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.5rem 1rem",
    margin: "0.5rem 0",
    borderRadius: "20px",
    border: "2px solid #fff",
    color: "#fff",
    cursor: "pointer",
    background: "#1f2a32",
  } as React.CSSProperties,
  selected: {
    border: "2px solid #00aaff",
    color: "#00aaff",
  } as React.CSSProperties,
  left: {
    display: "flex",
    alignItems: "center",
  } as React.CSSProperties,
  icon: {
    marginRight: "0.5rem",
  } as React.CSSProperties,
};

const SelectPeopleItem: React.FC<SelectPeopleItemProps> = ({
  people,
  selectedIds,
  onToggle,
}) => (
  <div style={styles.container}>
    {people.map((person) => {
      const isSelected = selectedIds.includes(person.id); // Changed from _id to id
      return (
        <div
          key={person.id} // Changed from _id to id
          style={{
            ...styles.item,
            ...(isSelected ? styles.selected : {}),
          }}
          onClick={() => onToggle(person.id)} // Changed from _id to id
        >
          <div style={styles.left}>
            <FaUser style={styles.icon} />
            <span>{person.name}</span>
          </div>
          {isSelected ? <FaCheckSquare /> : <FaRegSquare />}
        </div>
      );
    })}
  </div>
);

export default SelectPeopleItem;
