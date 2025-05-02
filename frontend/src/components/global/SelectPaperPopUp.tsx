import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import SelectPaperItem, { Paper } from "./SelectPaperItem";
import SelectPeopleItem from "./SelectPeopleItem";
import { UserData } from "../../models/user";

interface Props {
  buttonText: string;
  trackId: string;
  onClose: () => void;
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
  stepIndicator: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "1rem",
  },
  step: {
    padding: "0.5rem",
    color: "#fff",
    opacity: 0.5,
  },
  activeStep: {
    opacity: 1,
    borderBottom: "2px solid #00aaff",
  },
};

const SelectPaperPopup: React.FC<Props> = ({
  buttonText,
  trackId,
  onClose,
}) => {
  const [step, setStep] = useState<"papers" | "reviewers">("papers");
  const [search, setSearch] = useState("");
  const [papers, setPapers] = useState<Paper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [reviewers, setReviewers] = useState<UserData[]>([]);
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>([]);

  useEffect(() => {
    // Fetch papers for this track
    const fetchPapers = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/track/${trackId}/papers`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        setPapers(
          data.papers.map((p: any) => ({
            id: p._id,
            title: p.title,
            authors: p.authors.join(", "),
          }))
        );
      } catch (error) {
        console.error("Error fetching papers:", error);
      }
    };

    fetchPapers();
  }, [trackId]);

  useEffect(() => {
    // Only fetch track members when a paper is selected
    if (selectedPaper) {
      const fetchTrackMembers = async () => {
        try {
          const response = await fetch(
            `http://127.0.0.1:5000/track/${trackId}/members`,
            {
              credentials: "include",
            }
          );
          const data = await response.json();
          console.log("Track members data:", data);
          // Use track_members array directly from response
          setReviewers(data.track_members || []);
        } catch (error) {
          console.error("Error fetching track members:", error);
          setReviewers([]);
        }
      };

      fetchTrackMembers();
      setStep("reviewers");
    }
  }, [selectedPaper, trackId]);

  const handlePaperSelection = (paperId: number) => {
    const paper = papers.find((p) => p.id === paperId);
    setSelectedPaper(paper || null);
  };

  const handleReviewerToggle = (reviewerId: number) => {
    const reviewer = reviewers[reviewerId];
    const actualUserId =
      typeof reviewer._id === "string" ? reviewer._id : reviewer._id?.$oid;

    if (actualUserId) {
      setSelectedReviewers((prev) => {
        return prev.includes(actualUserId)
          ? prev.filter((r) => r !== actualUserId)
          : [...prev, actualUserId];
      });
    }
  };

  const handleAssignment = async () => {
    console.log("Assigning paper:", selectedPaper, selectedReviewers);
    if (!selectedPaper || selectedReviewers.length === 0) return;

    try {
      for (const reviewerId of selectedReviewers) {
        await fetch(`http://127.0.0.1:5000/track/${trackId}/assign`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paper_id: selectedPaper.id,
            reviewer_id: reviewerId,
          }),
        });
      }
      onClose();
    } catch (error) {
      console.error("Error assigning paper:", error);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.popup} onClick={(e) => e.stopPropagation()}>
        <button style={styles.close} onClick={onClose}>
          ✕
        </button>

        <div style={styles.stepIndicator}>
          <div
            style={{
              ...styles.step,
              ...(step === "papers" ? styles.activeStep : {}),
            }}
          >
            Select Paper
          </div>
          <div
            style={{
              ...styles.step,
              ...(step === "reviewers" ? styles.activeStep : {}),
            }}
          >
            Select Reviewers
          </div>
        </div>

        <div style={styles.search}>
          <FaSearch style={{ marginRight: 8 }} />
          <input
            type="text"
            placeholder={`Search ${
              step === "papers" ? "papers" : "reviewers"
            }...`}
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

        {step === "papers" ? (
          <SelectPaperItem
            papers={papers.filter((p) =>
              p.title.toLowerCase().includes(search.toLowerCase())
            )}
            selectedIds={selectedPaper ? [selectedPaper.id] : []}
            onToggle={handlePaperSelection}
          />
        ) : (
          <SelectPeopleItem
            people={reviewers.map((r, idx) => ({
              id: idx,
              name: `${r.name} ${r.surname}`,
              email: r.email || "",
              userId: typeof r._id === "string" ? r._id : r._id?.$oid || "",
            }))}
            selectedIds={selectedReviewers.map((id) =>
              reviewers.findIndex(
                (r) => (typeof r._id === "string" ? r._id : r._id?.$oid) === id
              )
            )}
            onToggle={handleReviewerToggle}
          />
        )}

        <button
          style={styles.action}
          onClick={step === "papers" ? () => {} : handleAssignment}
          disabled={
            step === "papers" ? !selectedPaper : selectedReviewers.length === 0
          }
        >
          {step === "papers" ? "Select Paper" : buttonText}
        </button>
      </div>
    </div>
  );
};

export default SelectPaperPopup;
