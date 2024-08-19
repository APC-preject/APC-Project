import React, { useState } from 'react';
import GridCell from './LocationGridCell';

const LocationGrid = () => {
    const [clickedCells, setClickedCells] = useState(null);

    const handleCellClick = (row, col) => {
        setClickedCells({ row, col });
    };

    const rows = 15;
    const cols = 10;
    const grid = [];

    for (let row = 1; row <= rows; row++) {
        const rowCells = [];
        for (let col = 1; col <= cols; col++) {
            rowCells.push(
                <GridCell
                    key={`${row}-${col}`}
                    row={row}
                    col={col}
                    onClick={handleCellClick}
                />
            );
        }
        grid.push(
            <div key={row} className="flex">
                {rowCells}
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="flex flex-col">
                {grid}
            </div>
        </div>
    );
};

export default LocationGrid;
