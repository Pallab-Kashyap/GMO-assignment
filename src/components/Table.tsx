import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import type { PaginatorPageChangeEvent } from "primereact/paginator";
import type { Artwork } from "../types/artwork";
import { useArtworkData, useArtworkSelection } from "../hooks";
import { SelectionHeader } from "./SelectionHeader";
import { COLUMN_WIDTHS } from "../constants/table";

const Table = () => {
  // Data management hook
  const {
    artworks,
    loading,
    totalRecords,
    currentPage,
    rowsPerPage,
    loadData,
    setLoading,
  } = useArtworkData();

  // Selection logic hook
  const { selectedArtworks, setSelectedArtworks, selectMultipleRows } =
    useArtworkSelection(
      artworks,
      currentPage,
      rowsPerPage,
      totalRecords,
      setLoading
    );

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    const page = Math.floor(event.first / event.rows) + 1;
    window.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scroll to top
    loadData(page);
  };

  return (
    <div className="relative m-4 md:m-6 lg:m-8">
      <DataTable
        value={artworks}
        loading={loading}
        emptyMessage="No artworks found"
        selection={selectedArtworks}
        onSelectionChange={(e) => setSelectedArtworks(e.value as Artwork[])}
        dataKey="id"
        selectionMode="multiple"
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: COLUMN_WIDTHS.SELECTION }}
          header={() => (
            <SelectionHeader
              totalRecords={totalRecords}
              onSelectRows={selectMultipleRows}
            />
          )}
        />
        <Column
          field="title"
          header="Title"
          style={{ width: COLUMN_WIDTHS.TITLE }}
        />
        <Column
          field="place_of_origin"
          header="Place of Origin"
          style={{ width: COLUMN_WIDTHS.PLACE_OF_ORIGIN }}
        />
        <Column
          field="artist_display"
          header="Artist"
          style={{ width: COLUMN_WIDTHS.ARTIST }}
        />
        <Column
          field="inscriptions"
          header="Inscriptions"
          style={{ width: COLUMN_WIDTHS.INSCRIPTIONS }}
        />
        <Column
          field="date_start"
          header="Date Start"
          style={{ width: COLUMN_WIDTHS.DATE_START }}
        />
        <Column
          field="date_end"
          header="Date End"
          style={{ width: COLUMN_WIDTHS.DATE_END }}
        />
      </DataTable>
      <div
        className={`${
          loading
            ? "pointer-events-none opacity-60"
            : "pointer-events-auto opacity-100"
        }`}
      >
        <Paginator
          first={(currentPage - 1) * rowsPerPage}
          rows={rowsPerPage}
          totalRecords={totalRecords}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default Table;
