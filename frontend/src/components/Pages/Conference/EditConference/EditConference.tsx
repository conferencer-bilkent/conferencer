import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../CreateConference/CreateConference.css";
import { useNavigate } from "react-router-dom";
import { useConference } from "../../../../context/ConferenceContext";
import { getConferenceById, refreshActiveConference, updateConference } from "../../../../services/conferenceService";

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
      "license_expiry",
      "contact_emails",
      "start_date",
      "end_date",
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
      "max_abstract_length",
      "submission_instructions",
      "additional_fields_enabled",
      "file_upload_fields",
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

const EditConference: React.FC = () => {
  const { activeConference, setActiveConference } = useConference();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<any>({}); // Will be populated from activeConference
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set());
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Load conference data on mount
  useEffect(() => {
    if (!activeConference) {
      // If no active conference, redirect back to homepage
      navigate("/");
      return;
    }
    
    setLoading(true);
    
    // Refresh conference data to ensure we have the latest
    console.log("baskjhfbvasdhkf", activeConference);
    getConferenceById(activeConference.id)
      .then(conference => {
        // Convert properties to form format
        const formData: any = {
          name: conference.name,
          acronym: conference.acronym,
          short_acronym: conference.shortAcronym,
          website: conference.website,
          city: conference.city,
          venue: conference.venue,
          state: conference.state,
          country: conference.country,
          license_expiry: conference.licenseExpiry ? new Date(conference.licenseExpiry) : null,
          // Fix the contactEmails handling to check if it's an array before joining
          contact_emails: Array.isArray(conference.contactEmails) 
            ? conference.contactEmails.join(", ") 
            : typeof conference.contactEmails === 'string' 
              ? conference.contactEmails
              : "",
          start_date: conference.startDate ? new Date(conference.startDate) : null,
          end_date: conference.endDate ? new Date(conference.endDate) : null,
        };
        
        // Add all the settings with value/scope structure
        const settingsFields = [
          'doubleBlindReview',
          'canPcSeeUnassignedSubmissions',
          'abstractBeforeFull',
          'abstractSectionHidden',
          'maxAbstractLength',
          'submissionInstructions',
          'additionalFieldsEnabled',
          'fileUploadFields',
          'submissionUpdatesAllowed',
          'newSubmissionAllowed',
          'useBiddingOrRelevance',
          'biddingEnabled',
          'chairsCanViewBids',
          'reviewersPerPaper',
          'canPcSeeReviewerNames',
          'statusMenuEnabled',
          'pcCanEnterReview',
          'pcCanAccessReviews',
          'decisionRange',
          'subreviewersAllowed',
          'subreviewerAnonymous',
          'trackChairNotifications'
        ];
        
        settingsFields.forEach(field => {
          // Convert camelCase to snake_case for form keys
          const camelToSnake = (s: string) => s.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
          const snakeField = camelToSnake(field);
          
          // Find the corresponding property in conference
          const value = conference[field as keyof typeof conference];
          if (value && typeof value === 'object' && 'value' in value) {
            formData[snakeField] = value;
          }
        });
        
        setForm(formData);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error loading conference data:", error);
        alert("Failed to load conference data. Redirecting to homepage.");
        navigate("/");
      });
  }, [activeConference, navigate]);

  // Reset validation on step change
  useEffect(() => {
    setInvalidFields(new Set());
    setFieldErrors({});
  }, [currentStep]);

  const validateCurrentStep = (): string[] => {
    const invalid: string[] = [];
    const errors: Record<string, string> = {};

    steps[currentStep].fields.forEach((field) => {
      const formValue = form[field];
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
        errors[field] = "This field is required";
      } else if (typeof value === "number" && isNaN(value)) {
        invalid.push(field);
        errors[field] = "Please enter a valid number";
      }
    });
    setFieldErrors(errors);
    return invalid;
  };

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
    setInvalidFields((prev) => {
      const newSet = new Set(prev);
      newSet.delete(field);
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

    // If not on the final step, move to next step
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      return;
    }

    // On final step, perform update
    try {
      const payload: Record<string, any> = {};
      Object.entries(form).forEach(([key, val]) => {
        if (val && typeof val === "object" && "value" in val) {
          payload[key] = val;
        } else if (key === "start_date" || key === "end_date" || key === "license_expiry") {
          // Check if val is a valid date value (not empty object or null)
          payload[key] = (val && (typeof val === "string" || val instanceof Date || typeof val === "number")) 
            ? new Date(val).toISOString() 
            : "";
        } else if (key === "contact_emails" && typeof val === "string") {
          payload[key] = val.split(",").map((email: string) => email.trim());
        } else {
          payload[key] = val;
        }
      });

      if (!activeConference) {
        throw new Error("No active conference selected");
      }

      // Use the updateConference function from conferenceService that points to the correct endpoint
      const updatedConference = await updateConference(activeConference.id, payload);
      
      // Update the active conference in context
      setActiveConference(updatedConference);
      
      alert("Conference updated successfully!");
      navigate("/conference");
    } catch (err: any) {
      console.error("Error updating conference:", err);
      alert(`Error: ${err.message || "Failed to update conference"}`);
    }
  };

  const formatLabel = (str: string) => {
    return str
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const step = steps[currentStep];

  if (loading) {
    return <div className="content-container">Loading conference data...</div>;
  }

  return (
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
                  const rawValue = form[field];
                  const isObjectField =
                    rawValue &&
                    typeof rawValue === "object" &&
                    "value" in rawValue;
                  const value = isObjectField
                    ? (rawValue as any).value
                    : rawValue;
                  const scope = isObjectField ? (rawValue as any).scope : null;
                  const isInvalid = invalidFields.has(field);

                  return (
                    <div key={field} className="form-field-container">
                      <div
                        className={`form-field ${isInvalid ? "invalid" : ""}`}
                      >
                        <label className="form-label">
                          {formatLabel(field)}
                          {scope && (
                            <span className="scope-badge">{scope}</span>
                          )}
                        </label>

                        {field === "start_date" ||
                          field === "end_date" ||
                          field === "license_expiry" ? (
                            <DatePicker
                              selected={value instanceof Date ? value : value ? new Date(value) : null}
                              onChange={(date) =>
                                handleChange(
                                  field,
                                  date
                                )
                              }
                              dateFormat="yyyy-MM-dd"
                              className="form-input"
                              minDate={
                                field === "end_date" && form.start_date
                                  ? new Date(form.start_date)
                                  : undefined
                              }
                              placeholderText={
                                field === "end_date" && !form.start_date
                                  ? "Please select start date first"
                                  : "Select date"
                              }
                              disabled={
                                field === "end_date" && !form.start_date
                              }
                            />
                          ) : typeof value === "boolean" ? (
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) =>
                                handleChange(
                                  field,
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
                                  field,
                                  isObjectField
                                    ? {
                                        value: Number(e.target.value),
                                        scope,
                                      }
                                    : Number(e.target.value)
                                )
                              }
                              className="form-input"
                            />
                          ) : field === "use_bidding_or_relevance" ? (
                            <select
                              value={value as string}
                              onChange={(e) =>
                                handleChange(
                                  field,
                                  isObjectField
                                    ? { value: e.target.value, scope }
                                    : e.target.value
                                )
                              }
                              className="form-input"
                            >
                              <option value="relevance">Relevance</option>
                              <option value="bidding">Bidding</option>
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={value as string || ""}
                              onChange={(e) =>
                                handleChange(
                                  field,
                                  isObjectField
                                    ? { value: e.target.value, scope }
                                    : e.target.value
                                )
                              }
                              className="form-input"
                            />
                          )}
                      </div>
                      {isInvalid && fieldErrors[field] && (
                        <div className="error-message">
                          {fieldErrors[field]}
                        </div>
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
                    ? "Update Conference"
                    : "Next"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditConference;
