import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const fields = [
  { name: "name", label: "Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "mobile", label: "Mobile", type: "tel" },
  { name: "department", label: "Department", type: "text" },
  { name: "adminId", label: "Admin ID", type: "text" },
];

const AdminProfile = () => {
  const navigate = useNavigate();
  const { users, updateAuthenticatedUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!users.admin?.id) {
      navigate("/admin-login", { replace: true });
      return;
    }

    const loadProfile = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/auth/admin/${users.admin.id}`
        );
        const user = response.data.user;
        setProfile(user);
        setForm({
          name: user.name || "",
          email: user.email || "",
          mobile: user.mobile || "",
          department: user.department || "",
          adminId: user.adminId || "",
        });
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate, users.admin?.id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await axios.put(
        `${API_URL}/api/auth/admin/${profile._id}`,
        form
      );
      const user = response.data.user;
      setProfile(user);
      setForm({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
        department: user.department || "",
        adminId: user.adminId || "",
      });
      updateAuthenticatedUser("admin", {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
      setSuccess("Profile updated successfully.");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-stone-50 p-8 text-stone-600">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="min-h-screen bg-stone-50 p-8 text-red-700">{error}</div>;
  }

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10 text-stone-800">
      <section className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-lg sm:p-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-green-700">Admin account</p>
            <h1 className="mt-1 font-serif text-3xl text-green-950">My Profile</h1>
            <p className="mt-2 text-sm text-stone-500">Your details are loaded from the database.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/admin-dashboard")}
            className="text-sm font-semibold text-green-700 hover:underline"
          >
            Dashboard
          </button>
        </div>

        {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {success && <p className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map((field) => (
            <label key={field.name} className="block text-sm font-semibold text-stone-700">
              {field.label}
              <input
                type={field.type}
                name={field.name}
                value={form[field.name] || ""}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-3 font-normal outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </label>
          ))}

          <div className="flex items-center justify-between border-t border-stone-200 pt-5">
            <span className="text-sm text-stone-500">Role: {profile.role}</span>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default AdminProfile;
