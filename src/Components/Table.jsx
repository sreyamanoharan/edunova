import React, { useState, useEffect } from 'react';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
import axiosInstance from '../api/axios';
import TableHeader from './TableHeader';
import EditModal from './EditModal';
import ConfirmationModal from './ConfirmationModal';
import PersonalInfoModal from './PersonalInfoModal';
import { FaEdit, FaTrash } from 'react-icons/fa';

const columnHelper = createColumnHelper();

const columns = (onEditClick, onDeleteClick, onRowClick) => [
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
      <div
        className="flex gap-2"
        data-column="actions"
      >
        <button
          className="text-gray-500"
          onClick={(e) => {
            e.stopPropagation();
            onEditClick(row.original);
          }}
        >
          <FaEdit />
        </button>
        <button
          className="text-gray-500"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteClick(row.original._id);
          }}
        >
          <FaTrash />
        </button>
      </div>
    ),
  }),
];

const Table = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [filter, setFilter] = useState({ role: null, teams: [] });
  const [isPersonalInfoModalOpen, setIsPersonalInfoModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get('/members');
      setData(response.data.Members);
      setFilteredData(response.data.Members); // Initialize filtered data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = data.filter((member) => {
      const searchMatch = Object.values(member).some((value) =>
        String(value).toLowerCase().includes(lowercasedQuery)
      );

      const roleMatch = filter.role ? member.role === filter.role : true;
      const teamsMatch = filter.teams.length > 0 ? filter.teams.some(team => member.teams.includes(team)) : true;

      return searchMatch && roleMatch && teamsMatch;
    });
    setFilteredData(filtered);
  }, [searchQuery, filter, data]);

  const handleEditClick = (member) => {
    setSelectedMember(member);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setMemberToDelete(id);
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(`/members/${memberToDelete}`);
      setIsConfirmationModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  const handleUpdate = async (updatedMember) => {
    try {
      await axiosInstance.put(`/members/${updatedMember._id}`, updatedMember);
      setIsEditModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error updating member:', error);
    }
  };

  const handleRowClick = (e, member) => {
    // Check if the click was inside an element with the data-column="actions"
    if (!e.target.closest('[data-column="actions"]')) {
      setSelectedMember(member);
      setIsPersonalInfoModalOpen(true);
    }
  };

  const table = useReactTable({
    data: filteredData, // Use filtered data here
    columns: columns(handleEditClick, handleDeleteClick, handleRowClick),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col w-full">
      <TableHeader
        refreshTable={fetchData}
        onSearchChange={setSearchQuery}
        onFilterChange={setFilter}
        memberCount={filteredData.length}
      />
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="border border-gray-300 p-2 text-gray-700">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr
              key={row.id}
              className="border-b border-gray-300 cursor-pointer hover:bg-gray-100"
              onClick={(e) => handleRowClick(e, row.original)}
            >
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="border border-gray-300 p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {isEditModalOpen && (
        <EditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          member={selectedMember}
          onSave={handleUpdate}
        />
      )}
      {isConfirmationModalOpen && (
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={() => setIsConfirmationModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
      {isPersonalInfoModalOpen && (
        <PersonalInfoModal
          member={selectedMember}
          onClose={() => setIsPersonalInfoModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Table;
