/**
 * Interface for author information
 */
export interface Author {
  user_id?: string;
  firstname: string;
  lastname: string;
  email: string;
  country: string;
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
    const fileFormData = new FormData();
    fileFormData.append('file', file);
    
    const fileUploadResponse = await fetch('http://127.0.0.1:5000/paper/submit', {
      method: 'POST',
      credentials: 'include',
      body: fileFormData,
    });
    
    if (!fileUploadResponse.ok) {
      const errorData = await fileUploadResponse.json();
      throw new Error(errorData.error || 'Failed to upload file');
    }
    
    const fileData = await fileUploadResponse.json();
    
    // Ensure keywords is an array
    if (typeof submissionData.keywords === 'string') {
      submissionData.keywords = submissionData.keywords.split(',').map(k => k.trim());
    }
    
    // Use the file path returned from the upload endpoint
    const submissionWithFilePath = {
      ...submissionData,
      paper: fileData.filePath || file.name, // Use the path returned from the server or fallback
      track_id: "680fd4004703ed8e3c65c095" // Ensure this is set correctly
    };
    
    // Log the submission data for debugging
    console.log("Submission data:", JSON.stringify(submissionWithFilePath, null, 2));

    // Send the JSON data with the file path
    const response = await fetch('http://127.0.0.1:5000/paper/submit', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(submissionWithFilePath),
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