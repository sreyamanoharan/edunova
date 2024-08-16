import React from 'react';
import TableHeader from './TableHeader';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor('column1', {
    header: 'Column 1',
  }),
  columnHelper.accessor('column2', {
    header: 'Column 2',
  }),
  columnHelper.accessor('column3', {
    header: 'Column 3',
  }),
  columnHelper.accessor('column4', {
    header: 'Column 4',
  }),
  columnHelper.accessor('column5', {
    header: 'Column 5',
  }),
];

const data = [
  { column1: 'Row 1 Col 1', column2: 'Row 1 Col 2', column3: 'Row 1 Col 3', column4: 'Row 1 Col 4', column5: 'Row 1 Col 5' },
  { column1: 'Row 2 Col 1', column2: 'Row 2 Col 2', column3: 'Row 2 Col 3', column4: 'Row 2 Col 4', column5: 'Row 2 Col 5' },
  { column1: 'Row 3 Col 1', column2: 'Row 3 Col 2', column3: 'Row 3 Col 3', column4: 'Row 3 Col 4', column5: 'Row 3 Col 5' },
  { column1: 'Row 4 Col 1', column2: 'Row 4 Col 2', column3: 'Row 4 Col 3', column4: 'Row 4 Col 4', column5: 'Row 4 Col 5' },
  { column1: 'Row 5 Col 1', column2: 'Row 5 Col 2', column3: 'Row 5 Col 3', column4: 'Row 5 Col 4', column5: 'Row 5 Col 5' },
];

const Table = () => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
    <div className='flex flex-col'>
    <TableHeader />
        <table className="min-w-full border border-gray-200">
      <thead className="bg-gray-100">
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id} className="border border-gray-300 p-2">
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id} className="border border-gray-300 p-2">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
   
    </>

  );
};

export default Table;
