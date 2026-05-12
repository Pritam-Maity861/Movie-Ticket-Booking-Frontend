import React, { useState, useRef } from "react";
import { useAuthStore } from "../store/auth-store";
import { updateProfileApi, updatePasswordApi } from "../services/api/auth-ep";
import {
  User,
  Mail,
  Camera,
  Save,
  LogOut,
  ShieldCheck,
  Ticket,
  Lock,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, setUser, logOut } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [previewImage, setPreviewImage] = useState<string | null>(
    user?.profilePic || null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (fileInputRef.current?.files?.[0]) {
        formData.append("profilePicUrl", fileInputRef.current.files[0]);
      }

      const response = await updateProfileApi(formData);
      setUser(response.data);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("New passwords do not match");
    }

    if (passwordData.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setPassLoading(true);
    try {
      await updatePasswordApi({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password updated successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setPassLoading(false);
    }
  };

  const handleLogout = async () => {
    logOut();
    navigate("/");
    toast.success("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <div className="relative inline-block group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 bg-white/5 mx-auto">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={64} className="text-white/20" />
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-white shadow-lg cursor-pointer transform transition group-hover:scale-110"
              >
                <Camera size={18} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
            </div>
            <h2 className="mt-4 text-xl font-bold">{user?.name}</h2>
            <p className="text-white/40 text-sm">{user?.email}</p>
            <div className="mt-3 inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase tracking-tighter">
              <ShieldCheck size={10} />
              {user?.role}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <button
              onClick={() => navigate("/my-bookings")}
              className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors text-left cursor-pointer"
            >
              <Ticket size={20} className="text-primary" />
              <span className="font-medium">My Bookings</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-4 hover:bg-red-500/10 transition-colors text-left text-red-500 border-t border-white/5 cursor-pointer"
            >
              <LogOut size={20} />
              <span className="font-medium">Log out</span>
            </button>
          </div>
        </div>

        {/* Main Sections */}
        <div className="md:col-span-2 space-y-8">
          {/* Edit Profile Section */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <User className="text-primary" />
              Edit Profile
            </h3>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                    size={20}
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-primary/50 focus:outline-none transition-colors"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                    size={20}
                  />
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 opacity-50 cursor-not-allowed"
                  />
                </div>
                <p className="text-[10px] text-white/30 italic">
                  Email cannot be changed.
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-8 py-3 bg-primary hover:bg-primary-dull text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save size={20} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Section */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Lock className="text-primary" />
              Security
            </h3>

            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">
                  Current Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                    size={20}
                  />
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-primary/50 focus:outline-none transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                      size={20}
                    />
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-primary/50 focus:outline-none transition-colors"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                      size={20}
                    />
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-primary/50 focus:outline-none transition-colors"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={passLoading}
                  className="w-full md:w-auto px-8 py-3 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {passLoading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Lock size={20} />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
