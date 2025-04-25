import { State } from "./initailState";

export type Action =
    | { type: 'SET_SELECTED_TRACK'; value: string }
    | { type: 'SET_FIRSTNAME'; index: number; value: string }
    | { type: 'SET_LASTNAME'; index: number; value: string }
    | { type: 'SET_EMAIL'; index: number; value: string }
    | { type: 'SET_SELECTEDCOUNTRY'; index: number; value: string }
    | { type: 'SET_ORGANIZATION'; index: number; value: string }
    | { type: 'SET_EMAILNOTIFICATION'; index: number;  value: boolean }
    | { type: 'SET_TITLE'; value: string }
    | { type: 'SET_ABSTRACT'; value: string }
    | { type: 'SET_KEYWORDS'; value: string }

    | { type: 'ADD_PERSON' };

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_SELECTED_TRACK":
            return { ...state, selectedTrack: action.value };
        case "SET_TITLE":
            return { ...state, title: action.value };
        case "SET_ABSTRACT":
            return { ...state, abstract: action.value };
        case "SET_KEYWORDS":
            return { ...state, keywords: action.value };

       
        case "SET_FIRSTNAME":
            return updatePersonField(state, action.index, 'firstName', action.value);
        case "SET_LASTNAME":
            return updatePersonField(state, action.index, 'lastName', action.value);
        case "SET_EMAIL":
            return updatePersonField(state, action.index, 'email', action.value);
        case "SET_SELECTEDCOUNTRY":
            return updatePersonField(state, action.index, 'selectedCountry', action.value);
        case "SET_ORGANIZATION":
            return updatePersonField(state, action.index, 'organization', action.value);
            case "SET_EMAILNOTIFICATION":
                return updatePersonField(state, action.index, 'emailNotification', action.value);

        case "ADD_PERSON":
            return {
                ...state,
                persons: [
                    ...state.persons,
                    {
                        emailNotification: true,
                        firstName: "",
                        lastName: "",
                        email: "",
                        selectedCountry: "",
                        organization: ""
                    }
                ]
            };

        default:
            return state;
    }
};

function updatePersonField(
    state: State,
    index: number,
    field: keyof State['persons'][number],
    value: string | boolean,
): State {
    return {
        ...state,
        persons: state.persons.map((person, i) =>
            i === index ? { ...person, [field]: value } : person
        )
    };
}
// import { State } from "./initailState";

// type Action =
//     | { type: 'SET_SELECTED_TRACK'; value: string }
//     | { type: 'SET_FIRST_NAME'; value: string }
//     | { type: 'SET_LAST_NAME'; value: string }
//     | { type: 'SET_EMAIL'; value: string }
//     | { type: 'SET_SELECTED_COUNTRY'; value: string }
//     | { type: 'SET_ORGANIZATION'; value: string };

// export const reducer = (state: State, action: Action) => {
//     switch (action.type) {
//         case "SET_SELECTED_TRACK":
//             return {
//                 ...state, selectedTrack: action.value 
//             };
//         case "SET_FIRST_NAME":
//             return {
//                 ...state, firstName: action.value 
//             };
//         case "SET_LAST_NAME":
//             return {
//                 ...state, lastName: action.value 
//             };
//         case "SET_EMAIL":
//             return {
//                 ...state, email: action.value 
//             };
//         case "SET_SELECTED_COUNTRY":
//             return {
//                 ...state, selectedCountry: action.value 
//             };
//         case "SET_ORGANIZATION":
//             return {
//                 ...state, organization: action.value 
//             };
//         }
// };
