/**
 * Interface representing a paper submission
 */
export interface PaperSubmission {
  title: string;
  abstract: string;
  keywords: string[];
  paper?: File | string; // File object when submitting, string path when receiving from API
  authors: string[];     // Array of user IDs
  track_id: string;
  status?: string;       // Optional as it might be set by the server
  created_at?: string;   // Optional as it might be set by the server
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
    // Create a FormData object to handle the file upload
    const formData = new FormData();
    
    // Add the file to the form data
    formData.append('paper', file);
    
    // Add the rest of the submission data as JSON
    const submissionWithoutFile = {
      ...submissionData,
      paper: undefined // Remove the paper field since we're sending it separately
    };
    formData.append('data', JSON.stringify(submissionWithoutFile));

    const response = await fetch('http://localhost:5000/paper/submit', {
      method: 'POST',
      credentials: 'include',
      body: formData,
      // Don't set Content-Type header; it will be set automatically with the correct boundary
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to submit paper');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting paper:', error);
    throw error;
  }
};

export default submitPaper;