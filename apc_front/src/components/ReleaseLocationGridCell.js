import React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';


const ReleaseLocationGridCell = ({ row, col, onClick, clickCell, invalidCell, quantity }) => {
  const gradeSet = [1, 2, 3, 4, 5, 6, 7];
  const [remain, setRemain] = useState(gradeSet.reduce((acc, cur) => {
    acc[cur] = 0;
    return acc;
  }, {}));

  useEffect(() => {
    async function init() {
      try {
        const response = await fetch(`/api/stock/place/${row}/${col}`, {
          method: 'GET',
        })
        if (!response.ok) {
          throw new Error('network response Error');
        }
        const remainData = await response.json();
        setRemain(gradeSet.reduce((acc, cur) => {
          acc[cur] = remainData[cur] || 0;
          return acc;
        }, {}));
      } catch (error) {
        console.log(error);
      }
    }
    init();
  }, []);

  return ((gradeSet.filter(e => (quantity[e])).some(e => { return (parseInt(remain[e]) < parseInt(quantity[e])); }))
    ? (
      <div
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

export default ReleaseLocationGridCell;
