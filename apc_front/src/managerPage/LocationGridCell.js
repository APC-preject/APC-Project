import React from 'react';

const LocationGridCell = ({ row, col, onClick }) => {
    return (
        <div
            onClick={() => onClick(row, col)}
            className="h-10 border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-hov transition-colors duration-300"
            style={{ width: '50px' }}
        >
            {`${row}, ${col}`}
        </div>
    );
};

export default LocationGridCell;
