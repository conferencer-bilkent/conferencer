import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { getConflictsForTrack } from "../../services/trackService";
import { Conflict } from "../../models/conflict";

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
    width: "600px",
    maxHeight: "80vh",
    overflowY: "auto" as const,
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
  conflictItem: {
    marginBottom: "20px",
    padding: "15px",
    borderRadius: "8px",
    backgroundColor: "#1f2a32",
    border: "1px solid #3a4a56",
  },
  conflictHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    color: "#fff",
    fontWeight: 600,
  },
  personInfo: {
    marginBottom: "10px",
    padding: "8px",
    backgroundColor: "#283845",
    borderRadius: "6px",
    color: "#e0e0e0",
  },
  label: {
    fontWeight: 600,
    marginRight: "5px",
    color: "#8bafcc",
  },
  reasonText: {
    marginBottom: "10px",
    color: "#ff9800",
    fontWeight: 500,
  },
  papersList: {
    marginTop: "10px",
  },
  paperItem: {
    padding: "6px 10px",
    margin: "5px 0",
    backgroundColor: "#283845",
    borderRadius: "4px",
    color: "#fff",
  },
  emptyState: {
    textAlign: "center" as const,
    color: "#8bafcc",
    padding: "40px 20px",
  },
  loading: {
    textAlign: "center" as const,
    color: "#fff",
    padding: "40px 20px",
  }
};

interface ConflictOfInterestPopupProps {
  onClose: () => void;
  trackId?: string;
}

const ConflictOfInterestPopup: React.FC<ConflictOfInterestPopupProps> = ({ 
  onClose,
  trackId 
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConflicts = async () => {
      try {
        if (!trackId) {
          setError("No track selected");
          setLoading(false);
          return;
        }

        const conflictsData = await getConflictsForTrack(trackId);
        setConflicts(conflictsData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch conflicts:", err);
        setError("Failed to fetch conflicts of interest");
        setLoading(false);
      }
    };

    fetchConflicts();
  }, [trackId]);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.popup} onClick={(e) => e.stopPropagation()}>
        <button style={styles.close} onClick={onClose}>
          ✕
        </button>
        <h2 style={{ color: "#fff" }}>Conflicts of Interest</h2>
        
        {loading ? (
          <div style={styles.loading}>Loading conflicts...</div>
        ) : error ? (
          <div style={styles.emptyState}>{error}</div>
        ) : conflicts.length === 0 ? (
          <div style={styles.emptyState}>No conflicts of interest found.</div>
        ) : (
          <div>
            {conflicts.map((conflict, index) => (
              <div key={index} style={styles.conflictItem}>
                <div style={styles.conflictHeader}>
                  <span>Conflict #{index + 1}</span>
                </div>
                
                <div style={styles.personInfo}>
                  <div><span style={styles.label}>Reviewer:</span> {conflict.member.name}</div>
                  <div><span style={styles.label}>Email:</span> {conflict.member.email}</div>
                  <div><span style={styles.label}>Affiliation:</span> {conflict.member.affiliation}</div>
                </div>
                
                <div style={styles.personInfo}>
                  <div><span style={styles.label}>Author:</span> {conflict.author.name}</div>
                  <div><span style={styles.label}>Email:</span> {conflict.author.email}</div>
                  <div><span style={styles.label}>Affiliation:</span> {conflict.author.affiliation}</div>
                </div>
                
                <div style={styles.reasonText}>
                  <span style={styles.label}>Reason:</span> {conflict.reason}
                </div>
                
                <div>
                  <div style={styles.label}>Affected Papers:</div>
                  <div style={styles.papersList}>
                    {conflict.papers.map((paper, paperIndex) => (
                      <div key={paperIndex} style={styles.paperItem}>
                        {paper.title}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConflictOfInterestPopup;