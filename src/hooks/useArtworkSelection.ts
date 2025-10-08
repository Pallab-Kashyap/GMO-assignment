import { useState } from "react";
import type { Artwork } from "../types/artwork";
import { artworkService } from "../services/artworkService";

export const useArtworkSelection = (
  artworks: Artwork[],
  currentPage: number,
  rowsPerPage: number,
  totalRecords: number,
  setLoading: (loading: boolean) => void
) => {
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);

  /**
   * Selects multiple rows starting from current page, then proceeds to next/previous pages
   */
  const selectMultipleRows = async (numRows: number) => {
    if (numRows <= 0) return;

    setLoading(true);
    const allSelectedArtworks: Artwork[] = [];
    let currentPageToFetch = currentPage;
    let remainingRows = numRows;
    const totalPages = Math.ceil(totalRecords / rowsPerPage);

    // Forward selection from current page
    while (remainingRows > 0 && currentPageToFetch <= totalPages) {
      try {
        let pageData;
        if (currentPageToFetch === currentPage) {
          pageData = artworks; // Use already loaded data
        } else {
          const data = await artworkService.fetchArtworks(currentPageToFetch);
          pageData = data.data;
        }

        const rowsToTakeFromPage = Math.min(remainingRows, pageData.length);
        allSelectedArtworks.push(...pageData.slice(0, rowsToTakeFromPage));

        remainingRows -= rowsToTakeFromPage;
        currentPageToFetch++;
      } catch (error) {
        console.error("Error fetching data for selection:", error);
        break;
      }
    }

    // Backward selection if needed
    if (remainingRows > 0 && currentPage > 1) {
      currentPageToFetch = currentPage - 1;
      while (remainingRows > 0 && currentPageToFetch >= 1) {
        try {
          const data = await artworkService.fetchArtworks(currentPageToFetch);
          const rowsToTakeFromPage = Math.min(remainingRows, data.data.length);

          // Add to beginning since we're going backwards
          allSelectedArtworks.unshift(...data.data.slice(-rowsToTakeFromPage));

          remainingRows -= rowsToTakeFromPage;
          currentPageToFetch--;
        } catch (error) {
          console.error("Error fetching data for selection:", error);
          break;
        }
      }
    }

    setSelectedArtworks(allSelectedArtworks);
    setLoading(false);
  };

  return {
    selectedArtworks,
    setSelectedArtworks,
    selectMultipleRows,
  };
};
