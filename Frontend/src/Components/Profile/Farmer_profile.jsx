import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const fields = [
  ["name", "Name", "text"],
  ["mobile", "Mobile", "tel"],
  ["aadhaar", "Aadhaar", "text"],
  ["village", "Village", "text"],
  ["district", "District", "text"],
  ["state", "State", "text"],
];

const Farmer_profile = () => {
  const navigate = useNavigate();
  const { users, updateAuthenticatedUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!users.farmer?.id) {
      navigate("/farmer-login", { replace: true });
      return;
    }

    axios
      .get(`${API_URL}/api/auth/farmer/${users.farmer.id}`)
      .then(({ data }) => {
        setProfile(data.user);
        setForm(data.user);
      })
      .catch((error) => {
        setMessage({
          type: "error",
          text: error.response?.data?.message || "Unable to load your profile.",
        });
      })
      .finally(() => setLoading(false));
  }, [navigate, users.farmer?.id]);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const { data } = await axios.put(
        `${API_URL}/api/auth/farmer/${profile._id}`,
        form
      );
      setProfile(data.user);
      setForm(data.user);
      updateAuthenticatedUser("farmer", {
        id: data.user._id,
        name: data.user.name,
        mobile: data.user.mobile,
        role: data.user.role,
      });
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Unable to update your profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-stone-50 p-8 text-stone-600">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="min-h-screen bg-stone-50 p-8 text-red-700">{message.text}</div>;
  }

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10 text-stone-800">
      <section className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-lg sm:p-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-green-700">Farmer account</p>
            <h1 className="mt-1 font-serif text-3xl text-green-950">My Profile</h1>
            <p className="mt-2 text-sm text-stone-500">Your details are loaded from the database.</p>
          </div>
          <button type="button" onClick={() => navigate("/farmer-dashboard")} className="text-sm font-semibold text-green-700 hover:underline">
            Dashboard
          </button>
        </div>

        {message.text && (
          <p className={`mb-4 rounded-lg px-4 py-3 text-sm ${message.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
            {message.text}
          </p>
        )}

        <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
          {fields.map(([name, label, type]) => (
            <label key={name} className="text-sm font-semibold text-stone-700">
              {label}
              <input
                type={type}
                name={name}
                value={form[name] || ""}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-3 font-normal outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </label>
          ))}

          <div className="flex items-center justify-between border-t border-stone-200 pt-5 sm:col-span-2">
            <span className="text-sm text-stone-500">Role: {profile.role}</span>
            <button type="submit" disabled={saving} className="rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60">
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Farmer_profile;
