import { useState, useRef, useEffect } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TABLE_CONSTANTS } from "../constants/table";

interface SelectionHeaderProps {
  totalRecords: number;
  onSelectRows: (numRows: number) => void;
}

export const SelectionHeader = ({
  totalRecords,
  onSelectRows,
}: SelectionHeaderProps) => {
  const [rowsToSelect, setRowsToSelect] = useState<number | null>(null);
  const [overlayVisible, setOverlayVisible] = useState<boolean>(false);
  const overlayRef = useRef<OverlayPanel>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (overlay) {
      const handleShow = () => setOverlayVisible(true);
      const handleHide = () => setOverlayVisible(false);

      overlay.getElement()?.addEventListener("show", handleShow);
      overlay.getElement()?.addEventListener("hide", handleHide);

      return () => {
        overlay.getElement()?.removeEventListener("show", handleShow);
        overlay.getElement()?.removeEventListener("hide", handleHide);
      };
    }
  }, []);

  const handleSelectRows = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (rowsToSelect && rowsToSelect > 0) {
      await onSelectRows(rowsToSelect);
      overlayRef.current?.hide();
      setOverlayVisible(false);
      setRowsToSelect(null);
    }
  };

  const toggleOverlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (overlayRef.current) {
      overlayRef.current.toggle(e);
    }
  };

  return (
    <div className="relative w-full">
      <button
        onClick={toggleOverlay}
        className="absolute bg-transparent border-none cursor-pointer flex items-center p-0.5 z-10"
        style={{
          left: `${TABLE_CONSTANTS.CHECKBOX_WIDTH}px`,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        {overlayVisible ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      <OverlayPanel ref={overlayRef}>
        <div className="p-4 min-w-[200px]">
          <div className="mb-3">
            <label htmlFor="rowsInput" className="block mb-1">
              Number of rows to select:
            </label>
            <InputNumber
              id="rowsInput"
              value={rowsToSelect}
              onValueChange={(e) => setRowsToSelect(e.value ?? null)}
              min={1}
              max={totalRecords}
              placeholder="Enter number of rows"
              className="w-full"
            />
          </div>
          <Button
            label="Select Rows"
            onClick={handleSelectRows}
            className="w-full"
            type="button"
          />
        </div>
      </OverlayPanel>
    </div>
  );
};
