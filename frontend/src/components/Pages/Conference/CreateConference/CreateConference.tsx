import React, { useState } from "react";
import "./CreateConference.css";
import { useNavigate } from "react-router-dom";

type Scope = "conference" | "track";

type ConfigValue = {
  value: string | number | boolean;
  scope: Scope;
};

type ConferenceForm = {
  [key: string]: any; // 💡 Enable dynamic typing for flexible key access
};

const yesNoOptions = [
  { label: "yes", value: true },
  { label: "no", value: false },
];

const biddingOptions = [
  { label: "paper bidding", value: "bidding" },
  { label: "relevance detection", value: "relevance" },
];

const reviewAccessOptions = [
  {
    label: "ordinary PC members can access all reviews",
    value: true,
  },
  {
    label: "only the reviews of the papers assigned to them",
    value: false,
  },
];

const numberOptions = [1, 2, 3, 4, 5, 6, 7];
const abstractLengths = [100, 200, 300, 400, 500];
const decisionRanges = [3, 5, 7, 10];
const defaultScope = "conference";

const oneYearLater = new Date(new Date().setFullYear(new Date().getFullYear() + 1))
  .toISOString()
  .split("T")[0];

const defaultForm: ConferenceForm = {
  name: "",
  acronym: "",
  short_acronym: "",
  website: "not set",
  city: "not set",
  venue: "none",
  state: "none",
  country: "not set",
  submission_page: "not set",
  license_expiry: oneYearLater, // ✅ read-only
  auto_update_submission_dates: "",

  contact_emails: "",
  forwarding_emails_conference: "",
  forwarding_emails_tracks: "",

  double_blind_review: { value: false, scope: defaultScope },
  can_pc_see_unassigned_submissions: { value: false, scope: defaultScope },
  abstract_before_full: { value: true, scope: defaultScope },
  abstract_section_hidden: { value: false, scope: "track" },
  multiple_authors_allowed: { value: true, scope: "track" },
  max_abstract_length: { value: 300, scope: "track" },
  submission_instructions: { value: "no", scope: "track" },
  additional_fields_enabled: { value: true, scope: "track" },
  file_upload_fields: { value: "paper, additional", scope: "track" },
  presenter_selection_required: { value: false, scope: "track" },
  submission_updates_allowed: { value: false, scope: "track" },
  new_submission_allowed: { value: false, scope: defaultScope },
  use_bidding_or_relevance: { value: "relevance", scope: "track" },
  bidding_enabled: { value: false, scope: "track" },
  chairs_can_view_bids: { value: false, scope: "track" },
  llm_fraud_detection: { value: false, scope: "track" },
  reviewers_per_paper: { value: 5, scope: "track" },
  can_pc_see_reviewer_names: { value: false, scope: "track" },
  status_menu_enabled: { value: true, scope: "track" },
  pc_can_enter_review: { value: false, scope: "track" },
  pc_can_access_reviews: { value: false, scope: "track" },
  decision_range: { value: 10, scope: "track" },
  subreviewers_allowed: { value: true, scope: "track" },
  subreviewer_anonymous: { value: true, scope: "track" },
  track_chair_notifications: { value: false, scope: "track" },
};

const groupedFields: { [section: string]: string[] } = {
  "Conference Information": [
    "name", "acronym", "short_acronym", "website", "city", "venue", "state", "country",
    "submission_page", "license_expiry", "auto_update_submission_dates",
    "contact_emails", "forwarding_emails_conference", "forwarding_emails_tracks"
  ],
  "Access Information": [
    "double_blind_review", "can_pc_see_unassigned_submissions"
  ],
  "Submission Information": [
    "abstract_before_full", "abstract_section_hidden", "multiple_authors_allowed",
    "max_abstract_length", "submission_instructions", "additional_fields_enabled",
    "file_upload_fields", "presenter_selection_required", "submission_updates_allowed",
    "new_submission_allowed"
  ],
  "Paper Assignment": [
    "use_bidding_or_relevance", "bidding_enabled", "chairs_can_view_bids",
    "llm_fraud_detection", "reviewers_per_paper"
  ],
  "Reviewing Information": [
    "can_pc_see_reviewer_names", "status_menu_enabled", "pc_can_enter_review",
    "pc_can_access_reviews", "decision_range", "subreviewers_allowed",
    "subreviewer_anonymous"
  ],
  "Notifications": [
    "track_chair_notifications"
  ]
};

