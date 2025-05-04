import { Paper, mapResponseToPaper } from '../models/paper';

const API_BASE_URL = 'http://127.0.0.1:5000';

/**
 * Fetches paper details by ID
 * 
 * @param paperId - ID of the paper to fetch
 * @returns Promise with paper data
 */
export const getPaperById = async (paperId: string): Promise<Paper | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/paper/${paperId}`, {
      credentials: "include"
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch paper");
    }
    
    const paperData = await response.json();
    return mapResponseToPaper(paperData);
  } catch (error) {
    console.error(`Error fetching paper ${paperId}:`, error);
    return null;
  }
};

/**
 * Downloads a paper file
 * 
 * @param paperId - ID of the paper to download
 * @returns Promise with blob data
 */
export const downloadPaper = async (paperId: string): Promise<Blob> => {
  try {
    const response = await fetch(`${API_BASE_URL}/paper/${paperId}/download`, {
      credentials: "include"
    });
    
    if (!response.ok) {
      throw new Error("Failed to download paper");
    }
    
    return await response.blob();
  } catch (error) {
    console.error(`Error downloading paper ${paperId}:`, error);
    throw error;
  }
};