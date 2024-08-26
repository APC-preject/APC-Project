import React, { useEffect, useState } from 'react';
import GridCell from '../components/ReleaseLocationGridCell';
import ReleaseLocationGridCell from '../components/ReleaseLocationGridCell';

const ReleaseLocationModal = ({ onClose, quantity }) => {
    const [clickedCells, setClickedCells] = useState(null);

    const handleCellClick = (row, col) => {
        setClickedCells({ row, col });
    };

    const rows = 15;
    const cols = 4;
    const gridL = [];
    const gridR = [];
    for (let row = 1; row <= rows; row++) {
        const rowCells = [];
        for (let col = 1; col <= cols; col++) {
            rowCells.push(
                <ReleaseLocationGridCell
                    key={`${row}-${col}`}
                    row={row}
                    col={col}
                    clickCell={clickedCells}
                    invalidCell={false}
                    quantity={quantity}
                    onClick={handleCellClick}
                />
            );
        }
        gridL.push(
            <div key={row} className="flex">
                {rowCells}
            </div>
        );
    }

    for (let row = 1; row <= rows; row++) {
      const rowCells = [];
      for (let col = cols + 1; col <= cols + cols; col++) {
          rowCells.push(
              <ReleaseLocationGridCell
                  key={`${row}-${col}`}
                  row={row}
                  col={col}
                  clickCell={clickedCells}
                  invalidCell={false}
                  quantity={quantity}
                  onClick={handleCellClick}
              />
          );
      }
      gridR.push(
          <div key={row} className="flex">
              {rowCells}
          </div>
      );
    }

    const handleCloseButton = () => {
      if (clickedCells)
        onClose({x: clickedCells.row, y: clickedCells.col});
      else {
        onClose(null);
      }
    }

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto min-w-full">
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 opacity-75"></div>
            </div>
            <div className="relative bg-sub border border-bor rounded-lg p-8 mx-auto">
              <div className="flex items-center justify-center bg-gray-100 mb-5">
                  <div className="flex flex-col m-1">
                      {gridL}
                  </div>
                  <div className="flex flex-col m-1">
                      {gridR}
                  </div>
              </div>
              <div className="text-lg my-5">
                선택된 위치: {clickedCells ? `[ ${clickedCells.row}열 ${clickedCells.col}번 ]` : "not selected"}
              </div>
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-button text-white rounded hover:bg-red-600 focus:outline-none focus:bg-red-600"
                  onClick={handleCloseButton}
                  type='button'
                >
                  선택
                </button>
              </div>
            </div>
          </div>
        </div>
    );
};

export default ReleaseLocationModal;
