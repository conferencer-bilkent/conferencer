import React, { useReducer, useState, createContext, ReactNode, useContext } from "react";
import { Action, reducer } from "../reducer/reducer";
import { initialState, State } from "../reducer/initailState";

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

    const handleSendSubmission = () => {
        if (file) {  // file kullanmadı hatasından kaçınmak için kullandım bu loop'u aslında gereksiz.
            console.log("File ready for upload:", file.name); // Zaten database sendfile gibi bir konut olacak senin yaptığında.
        } else {
            console.log("No file selected.");
        }
        console.log(state);
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