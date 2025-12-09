import React from 'react';
import { Edit2, Save, X } from 'lucide-react';
import { isAdmin } from '../utils/auth';

const TeamMemberCard = ({ 
  name, 
  role, 
  image, 
  onEdit, 
  onEditText, 
  isEditing, 
  editName, 
  editRole, 
  setEditName, 
  setEditRole, 
  onSave, 
  onCancel 
}) => {

  return (
    <div className="border border-gray-300 p-6 flex flex-col items-center text-center h-100 justify-center relative">
      <div className="relative">
        <img 
          src={image || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2a5a82&color=fff&size=200`}
          alt={name}
          className="w-50 h-50 rounded-full mb-4 object-cover"
        />
        {isAdmin() && (
          <button
            onClick={() => onEdit && onEdit(name)}
            className="absolute top-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-md"
            title="Edit Photo"
          >
            <Edit2 size={16} />
          </button>
        )}
      </div>
      
      {isEditing ? (
        <div className="w-full space-y-3">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full text-xl font-semibold text-gray-900 text-center border border-gray-300 rounded px-2 py-1"
          />
          <input
            type="text"
            value={editRole}
            onChange={(e) => setEditRole(e.target.value)}
            className="w-full text-gray-600 text-center border border-gray-300 rounded px-2 py-1"
          />
          <div className="flex gap-2 justify-center">
            <button
              onClick={onSave}
              className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition-colors"
              title="Save"
            >
              <Save size={16} />
            </button>
            <button
              onClick={onCancel}
              className="bg-gray-600 text-white p-2 rounded hover:bg-gray-700 transition-colors"
              title="Cancel"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
          <p className="text-gray-600">{role}</p>
          {isAdmin() && (
            <button
              onClick={() => onEditText && onEditText({ name, role })}
              className="absolute -top-2 -right-2 bg-green-600 text-white p-1 rounded-full hover:bg-green-700 transition-colors shadow-md"
              title="Edit Text"
            >
              <Edit2 size={12} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamMemberCard;
