import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import TableHeader from './TableHeader';
import ProfileModal from './ProfileModal';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
import { FaEdit, FaTrash } from 'react-icons/fa';

const columnHelper = createColumnHelper();

const columns = (onEditClick, onDeleteClick) => [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: ({ row }) => (
      <div className="flex items-center">
        <img
          src={row.original.profilePicture}
          alt={row.original.name}
          className="w-8 h-8 rounded-full mr-3"
        />
        <span>{row.original.name}</span>
      </div>
    ),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
  }),
  columnHelper.accessor('role', {
    header: 'Role',
  }),
  columnHelper.accessor('email', {
    header: 'Email Address',
  }),
  columnHelper.accessor('teams', {
    header: 'Teams',
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.teams.map((team, index) => (
          <span key={index} className="bg-gray-200 rounded px-2 py-1 text-sm text-gray-800">
            {team}
          </span>
        ))}
      </div>
    ),
  }),
  columnHelper.accessor('actions', {
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex gap-2">
        <button
          className="text-blue-500"
          onClick={() => onEditClick(row.original)}
        >
          <FaEdit />
        </button>
        <button
          className="text-red-500"
          onClick={() => onDeleteClick(row.original._id)}
        >
          <FaTrash />
        </button>
      </div>
    ),
  }),
];

const Table = () => {
  const [data, setData] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get('/members');
      setData(response.data.Members);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEditClick = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await axiosInstance.delete(`/members/${id}`);
      fetchData(); // Refresh the data
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  const handleUpdate = async (updatedMember) => {
    try {
      await axiosInstance.put(`/members/${updatedMember._id}`, updatedMember);
      setIsModalOpen(false);
      fetchData(); // Refresh the data
    } catch (error) {
      console.error('Error updating member:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const table = useReactTable({
    data,
    columns: columns(handleEditClick, handleDeleteClick),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col">
      <TableHeader refreshTable={fetchData} />
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
      {isModalOpen && (
        <ProfileModal
          member={selectedMember}
          onClose={() => setIsModalOpen(false)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
};

export default Table;


