import { useState, useCallback } from "react";
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
  const [manuallyModifiedPages, setManuallyModifiedPages] = useState<
    Set<number>
  >(new Set());

  const selectMultipleRows = async (numRows: number) => {
    if (numRows <= 0) return;

    setLoading(true);

    const config = {
      totalToSelect: numRows,
      startPage: currentPage,
    };

    setSelectionConfig(config);
    setManuallyModifiedPages(new Set());

    const itemsToSelectOnCurrentPage = Math.min(numRows, artworks.length);
    const currentPageSelection = artworks.slice(0, itemsToSelectOnCurrentPage);
    setSelectedArtworks(currentPageSelection);

    setLoading(false);
  };

  const handlePageSelection = useCallback(
    (pageArtworks: Artwork[], pageNumber: number) => {
      if (!selectionConfig) return;

      if (manuallyModifiedPages.has(pageNumber)) return;

      const { totalToSelect, startPage } = selectionConfig;
      const itemsProcessedBefore = (pageNumber - startPage) * rowsPerPage;

      if (itemsProcessedBefore >= totalToSelect) return;
      if (pageNumber < startPage) return;

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
    },
    [selectionConfig, rowsPerPage, manuallyModifiedPages]
  );

  const clearSelection = () => {
    setSelectedArtworks([]);
    setSelectionConfig(null);
    setManuallyModifiedPages(new Set());
  };

  const toggleArtworkSelection = (artwork: Artwork) => {

    if (selectionConfig) {
      setSelectionConfig(null);
    }

    setSelectedArtworks((prev) => {
      const isSelected = prev.some((selected) => selected.id === artwork.id);

      if (isSelected) {
        return prev.filter((selected) => selected.id !== artwork.id);
      } else {
        return [...prev, artwork];
      }
    });
  };

  const isArtworkSelected = (artwork: Artwork) => {
    return selectedArtworks.some((selected) => selected.id === artwork.id);
  };

  const handleDataTableSelectionChange = useCallback(
    (newSelection: Artwork[]) => {

      const currentPageIds = artworks.map((artwork) => artwork.id);

      const selectionsFromOtherPages = selectedArtworks.filter(
        (artwork) => !currentPageIds.includes(artwork.id)
      );

      const newSelectionFromCurrentPage = newSelection.filter((artwork) =>
        currentPageIds.includes(artwork.id)
      );

      if (selectionConfig) {
        const currentPageSelected = selectedArtworks.filter((artwork) =>
          currentPageIds.includes(artwork.id)
        );

        if (
          currentPageSelected.length !== newSelectionFromCurrentPage.length ||
          currentPageSelected.some(
            (artwork) =>
              !newSelectionFromCurrentPage.find(
                (selected) => selected.id === artwork.id
              )
          )
        ) {
          setManuallyModifiedPages((prev) => new Set(prev).add(currentPage));
        }
      }

      const finalSelection = [
        ...selectionsFromOtherPages,
        ...newSelectionFromCurrentPage,
      ];
      setSelectedArtworks(finalSelection);
    },
    [artworks, selectedArtworks, selectionConfig, currentPage]
  );

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
