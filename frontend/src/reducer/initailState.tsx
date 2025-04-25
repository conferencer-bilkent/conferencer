export interface Person {
    emailNotification: boolean;
    firstName: string;
    lastName: string;
    email: string;
    selectedCountry: string;
    organization: string;
}

export interface State {
    selectedTrack: string;
    persons: Person[];
    title: string;
    abstract: string;
    keywords: string;
}

export const initialState: State = {
    selectedTrack: "",
    persons: [{
        emailNotification:true,
        firstName: "",
        lastName: "",
        email: "",
        selectedCountry: "",
        organization: ""
    }],
    title: "",
    abstract: "",
    keywords: "",
}
