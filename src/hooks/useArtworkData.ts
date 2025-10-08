import { useState, useEffect } from "react";
import type { Artwork, ArtworkApiResponse } from "../types/artwork";
import { artworkService } from "../services/artworkService";
import { TABLE_CONSTANTS } from "../constants/table";

export const useArtworkData = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(
    TABLE_CONSTANTS.INITIAL_PAGE
  );
  const [rowsPerPage, setRowsPerPage] = useState<number>(12);

  const loadData = async (page: number) => {
    setLoading(true);
    try {
      const data: ArtworkApiResponse = await artworkService.fetchArtworks(page);

      setArtworks(data.data);
      setTotalRecords(data.pagination.total);
      setRowsPerPage(data.pagination.limit);
      setCurrentPage(data.pagination.current_page);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(TABLE_CONSTANTS.INITIAL_PAGE);
  }, []);

  return {
    artworks,
    loading,
    totalRecords,
    currentPage,
    rowsPerPage,
    loadData,
    setLoading,
  };
};