const CreateConference: React.FC = () => {
  const [form, setForm] = useState<ConferenceForm>(defaultForm);
  const navigate = useNavigate();

  const handleChange = (key: string, value: any, field = "value") => {
    setForm((prev: ConferenceForm) => ({
      ...prev,
      [key]: typeof prev[key] === "object" && prev[key] !== null
        ? { ...prev[key], [field]: value }
        : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.acronym || !form.short_acronym) {
      alert("Please fill required fields.");
      return;
    }

    const payload = {
      ...form,
      contact_emails: form.contact_emails?.split(",").map((e: string) => e.trim()),
      forwarding_emails_conference: form.forwarding_emails_conference?.split(",").map((e: string) => e.trim()),
      forwarding_emails_tracks: form.forwarding_emails_tracks?.split(",").map((e: string) => e.trim()),
    };

    try {
      const response = await fetch("http://localhost:5000/conference/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Conference created!");
        navigate("/home");
      } else {
        alert("Creation failed");
      }
    } catch (error) {
      console.error("Error creating:", error);
    }
  };

  const renderInput = (key: string) => {
    const val = form[key];
    const isObject = typeof val === "object" && val !== null && "value" in val;
    const value = isObject ? val.value : val;
    const scope = isObject ? val.scope : undefined;

    const renderValueInput = () => {
      if (key === "license_expiry") {
        return <input type="date" value={value} readOnly />;
      }

      if (typeof value === "boolean") {
        return (
          <select value={value ? "true" : "false"} onChange={(e) => handleChange(key, e.target.value === "true")}>
            {yesNoOptions.map((opt) => (
              <option key={opt.label} value={String(opt.value)}>{opt.label}</option>
            ))}
          </select>
        );
      }

      if (key === "use_bidding_or_relevance") {
        return (
          <select value={value} onChange={(e) => handleChange(key, e.target.value)}>
            {biddingOptions.map((opt) => (
              <option key={opt.label} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );
      }

      if (key === "pc_can_access_reviews") {
        return (
          <select value={String(value)} onChange={(e) => handleChange(key, e.target.value === "true")}>
            {reviewAccessOptions.map((opt) => (
              <option key={opt.label} value={String(opt.value)}>{opt.label}</option>
            ))}
          </select>
        );
      }

      if (key === "max_abstract_length") {
        return (
          <select value={value} onChange={(e) => handleChange(key, Number(e.target.value))}>
            {abstractLengths.map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        );
      }

      if (key === "decision_range") {
        return (
          <select value={value} onChange={(e) => handleChange(key, Number(e.target.value))}>
            {decisionRanges.map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        );
      }

      if (key === "reviewers_per_paper") {
        return (
          <select value={value} onChange={(e) => handleChange(key, Number(e.target.value))}>
            {numberOptions.map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        );
      }

      return (
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(key, e.target.value)}
        />
      );
    };

    return (
      <tr key={key}>
        <td>{key.replace(/_/g, " ")}</td>
        <td>{renderValueInput()}</td>
        <td>
          {scope ? (
            <select value={scope} onChange={(e) => handleChange(key, e.target.value, "scope")}>
              <option value="conference">conference</option>
              <option value="track">track</option>
            </select>
          ) : (
            <span>conference</span>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="create-conference-container">
      <h2>Create Conference</h2>
      {Object.entries(groupedFields).map(([section, keys]) => (
        <div key={section} className="section">
          <h3>{section}</h3>
          <table>
            <thead>
              <tr>
                <th>Setting</th>
                <th>Value</th>
                <th>Scope</th>
              </tr>
            </thead>
            <tbody>{keys.map((key) => renderInput(key))}</tbody>
          </table>
        </div>
      ))}
      <button className="submit-button" onClick={handleSubmit}>Create Conference</button>
    </div>
  );
};

export default CreateConference;
