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

export const createConference = async (
  payload: Record<string, any>
): Promise<number> => {
  try {
    const res = await fetch("http://localhost:5000/conference/create", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || res.statusText);
    }
    return data.conference_id as number;
  } catch (err) {
    console.error("Failed to create conference:", err);
    throw err;
  }
};