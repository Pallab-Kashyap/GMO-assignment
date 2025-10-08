import axios from "axios";
import type { ArtworkApiResponse } from "../types/artwork";

const API_BASE_URL = "https://api.artic.edu/api/v1";

// Configure axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
});

export const artworkService = {
  /**
   * Fetches artwork data for a specific page
   */
  async fetchArtworks(page: number): Promise<ArtworkApiResponse> {
    try {
      const response = await apiClient.get<ArtworkApiResponse>(
        `/artworks?page=${page}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch artworks: ${error.message}`);
      }
      throw new Error("An unexpected error occurred while fetching artworks");
    }
  },
};
