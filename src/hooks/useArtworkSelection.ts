import { useState } from "react";
import type { Artwork } from "../types/artwork";

export const useArtworkSelection = (
  artworks: Artwork[],
  currentPage: number,
  rowsPerPage: number,
  _totalRecords: number,
  setLoading: (loading: boolean) => void
) => {
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
  const [selectionConfig, setSelectionConfig] = useState<{
    totalToSelect: number;
    startPage: number;
  } | null>(null);


  const selectMultipleRows = async (numRows: number) => {
    if (numRows <= 0) return;

    setLoading(true);

    const config = {
      totalToSelect: numRows,
      startPage: currentPage,
    };

    setSelectionConfig(config);

    const itemsToSelectOnCurrentPage = Math.min(numRows, artworks.length);
    const currentPageSelection = artworks.slice(0, itemsToSelectOnCurrentPage);
    setSelectedArtworks(currentPageSelection);

    setLoading(false);
  };


  const handlePageSelection = (pageArtworks: Artwork[], pageNumber: number) => {
    if (!selectionConfig) return;

    const { totalToSelect, startPage } = selectionConfig;

    const itemsProcessedBefore = (pageNumber - startPage) * rowsPerPage;

    if (itemsProcessedBefore >= totalToSelect) {
      return;
    }

    if (pageNumber < startPage) {
      return;
    }

    const itemsToSelectOnPage = Math.min(
      totalToSelect - itemsProcessedBefore,
      pageArtworks.length
    );

    if (itemsToSelectOnPage > 0) {
      const pageSelection = pageArtworks.slice(0, itemsToSelectOnPage);

      setSelectedArtworks((prev) => {
        const filteredPrev = prev.filter(
          (artwork) =>
            !pageArtworks.some((pageArt) => pageArt.id === artwork.id)
        );
        return [...filteredPrev, ...pageSelection];
      });
    }
  };

  const clearSelection = () => {
    setSelectedArtworks([]);
    setSelectionConfig(null);
  };

  const toggleArtworkSelection = (artwork: Artwork) => {
    setSelectedArtworks((prev) => {
      const isSelected = prev.some((selected) => selected.id === artwork.id);
      if (isSelected) {

        if (selectionConfig) {
          setSelectionConfig(null);
        }
        return prev.filter((selected) => selected.id !== artwork.id);
      } else {
        return [...prev, artwork];
      }
    });
  };

  const isArtworkSelected = (artwork: Artwork) => {
    return selectedArtworks.some((selected) => selected.id === artwork.id);
  };

  const handleDataTableSelectionChange = (newSelection: Artwork[]) => {

    if (newSelection.length < selectedArtworks.length && selectionConfig) {
      setSelectionConfig(null);
    }

    setSelectedArtworks(newSelection);
  };

  return {
    selectedArtworks,
    selectMultipleRows,
    clearSelection,
    toggleArtworkSelection,
    isArtworkSelected,
    handlePageSelection,
    handleDataTableSelectionChange,
    selectionConfig,
  };
};
