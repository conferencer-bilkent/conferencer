/**
 * Parses the authors field from the API response and creates a readable string.
 * Handles cases where the authors field is an array containing a JSON string or an array.
 *
 * Example API responses:
 *   1. [
 *        "{\"firstname\":\"new\",\"lastname\":\"sds\",\"email\":\"dsds\",\"country\":\"\",\"organization\":\"ds\"}"
 *      ]
 *   2. [
 *        [ { firstname: "new", lastname: "sds", email: "dsds", country:"", organization:"ds" } ]
 *      ]
 *
 * @param authors - The authors field from the API response.
 * @returns A formatted string with author details.
 */
export const parseAuthorsInfo = (authors: any): string => {
    let authorsArray: any[] = [];
    console.log("Raw authors data:", authors);

    try {
        if (Array.isArray(authors)) {
            // Case: An array with one element that is a JSON string.
            if (authors.length === 1 && typeof authors[0] === 'string') {
                authorsArray = JSON.parse(authors[0]);
            } 
            // New Case: An array with one element that is itself an array.
            else if (authors.length === 1 && Array.isArray(authors[0])) {
                authorsArray = authors[0];
            } 
            // Otherwise, assume it's already an array with author objects.
            else {
                authorsArray = authors;
            }
        } else if (typeof authors === 'string') {
            authorsArray = JSON.parse(authors);
        }
    } catch (err) {
        console.error("Error parsing authors:", err);
        return "Unknown Author(s)";
    }

    if (!Array.isArray(authorsArray) || authorsArray.length === 0) {
        return "Unknown Author(s)";
    }

    // Map each author object into a formatted string.
    const formattedAuthors = authorsArray
        .map((author: any) => {
            const name = `${author.firstname || ""} ${author.lastname || ""}`.trim();
            const details: string[] = [];
            if (author.email) details.push(`Email: ${author.email}`);
            if (author.country) details.push(`Country: ${author.country}`);
            if (author.organization) details.push(`Organization: ${author.organization}`);
            return details.length > 0 ? `${name} (${details.join(", ")})` : name;
        })
        .join("; ");

    console.log("Parsed authors:", formattedAuthors);
    return formattedAuthors;
};