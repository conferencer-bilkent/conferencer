import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker"; // Add this import
import "react-datepicker/dist/react-datepicker.css"; // Add this import
import "./CreateConference.css";
import {
  createConference,
  mapApiResponseToConference,
} from "../../../../services/conferenceService";
import { useConference } from "../../../../context/ConferenceContext";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from "@mui/material";
import { colors } from "@mui/material";

const steps = [
  {
    title: "Conference Type",
    fields: ["conference_type", "conference_series_name"],
  },
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
      "subreviewers_allowed",
      "subreviewer_anonymous",
    ],
  },
  {
    title: "Notifications",
    fields: ["track_chair_notifications"],
  },
];

const seriesSteps = [
  {
    title: "Conference Type",
    fields: ["conference_type", "conference_series_name"],
  },
  {
    title: "Memduh",
    fields: [], // Empty fields as this is just a display step
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
  license_expiry: oneYearLater, // Changed from ISO string to Date object

  contact_emails: "",

  start_date: "",
  end_date: "",

  conference_type: "individual", // Add this field
  conference_series_name: "", // Add this field

  double_blind_review: { value: false, scope: defaultScope },
  can_pc_see_unassigned_submissions: { value: false, scope: defaultScope },
  abstract_before_full: { value: true, scope: defaultScope },
  abstract_section_hidden: { value: false, scope: "track" },
  max_abstract_length: { value: 300, scope: "track" },
  submission_instructions: { value: "no", scope: "track" },
  additional_fields_enabled: { value: true, scope: "track" },
  file_upload_fields: { value: "paper, additional", scope: "track" },
  submission_updates_allowed: { value: false, scope: "track" },
  new_submission_allowed: { value: false, scope: defaultScope },
  use_bidding_or_relevance: { value: "relevance", scope: "track" },
  bidding_enabled: { value: false, scope: "track" },
  chairs_can_view_bids: { value: false, scope: "track" },
  reviewers_per_paper: { value: 5, scope: "track" },
  can_pc_see_reviewer_names: { value: false, scope: "track" },
  status_menu_enabled: { value: true, scope: "track" },
  pc_can_enter_review: { value: false, scope: "track" },
  pc_can_access_reviews: { value: false, scope: "track" },
  subreviewers_allowed: { value: true, scope: "track" },
  subreviewer_anonymous: { value: true, scope: "track" },
  track_chair_notifications: { value: false, scope: "track" },
};

type ConferenceForm = typeof defaultForm;

const CreateConference: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<ConferenceForm>(defaultForm);
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set());
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { setActiveConference } = useConference();

  useEffect(() => {
    setInvalidFields(new Set());
    setFieldErrors({});
  }, [currentStep]);

  const validateCurrentStep = (): string[] => {
    const invalid: string[] = [];
    const errors: Record<string, string> = {};

    const currentSteps =
      form.conference_type === "series" ? seriesSteps : steps;
    currentSteps[currentStep].fields.forEach((field) => {
      // Skip validation for conference_series_name if type is individual
      if (
        field === "conference_series_name" &&
        form.conference_type === "individual"
      ) {
        return;
      }

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
        errors[field] = "This field is required";
      } else if (typeof value === "number" && isNaN(value)) {
        invalid.push(field);
        errors[field] = "Please enter a valid number";
      }
    });
    setFieldErrors(errors);
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

    if (currentStep === 0 && form.conference_type === "series") {
      setCurrentStep(1);
      return;
    }

    // build payload by unwrapping any { value, scope } objects
    const payload: Record<string, any> = {};
    Object.entries(form).forEach(([key, val]) => {
      if (val && typeof val === "object" && "value" in val) {
        payload[key] = (val as any).value;
      } else if (key === "start_date" || key === "end_date") {
        payload[key] = val ? new Date(val).toISOString() : ""; // Format dates
      } else {
        payload[key] = val;
      }
    });

    const currentSteps =
      form.conference_type === "series" ? seriesSteps : steps;
    if (currentStep === currentSteps.length - 1) {
      try {
        const conferenceId = await createConference(payload);

        // build a Conference object and mark it active
        const newConf = mapApiResponseToConference({
          conference_id: conferenceId,
          ...payload,
          created_at: new Date().toISOString(),
        });
        setActiveConference(newConf);

        alert("Conference created!");
      } catch (err: any) {
        alert(`Error: ${err.message || "Network error"}`);
      }
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, currentSteps.length - 1));
    }
  };

  const formatLabel = (str: string) => {
    return str
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const currentSteps = form.conference_type === "series" ? seriesSteps : steps;
  const step = currentSteps[currentStep];

  return (
    <div className="content-container">
      <div className="main-container">
        <div className="form-card">
          <div className="progress-container">
            <div className="progress-steps-container">
              {currentSteps.map((_, index) => (
                <div key={index} className="step-container">
                  <div
                    className={`step-circle ${
                      index <= currentStep ? "active" : ""
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < currentSteps.length - 1 && (
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
            {currentStep === 1 && form.conference_type === "series" ? (
              <div>memduh</div>
            ) : (
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
                      // Hide conference_series_name field if conference_type is individual
                      field === "conference_series_name" &&
                        form.conference_type === "individual" ? null : (
                        <div key={field} className="form-field-container">
                          <div
                            className={`form-field ${
                              isInvalid ? "invalid" : ""
                            }`}
                          >
                            <label className="form-label">
                              {formatLabel(field)}
                              {scope && (
                                <span className="scope-badge">{scope}</span>
                              )}
                            </label>

                            {field === "conference_type" ? (
                              <select
                                value={value as string}
                                onChange={(e) =>
                                  handleChange(
                                    field as keyof ConferenceForm,
                                    e.target.value
                                  )
                                }
                                className="form-input"
                              >
                                <option value="individual">
                                  Individual Conference
                                </option>
                                <option value="series">
                                  Conference Series
                                </option>
                              </select>
                            ) : field === "start_date" ||
                              field === "end_date" ||
                              field === "license_expiry" ? (
                              <DatePicker
                                selected={
                                  field === "license_expiry"
                                    ? form.license_expiry
                                    : value
                                    ? new Date(value)
                                    : null
                                }
                                onChange={(date) =>
                                  handleChange(
                                    field as keyof ConferenceForm,
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
                          {isInvalid && fieldErrors[field] && (
                            <div className="error-message">
                              {fieldErrors[field]}
                            </div>
                          )}
                        </div>
                      )
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
                    {currentStep === currentSteps.length - 1
                      ? "Create Conference"
                      : "Next"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateConference;
