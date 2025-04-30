import React, { useReducer, useState, createContext, ReactNode, useContext } from "react";
import { Action, reducer } from "../reducer/reducer";
import { initialState, State } from "../reducer/initailState";
import submitPaper, { PaperSubmission } from "../services/submissionService";

interface MyContextType {
    state: State;
    authorIndex: number;
    addPerson: () => void;
    handleInput: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        field: string,
        index?: number
    ) => void;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSendSubmission: () => void;
}

const SubmissionContext = createContext<MyContextType | undefined>(undefined);

const SubmissionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [authorIndex, setAuthorIndex] = useState(0);
    const [file, setFile] = useState<File | null>(null);

    const handleInput = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        field: string,
        index: number = 0
    ) => {
        const value = e.target.value;

        if (field === "selectedTrack") {
            dispatch({ type: "SET_SELECTED_TRACK", value });
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
                value
            } as Action);
        }
    };

    const addPerson = () => {
        setAuthorIndex(authorIndex + 1);
        dispatch({ type: "ADD_PERSON" });
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files ? event.target.files[0] : null;
        setFile(selectedFile);
    };

    const handleSendSubmission = async () => {
        try {
            if (!file) {
                console.error("No file selected");
                // Show error message to user
                return;
            }

            // Map persons array to authors format expected by the API
            const authors = state.persons.map(person => ({
                firstname: person.firstName,
                lastname: person.lastName,
                email: person.email,
                country: person.selectedCountry,
                organization: person.organization
                // Note: user_id is missing but may be set by the server
            }));

            // Create submission data object matching PaperSubmission interface
            const submissionData: PaperSubmission = {
                title: state.title,
                abstract: state.abstract,
                keywords: state.keywords.split(',').map(k => k.trim()), // Convert to array format
                track_id: "680fd4004703ed8e3c65c095", // Using the specified track_id
                authors: authors
            };

            // Log JSON for Postman testing
            console.log("JSON for Postman testing:", JSON.stringify({
                ...submissionData,
                paper: "paper will be uploaded as form-data file" // Just a placeholder for readability
            }, null, 2));
            
            // Call the submitPaper function with the mapped data
            const response = await submitPaper(submissionData, file);
            console.log("Submission successful:", response);
            
            // Handle successful submission (e.g., show success message, redirect)
        } catch (error) {
            console.error("Error submitting paper:", error);
            // Show error message to user
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
                handleSendSubmission
            }}>
            {children}
        </SubmissionContext.Provider>
    );
};

export const useSubmissionContext = () => {
    const context = useContext(SubmissionContext);
    if (!context) {
        throw new Error('useSubmissionContext must be used within a SubmissionProvider'); // hatadan kaçınmak için kullandım!
    }
    return context;
};

export { SubmissionProvider };