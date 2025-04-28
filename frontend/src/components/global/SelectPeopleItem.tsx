import React from "react";
import { FaUser, FaRegSquare, FaCheckSquare } from "react-icons/fa";

export interface Person {
  _id: number;
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
      console.log("person", person);
      const isSelected = selectedIds.includes(person._id);
      return (
        <div
          key={person._id}
          style={{
            ...styles.item,
            ...(isSelected ? styles.selected : {}),
          }}
          onClick={() => onToggle(person._id)}
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
