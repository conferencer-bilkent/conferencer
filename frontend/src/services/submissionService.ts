import { act } from "react";
import { useConference } from "../context/ConferenceContext";
/**
 * Interface for author information
 */
export interface Author {
  user_id?: string;
  firstname: string;
  lastname: string;
  email: string;
  country?: string;
  organization: string;
}

/**
 * Interface representing a paper submission
 */
export interface PaperSubmission {
  title: string;
  abstract: string;
  keywords: string[] | string;
  paper?: File | string; // File object when submitting, string path when receiving from API
  track_id: string;
  conference_id?: string; // Add conference_id
  status?: string;       // Optional as it might be set by the server
  created_at?: string;   // Optional as it might be set by the server
  authors: Author[];     // Array of author objects
  additional_fields?: Record<string, any>; // For any custom fields required by specific tracks
}

/**
 * Submits a paper to a conference track
 * 
 * @param submissionData - The paper submission data
 * @param file - The paper file to upload
 * @returns Promise with the submission response
 */

export const submitPaper = async (
  submissionData: PaperSubmission,
  file: File
): Promise<any> => {
  try {
    // First, upload the file separately
    console.log("Uploading file:", file);

    const fileFormData = new FormData();
    fileFormData.append('file', file);
    fileFormData.append('title', submissionData.title);      // your other fields
    fileFormData.append('conference_id', submissionData.conference_id || '');
    fileFormData.append('track_id', submissionData.track_id);
    fileFormData.append('abstract', submissionData.abstract);
    
    console.log("File form data:", fileFormData.get('file'));

    const fileUploadResponse = await fetch('http://127.0.0.1:5000/paper/submit', {
      method: 'POST',
      credentials: 'include',
      body: fileFormData,
    });
    console.log("File upload response:", fileUploadResponse);
    if (!fileUploadResponse.ok) {
      console.error("File upload failed:", file);
      const errorData = await fileUploadResponse.json();
      throw new Error(errorData.error || 'Failed to upload file');
    }
    console.log("File uploaded successfully");
  } catch (error) {
    console.error('Error submitting paper:', error);
    throw error;
  }
};

export default submitPaper;