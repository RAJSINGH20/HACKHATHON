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
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-stone-50 to-emerald-100 px-4 py-10 sm:px-6">
        <section className="mx-auto max-w-4xl animate-pulse rounded-3xl border border-white/80 bg-white p-6 shadow-xl shadow-green-950/5 sm:p-10">
          <div className="h-4 w-32 rounded bg-stone-200" />
          <div className="mt-3 h-9 w-48 rounded bg-stone-200" />
          <div className="mt-3 h-4 w-72 max-w-full rounded bg-stone-100" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {fields.map(([name]) => (
              <div key={name}>
                <div className="h-4 w-24 rounded bg-stone-200" />
                <div className="mt-3 h-14 rounded-xl bg-stone-100" />
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-stone-50 to-emerald-100 px-4 py-10">
        <section
          role="alert"
          className="w-full max-w-lg rounded-3xl border border-red-100 bg-white p-8 text-center shadow-xl shadow-red-950/5"
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
            Profile unavailable
          </p>
          <p className="mt-2 text-stone-600">{message.text}</p>
          <button
            type="button"
            onClick={() => navigate("/farmer-dashboard")}
            className="mt-6 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-200"
          >
            Back to dashboard
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-stone-50 to-emerald-100 px-4 py-8 text-stone-800 sm:px-6 sm:py-12">
      <section className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/80 bg-white shadow-2xl shadow-green-950/10">
        <div className="border-b border-green-100 bg-gradient-to-r from-green-50 via-white to-emerald-50 px-6 py-7 sm:px-10 sm:py-9">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-700 text-2xl text-white shadow-lg shadow-green-900/20 sm:flex">
                🌾
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-700">
                  Farmer account
                </p>
                <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-green-950 sm:text-4xl">
                  My Profile
                </h1>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Review and update your registered account details.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate("/farmer-dashboard")}
              className="shrink-0 rounded-xl border border-green-200 bg-white px-3 py-2 text-sm font-semibold text-green-800 shadow-sm transition hover:border-green-300 hover:bg-green-50 focus:outline-none focus:ring-4 focus:ring-green-100 sm:px-4"
            >
              Dashboard
            </button>
          </div>
        </div>

        <div className="px-6 py-7 sm:px-10 sm:py-9">
          {message.text && (
            <p
              role="status"
              className={`mb-6 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium ${
                message.type === "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-green-200 bg-green-50 text-green-800"
              }`}
            >
              <span aria-hidden="true">{message.type === "error" ? "!" : "✓"}</span>
              {message.text}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
              {fields.map(([name, label, type]) => (
                <label key={name} className="block text-sm font-semibold text-stone-700">
                  {label}
                  <input
                    type={type}
                    name={name}
                    value={form[name] || ""}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50/70 px-4 py-3.5 text-base font-normal text-stone-800 outline-none transition placeholder:text-stone-400 hover:border-stone-300 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
                  />
                </label>
              ))}
            </div>

            <div className="mt-8 flex flex-col-reverse gap-4 border-t border-stone-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium capitalize text-green-800">
                <span className="h-2 w-2 rounded-full bg-green-600" />
                {profile.role}
              </span>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex min-w-40 items-center justify-center rounded-xl bg-green-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-900/15 transition hover:-translate-y-0.5 hover:bg-green-800 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Farmer_profile;
