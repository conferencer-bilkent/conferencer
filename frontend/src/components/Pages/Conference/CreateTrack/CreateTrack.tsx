// src/components/CreateTrack/CreateTrack.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateTrack.css";
import {
  createTrack,
  mapApiResponseToTrack,
} from "../../../../services/trackService";
import { useConference } from "../../../../context/ConferenceContext";
import { useRefreshConference } from "../../../../services/conferenceService";

const steps = [
  {
    title: "Track Information",
    fields: ["name", "short_name", "description"],
  },
  {
    title: "Submission Settings",
    fields: [
      "abstract_before_full",
      "multiple_authors_allowed",
      "max_abstract_length",
      "file_upload_fields",
      "presenter_selection_required",
      "submission_updates_allowed",
    ],
  },
  {
    title: "Review Settings",
    fields: [
      "use_bidding_or_relevance",
      "bidding_enabled",
      "reviewers_per_paper",
      "pc_can_access_reviews",
      "subreviewers_allowed",
    ],
  },
  {
    title: "Notifications",
    fields: ["track_chair_notifications"],
  },
];

const defaultScope = "track";

const defaultForm = {
  name: "",
  short_name: "",
  description: "",
  abstract_before_full: { value: true, scope: defaultScope },
  multiple_authors_allowed: { value: true, scope: defaultScope },
  max_abstract_length: { value: 300, scope: defaultScope },
  file_upload_fields: { value: "paper, supplementary", scope: defaultScope },
  presenter_selection_required: { value: false, scope: defaultScope },
  submission_updates_allowed: { value: false, scope: defaultScope },
  use_bidding_or_relevance: { value: "relevance", scope: defaultScope },
  bidding_enabled: { value: false, scope: defaultScope },
  reviewers_per_paper: { value: 3, scope: defaultScope },
  pc_can_access_reviews: { value: false, scope: defaultScope },
  subreviewers_allowed: { value: false, scope: defaultScope },
  track_chair_notifications: { value: true, scope: defaultScope },
};

type TrackForm = typeof defaultForm;

const CreateTrack: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<TrackForm>(defaultForm);
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set());
  const { activeConference } = useConference();
  const refreshConference = useRefreshConference();

  useEffect(() => {
    setInvalidFields(new Set());
  }, [currentStep]);

  const validateCurrentStep = (): string[] => {
    const invalid: string[] = [];
    steps[currentStep].fields.forEach((field) => {
      const formValue = form[field as keyof TrackForm];
      let value: any =
        formValue && typeof formValue === "object" && "value" in formValue
          ? (formValue as any).value
          : formValue;
      if (typeof value === "string" && value.trim() === "") invalid.push(field);
      if (typeof value === "number" && isNaN(value)) invalid.push(field);
    });
    return invalid;
  };

  const handleChange = (field: keyof TrackForm, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setInvalidFields((prev) => {
      const s = new Set(prev);
      s.delete(field as string);
      return s;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const invalid = validateCurrentStep();
    if (invalid.length) {
      setInvalidFields(new Set(invalid));
      return;
    }
    // unwrap values
    const payload: Record<string, any> = {};
    Object.entries(form).forEach(([k, v]) => {
      payload[k] =
        v && typeof v === "object" && "value" in v ? (v as any).value : v;
    });
    if (currentStep === steps.length - 1) {
      try {
        if (!activeConference) {
          throw new Error("No active conference selected");
        }

        // Add conference_id to payload
        payload.conference_id = activeConference.id;

        const trackId = await createTrack(payload);
        const newTrack = mapApiResponseToTrack({
          track_id: trackId,
          ...payload,
          created_at: new Date().toISOString(),
        });
        console.log("Track created:", newTrack);

        // Refresh the conference data to include the new track
        await refreshConference(activeConference.id);
        alert("Track created successfully!");
        navigate(`/conference/`);
      } catch (err: any) {
        alert(`Error: ${err.message}`);
      }
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const formatLabel = (str: string) =>
    str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const step = steps[currentStep];

  return (
    <div className="content-container">
      <div className="form-card">
        {/* Progress */}
        <div className="progress-container">
          <div className="progress-steps-container">
            {steps.map((_, i) => (
              <div key={i} className="step-container">
                <div
                  className={`step-circle ${i <= currentStep ? "active" : ""}`}
                >
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`step-line ${i < currentStep ? "active" : ""}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Form */}
        <h2 className="form-title">{step.title}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {step.fields.map((field) => {
              const raw = form[field as keyof TrackForm];
              const isObj = raw && typeof raw === "object" && "value" in raw;
              const value = isObj ? (raw as any).value : raw;
              const scope = isObj ? (raw as any).scope : null;
              const invalid = invalidFields.has(field);
              return (
                <div
                  key={field}
                  className={`form-field ${invalid ? "invalid" : ""}`}
                >
                  <label className="form-label">
                    {formatLabel(field)}
                    {scope && <span className="scope-badge">{scope}</span>}
                  </label>
                  {typeof value === "boolean" ? (
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        handleChange(
                          field as any,
                          isObj
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
                          field as any,
                          isObj
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
                          field as any,
                          isObj
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
              onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
              disabled={currentStep === 0}
              className="nav-button button-back"
            >
              Back
            </button>
            <button type="submit" className="nav-button button-primary">
              {currentStep === steps.length - 1 ? "Create Track" : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTrack;
