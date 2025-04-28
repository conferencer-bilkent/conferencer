import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateConference.css";
import { getMenuItemsForPage } from "../../../global/sideMenuConfig";
import { handleMenuItemClick } from "../../../../utils/navigation/menuNavigation";
import SideMenu from "../../../global/SideMenu";
import Topbar from "../../../global/TopBar";
import { createConference, mapApiResponseToConference } from "../../../../services/conferenceService";
import { useConference } from "../../../../context/ConferenceContext";

const steps = [
  {
    title: "Conference Information",
    fields: [
      "name",
      "acronym",
      "short_acronym",
      "website",
      "city",
      "venue",
      "state",
      "country",
      "submission_page",
      "license_expiry",
      "auto_update_submission_dates",
      "contact_emails",
      "forwarding_emails_conference",
      "forwarding_emails_tracks",
    ],
  },
  {
    title: "Access Information",
    fields: ["double_blind_review", "can_pc_see_unassigned_submissions"],
  },
  {
    title: "Submission Information",
    fields: [
      "abstract_before_full",
      "abstract_section_hidden",
      "multiple_authors_allowed",
      "max_abstract_length",
      "submission_instructions",
      "additional_fields_enabled",
      "file_upload_fields",
      "presenter_selection_required",
      "submission_updates_allowed",
      "new_submission_allowed",
    ],
  },
  {
    title: "Paper Assignment",
    fields: [
      "use_bidding_or_relevance",
      "bidding_enabled",
      "chairs_can_view_bids",
      "llm_fraud_detection",
      "reviewers_per_paper",
    ],
  },
  {
    title: "Reviewing Information",
    fields: [
      "can_pc_see_reviewer_names",
      "status_menu_enabled",
      "pc_can_enter_review",
      "pc_can_access_reviews",
      "decision_range",
      "subreviewers_allowed",
      "subreviewer_anonymous",
    ],
  },
  {
    title: "Notifications",
    fields: ["track_chair_notifications"],
  },
];

const defaultScope = "conference";
const oneYearLater = new Date();
oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

const defaultForm = {
  name: "",
  acronym: "",
  short_acronym: "",
  website: "not set",
  city: "not set",
  venue: "none",
  state: "none",
  country: "not set",
  submission_page: "not set",
  license_expiry: oneYearLater.toISOString().split("T")[0],
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

type ConferenceForm = typeof defaultForm;

const CreateConference: React.FC = () => {
  const navigate = useNavigate();
  const menuItems = getMenuItemsForPage("default");
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<ConferenceForm>(defaultForm);
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set());
  const { setActiveConference } = useConference();          // ← NEW

  useEffect(() => {
    setInvalidFields(new Set());
  }, [currentStep]);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleItemClick = (item: string) => {
    if (item === "LOG OUT") {
      handleLogout();
    } else {
      handleMenuItemClick(item, navigate);
    }
  };

  const validateCurrentStep = (): string[] => {
    const invalid: string[] = [];
    steps[currentStep].fields.forEach((field) => {
      const formValue = form[field as keyof ConferenceForm];
      let value: any;

      if (
        formValue !== null &&
        typeof formValue === "object" &&
        "value" in formValue
      ) {
        value = formValue.value;
      } else {
        value = formValue;
      }

      if (typeof value === "string" && value.trim() === "") {
        invalid.push(field);
      } else if (typeof value === "number" && isNaN(value)) {
        invalid.push(field);
      }
    });
    return invalid;
  };

  const handleChange = (field: keyof ConferenceForm, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setInvalidFields((prev) => {
      const newSet = new Set(prev);
      newSet.delete(field as string);
      return newSet;
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const invalid = validateCurrentStep();

    if (invalid.length > 0) {
      setInvalidFields(new Set(invalid));
      return;
    }

    // build payload by unwrapping any { value, scope } objects
    const payload: Record<string, any> = {};
    Object.entries(form).forEach(([key, val]) => {
      if (val && typeof val === "object" && "value" in val) {
        payload[key] = (val as any).value;
      } else {
        payload[key] = val;
      }
    });

    if (currentStep === steps.length - 1) {
      try {
        const conferenceId = await createConference(payload);

        // build a Conference object and mark it active
        const newConf = mapApiResponseToConference({
          conference_id: conferenceId,
          ...payload,
          created_at: new Date().toISOString()
        });
        setActiveConference(newConf);

        alert("Conference created!");
      } catch (err: any) {
        alert(`Error: ${err.message || "Network error"}`);
      }
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const formatLabel = (str: string) => {
    return str
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const step = steps[currentStep];

  return (
    <>
      <Topbar />
      <div className="homepage-container">
        <SideMenu items={menuItems} onItemClick={handleItemClick} />
        <div className="content-container">
          <div className="main-container">
            <div className="form-card">
              <div className="progress-container">
                <div className="progress-steps-container">
                  {steps.map((_, index) => (
                    <div key={index} className="step-container">
                      <div
                        className={`step-circle ${
                          index <= currentStep ? "active" : ""
                        }`}
                      >
                        {index + 1}
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`step-line ${
                            index < currentStep ? "active" : ""
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-content">
                <h2 className="form-title">{step.title}</h2>
                <form onSubmit={handleFormSubmit}>
                  <div className="space-y-4">
                    {step.fields.map((field) => {
                      const rawValue = form[field as keyof ConferenceForm];
                      const isObjectField =
                        rawValue &&
                        typeof rawValue === "object" &&
                        "value" in rawValue;
                      const value = isObjectField
                        ? (rawValue as any).value
                        : rawValue;
                      const scope = isObjectField
                        ? (rawValue as any).scope
                        : null;
                      const isInvalid = invalidFields.has(field);

                      return (
                        <div
                          key={field}
                          className={`form-field ${isInvalid ? "invalid" : ""}`}
                        >
                          <label className="form-label">
                            {formatLabel(field)}
                            {scope && (
                              <span className="scope-badge">{scope}</span>
                            )}
                          </label>

                          {typeof value === "boolean" ? (
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) =>
                                handleChange(
                                  field as keyof ConferenceForm,
                                  isObjectField
                                    ? { value: e.target.checked, scope }
                                    : e.target.checked
                                )
                              }
                              className="form-checkbox"
                            />
                          ) : typeof value === "number" ? (
                            <input
                              type="number"
                              value={value}
                              onChange={(e) =>
                                handleChange(
                                  field as keyof ConferenceForm,
                                  isObjectField
                                    ? { value: Number(e.target.value), scope }
                                    : Number(e.target.value)
                                )
                              }
                              className="form-input"
                            />
                          ) : (
                            <input
                              type="text"
                              value={value as string}
                              onChange={(e) =>
                                handleChange(
                                  field as keyof ConferenceForm,
                                  isObjectField
                                    ? { value: e.target.value, scope }
                                    : e.target.value
                                )
                              }
                              className="form-input"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="button-container">
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentStep((prev) => Math.max(prev - 1, 0))
                      }
                      disabled={currentStep === 0}
                      className="nav-button button-back"
                    >
                      Back
                    </button>
                    <button type="submit" className="nav-button button-primary">
                      {currentStep === steps.length - 1
                        ? "Create Conference"
                        : "Next"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateConference;
