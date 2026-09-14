import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { CheckCircle2, MapPin, Phone, QrCode, ShieldCheck } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const FarmerQrPage = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const [farmer, setFarmer] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const farmerId = searchParams.get("farmerId");

    if (!farmerId || !bookingId) {
      setError("This farmer QR link is incomplete.");
      return;
    }

    axios
      .get(`${API_URL}/api/auth/farmer/verify/${farmerId}`)
      .then(({ data }) => setFarmer(data.farmer))
      .catch((requestError) => {
        setError(
          requestError.response?.data?.message ||
            "Unable to verify this farmer QR link."
        );
      });
  }, [bookingId, searchParams]);

  return (
    <main className="farmer-qr-page min-h-screen px-4 py-8 text-stone-800 sm:px-6">
      <section className="farmer-qr-shell mx-auto max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex h-2">
          <span className="flex-1 bg-orange-500" />
          <span className="flex-1 bg-white" />
          <span className="flex-1 bg-green-700" />
        </div>

        <div className="border-b border-stone-200 px-6 py-7 text-center sm:px-10">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-900 text-white shadow-lg">
            <QrCode size={32} />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-green-700">Fasal Setu</p>
          <h1 className="mt-2 font-serif text-3xl text-green-950">Farmer verification page</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-stone-500">
            Show this page to the authorised procurement centre operator to verify the pending booking.
          </p>
        </div>

        <div className="px-6 py-7 sm:px-10">
          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          {!farmer && !error && (
            <p className="rounded-xl bg-stone-50 px-4 py-5 text-center text-sm text-stone-500">Verifying farmer details...</p>
          )}

          {farmer && (
            <>
              <div className="mb-5 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4">
                <CheckCircle2 className="text-green-700" size={24} />
                <div>
                  <p className="font-semibold text-green-900">Identity verified</p>
                  <p className="text-xs text-green-700">Booking QR: {bookingId}</p>
                </div>
              </div>

              <div className="grid gap-4 rounded-2xl border border-stone-200 bg-stone-50 p-5 sm:grid-cols-2">
                <div><span className="text-xs text-stone-500">Farmer name</span><p className="mt-1 font-semibold text-stone-900">{farmer.name}</p></div>
                <div><span className="text-xs text-stone-500">Aadhaar number</span><p className="mt-1 font-semibold tracking-wider text-stone-900">{farmer.aadhaar}</p></div>
                <div><span className="text-xs text-stone-500">Mobile</span><p className="mt-1 flex items-center gap-2 font-semibold text-stone-900"><Phone size={14} className="text-green-700" />{farmer.mobile}</p></div>
                <div><span className="text-xs text-stone-500">Village</span><p className="mt-1 flex items-center gap-2 font-semibold text-stone-900"><MapPin size={14} className="text-green-700" />{farmer.village}</p></div>
                <div><span className="text-xs text-stone-500">District</span><p className="mt-1 font-semibold text-stone-900">{farmer.district}</p></div>
                <div><span className="text-xs text-stone-500">State</span><p className="mt-1 font-semibold text-stone-900">{farmer.state}</p></div>
              </div>

              <div className="mt-6 flex items-center gap-3 border-t border-stone-200 pt-5 text-sm text-stone-600">
                <ShieldCheck size={18} className="text-green-700" />
                <span>Present this verified page before procurement work begins.</span>
              </div>
            </>
          )}

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 w-full rounded-xl bg-green-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-900"
          >
            Go to Fasal Setu
          </button>
        </div>
      </section>
    </main>
  );
};

export default FarmerQrPage;
