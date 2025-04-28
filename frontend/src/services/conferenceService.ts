import { Conference } from "../models/conference";

export const getAllConferences = async (): Promise<Conference[]> => {
  try {
    const response = await fetch("http://127.0.0.1:5000/conference/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching conferences: ${response.statusText}`);
    }

    const data = await response.json();
    return data.conferences as Conference[];
  } catch (error) {
    console.error("Failed to fetch conferences:", error);
    throw error;
  }
};