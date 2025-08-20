import React, { useState, useEffect } from 'react';
import { User, Edit, Save, X } from 'lucide-react';
import axios from 'axios';

interface UserProfileProps {
  onLogout: () => void;
}

interface UserData {
  name: string;
  email: string;
  avatarUrl: string;
  badge: string;
  joinDate: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ onLogout }) => {
  const [user, setUser] = useState<UserData>({
    name: 'User',
    email: 'user@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    badge: 'Plant Enthusiast',
    joinDate: new Date().toLocaleDateString(),
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // For now, we'll simulate user data
        // In a real app, you'd fetch this from your backend
        const userData = {
          name: 'Plant Lover',
          email: 'plantlover@cultiva.com',
          avatarUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
          badge: 'Plant Enthusiast',
          joinDate: 'January 2024',
        };

        setUser(userData);
        setEditForm({
          name: userData.name,
          email: userData.email,
        });
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSave = async () => {
    try {
      // In a real app, you'd send this to your backend
      setUser(prev => ({
        ...prev,
        name: editForm.name,
        email: editForm.email,
      }));
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: user.name,
      email: user.email,
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-green-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-green-700 flex items-center gap-2">
          <User className="w-5 h-5" />
          Profile
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 rounded-lg hover:bg-green-50 text-green-600"
          >
            <Edit className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 mb-6">
        <img
          src={user.avatarUrl}
          alt={user.name}
          className="w-16 h-16 rounded-full border-2 border-green-400 object-cover"
        />
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Name"
              />
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Email"
              />
            </div>
          ) : (
            <div>
              <h3 className="font-semibold text-gray-800">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
              <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full mt-1">
                {user.badge}
              </span>
            </div>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Member since:</span> {user.joinDate}
          </div>
          <button
            onClick={onLogout}
            className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition border border-red-200"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile; 