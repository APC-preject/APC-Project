import React from 'react';

const LocationGridCell = ({ row, col, onClick, clickCell, invalidCell }) => {
  return (invalidCell ? (
      <div
        onClick={() => onClick(row, col)}
        className={"h-10 border border-gray-300 flex items-center justify-center bg-hov hover:bg-hov transition-colors duration-300 "}
        style={{ width: '50px' }}
      >
        {`${row}, ${col}`}
      </div>
    ) : (
      <div
        onClick={() => onClick(row, col)}
        className={"h-10 border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray transition-colors duration-300 "
          + (clickCell && clickCell.row === row && clickCell.col === col ? "bg-hov2" : "")
        }
        style={{ width: '50px' }}
      >
        {`${row}, ${col}`}
      </div >
    )
  );
};

export default LocationGridCell;
