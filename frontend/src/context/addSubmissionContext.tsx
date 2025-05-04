import React, {
  useReducer,
  useState,
  createContext,
  ReactNode,
  useContext,
  // act,
} from "react";
import { Action, reducer } from "../reducer/reducer";
import { initialState, State } from "../reducer/initailState";
import submitPaper, { PaperSubmission } from "../services/submissionService";
import { useConference } from "./ConferenceContext";

interface MyContextType {
  state: State;
  authorIndex: number;
  addPerson: () => void;
  handleInput: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    field: string,
    index?: number
  ) => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSendSubmission: () => void;
  showValidation: boolean;
}

const SubmissionContext = createContext<MyContextType | undefined>(undefined);

const SubmissionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [authorIndex, setAuthorIndex] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const { activeConference } = useConference();

  const handleInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    field: string,
    index: number = 0
  ) => {
    const value = e.target.value;

    if (field === "selectedTrack") {
      // Get the track ID from the select value
      const trackId = e.target.value;
      dispatch({ type: "SET_SELECTED_TRACK", value: trackId });
    } else if (field === "title") {
      dispatch({ type: "SET_TITLE", value });
    } else if (field === "abstract") {
      dispatch({ type: "SET_ABSTRACT", value });
    } else if (field === "keywords") {
      dispatch({ type: "SET_KEYWORDS", value });
    } else if (field === "emailNotification") {
      const checked = (e as React.ChangeEvent<HTMLInputElement>).target.checked;
      dispatch({ type: "SET_EMAILNOTIFICATION", index, value: checked });
    } else {
      const actionType = `SET_${field.toUpperCase()}` as const;
      dispatch({
        type: actionType,
        index,
        value,
      } as Action);
    }
  };

  const addPerson = () => {
    const currentPerson = state.persons[authorIndex];
    if (
      !currentPerson.firstName ||
      !currentPerson.lastName ||
      !currentPerson.email ||
      !currentPerson.organization ||
      !currentPerson.selectedCountry
    ) {
      setShowValidation(true);
      alert(
        "Please fill in all required fields for the current author before adding another."
      );
      return;
    }
    setAuthorIndex(authorIndex + 1);
    dispatch({ type: "ADD_PERSON" });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
  };

  const handleSendSubmission = async () => {
    setShowValidation(true);

    // Check paper information
    const missingPaperInfo = [];
    if (!state.title) missingPaperInfo.push("Title");
    if (!state.abstract) missingPaperInfo.push("Abstract");
    if (!state.keywords) missingPaperInfo.push("Keywords");
    if (!state.selectedTrack) missingPaperInfo.push("Track");
    if (!file) missingPaperInfo.push("Paper File");

    if (missingPaperInfo.length > 0) {
      alert(
        `Please fill in required paper information: ${missingPaperInfo.join(
          ", "
        )}`
      );
      return;
    }

    // Check author information
    const invalidAuthors = state.persons.filter((person) => {
      return (
        !person.firstName ||
        !person.lastName ||
        !person.email ||
        !person.organization ||
        !person.selectedCountry
      );
    });

    if (invalidAuthors.length > 0) {
      alert(
        `Please fill in all required fields for all authors before submitting.`
      );
      return;
    }

    try {
      if (!file) {
        console.error("No file selected");
        return;
      }

      if (!state.selectedTrack) {
        console.error("No track selected");
        return;
      }

      // Map persons array to authors format expected by the API
      const authors = state.persons.map((person) => ({
        firstname: person.firstName,
        lastname: person.lastName,
        email: person.email,
        country: person.selectedCountry,
        organization: person.organization,
      }));

      // Create submission data object matching PaperSubmission interface
      const submissionData: PaperSubmission = {
        title: state.title,
        abstract: state.abstract,
        keywords: state.keywords.split(",").map((k) => k.trim()),
        track_id: state.selectedTrack, // This now contains the track ID
        conference_id: activeConference?.id,
        authors: authors,
      };
      console.log("Submission data:", submissionData);
      console.log("authors:", authors);

      await submitPaper(submissionData, file);
    } catch (error) {
      console.error("Error submitting paper:", error);
    }
  };

  return (
    <SubmissionContext.Provider
      value={{
        state,
        authorIndex,
        addPerson,
        handleFileChange,
        handleInput,
        handleSendSubmission,
        showValidation,
      }}
    >
      {children}
    </SubmissionContext.Provider>
  );
};

export const useSubmissionContext = () => {
  const context = useContext(SubmissionContext);
  if (!context) {
    throw new Error(
      "useSubmissionContext must be used within a SubmissionProvider"
    ); // hatadan kaçınmak için kullandım!
  }
  return context;
};

export { SubmissionProvider };
