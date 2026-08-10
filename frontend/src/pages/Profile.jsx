import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfile } from "../services/profileService";
import { useToast } from "../components/ToastProvider";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await getProfile();
      setProfile(response.data);
    } catch (error) {
      toast.notify("Unable to load profile.", "error");
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile(profile);
      toast.notify("Profile updated successfully.", "success");
      setEditing(false);
    } catch (error) {
      toast.notify(error?.response?.data?.detail || "Update failed.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.notify("New passwords do not match.", "error");
      return;
    }
    toast.notify("Password update is not available with the current backend API.", "error");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!profile) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-slate-100 py-20 px-4 text-center text-slate-700">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-purple-700">Profile</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">Account settings</h1>
              <p className="mt-2 text-slate-500">Update your profile information and manage your account.</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-3xl bg-purple-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-800"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-white p-8 shadow-xl">
            <h2 className="text-xl font-semibold text-slate-900">Personal details</h2>
            <div className="mt-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-600">Full name</label>
                <input
                  name="full_name"
                  value={profile.full_name || user?.full_name || ""}
                  onChange={handleChange}
                  disabled={!editing}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600">Email</label>
                <input
                  name="email"
                  value={profile.email || user?.email || ""}
                  disabled
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600">Age group</label>
                <input
                  name="age_group"
                  value={profile.age_group || ""}
                  onChange={handleChange}
                  disabled={!editing}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600">Interests</label>
                <input
                  name="interests"
                  value={profile.interests || ""}
                  onChange={handleChange}
                  disabled={!editing}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setEditing((current) => !current)}
                className="rounded-3xl bg-indigo-600 px-5 py-3 text-white transition hover:bg-indigo-700"
              >
                {editing ? "Cancel" : "Edit profile"}
              </button>
              {editing && (
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="rounded-3xl bg-purple-700 px-5 py-3 text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-xl">
            <h2 className="text-xl font-semibold text-slate-900">Security</h2>
            <p className="mt-3 text-slate-500">Change your account password or manage session settings.</p>

            <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-600">Current password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600">New password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600">Confirm new password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-3xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-800"
              >
                Update password
              </button>
            </form>

            <p className="mt-4 text-sm text-slate-500">Note: The current backend supports profile data updates. Password changes require a dedicated endpoint and will be available when supported.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
