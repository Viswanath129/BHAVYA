import React, { useState, useEffect } from 'react';
import { Icon } from '../components/Icon';
import { api } from '../api';

export const Profile: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({
        name: "",
        email: "",
        bio: "",
        location: ""
    });

    const [formData, setFormData] = useState(user);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await api.getProfile();
                const profileData = {
                    name: data.full_name || data.username,
                    email: data.email || "",
                    bio: data.bio || "",
                    location: data.location || ""
                };
                setUser(profileData);
                setFormData(profileData);
            } catch (error) {
                console.error("Failed to load profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        try {
            await api.updateProfile({
                full_name: formData.name,
                email: formData.email,
                bio: formData.bio,
                location: formData.location
            });
            setUser(formData);
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            alert("Failed to update profile.");
            console.error(error);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Profile...</div>;

    return (
        <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8">
            <header className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Account Profile</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your personal information and preferences.</p>
                </div>
                <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${isEditing ? 'bg-primary text-slate-900 hover:brightness-110 shadow-lg shadow-primary/20' : 'bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 hover:bg-slate-50'}`}
                >
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
            </header>

            <div className="bg-white dark:bg-card-dark rounded-2xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="relative group">
                        <div className="size-32 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-800">
                            <img src="https://picsum.photos/id/64/200/200" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <button className="absolute bottom-0 right-0 p-2 bg-primary text-slate-900 rounded-full shadow-lg hover:scale-105 transition-transform">
                            <Icon name="photo_camera" className="text-lg" />
                        </button>
                    </div>

                    <div className="flex-1 w-full space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Full Name</label>
                                <input
                                    name="full_name"
                                    type="text"
                                    disabled={!isEditing}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={`w-full p-3 rounded-xl border transition-all 
                                        ${isEditing
                                            ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary/50'
                                            : 'bg-slate-50 dark:bg-slate-800/50 border-transparent cursor-default text-slate-600 dark:text-slate-400'
                                        }`}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    disabled={!isEditing}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={`w-full p-3 rounded-xl border transition-all 
                                        ${isEditing
                                            ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary/50'
                                            : 'bg-slate-50 dark:bg-slate-800/50 border-transparent cursor-default text-slate-600 dark:text-slate-400'
                                        }`}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Location</label>
                                <input
                                    name="location"
                                    type="text"
                                    disabled={!isEditing}
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className={`w-full p-3 rounded-xl border transition-all 
                                        ${isEditing
                                            ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary/50'
                                            : 'bg-slate-50 dark:bg-slate-800/50 border-transparent cursor-default text-slate-600 dark:text-slate-400'
                                        }`}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Bio</label>
                            <textarea
                                disabled={!isEditing}
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className={`w-full p-3 rounded-xl border transition-all h-24 resize-none
                                    ${isEditing
                                        ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary/50'
                                        : 'bg-slate-50 dark:bg-slate-800/50 border-transparent cursor-default text-slate-600 dark:text-slate-400'
                                    }`}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-lg mb-4">Privacy & Security</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <Icon name="lock" className="text-slate-400" />
                                <span className="text-sm font-medium">Change Password</span>
                            </div>
                            <Icon name="chevron_right" className="text-slate-300" />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <Icon name="visibility_off" className="text-slate-400" />
                                <span className="text-sm font-medium">Data Visibility</span>
                            </div>
                            <Icon name="chevron_right" className="text-slate-300" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-lg mb-4">App Preferences</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <Icon name="notifications" className="text-slate-400" />
                                <span className="text-sm font-medium">Notifications</span>
                            </div>
                            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                                <label htmlFor="toggle" className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer"></label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
