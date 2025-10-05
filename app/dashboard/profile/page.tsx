"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { User, Mail, Phone, Calendar, CreditCard as Edit2, Save, X } from "lucide-react";
import Image from "next/image";
import { getProfile } from "@/lib/api";

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    bio: "",
  });

  // Fetch profile data from API
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const profileData = await getProfile();
      if (profileData.success) {
        const data = profileData.result;
        setFormData({
          name: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          dateOfBirth: data.date_of_birth || "",
          address: data.address || "",
          bio: data.bio || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = () => {
    console.log("Saving profile data:", formData);
    setIsEditing(false);
    // call API to save changes here
  };

  const handleCancel = () => {
    fetchProfile(); // reset formData to API data
    setIsEditing(false);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center h-[70vh]">
            <p className="text-gray-600 text-lg">Loading profile...</p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-600">Manage your personal information and preferences</p>
            </div>

            {/* {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                <Edit2 className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button onClick={handleSave} className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </button>
                <button onClick={handleCancel} className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200">
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )} */}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Picture & Basic Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-center">
                  {/* <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden bg-gray-200">
                    {user?.avatar ? (
                      <Image src={user.avatar} alt={user.name} width={128} height={128} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                        <User className="h-12 w-12 text-white" />
                      </div>
                    )}
                  </div> */}

                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                      />
                      <button className="text-sm text-blue-600 hover:text-blue-500">Change Photo</button>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{formData.name}</h2>
                      <p className="text-gray-600">Student ID: {user?.id}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Detailed Info */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="h-4 w-4 inline mr-2" />
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{formData.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="h-4 w-4 inline mr-2" />
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{formData.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                      <p className="text-gray-900">{user?.username}</p>
                      <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
