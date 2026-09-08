import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:3000/api/aadhaar/check";
const UIDAI_URL = "https://uidai.gov.in/";

export default function GovtAadhaarCheck() {
    const navigate = useNavigate();
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [notRegistered, setNotRegistered] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setNotRegistered(false);

        if (!/^[6-9]\d{9}$/.test(phone)) {
            setError("Enter a valid 10-digit mobile number.");
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.get(API_URL, {
                params: { phone },
            });

            if (!data.success) {
                setError(data.message || "Something went wrong. Please try again.");
                return;
            }

            if (data.registered) {
                navigate("/government-login");
            } else {
                setNotRegistered(true);
            }
        } catch (err) {
            if (err.response) {
                setError(err.response.data?.message || "Something went wrong. Please try again.");
            } else {
                setError("Could not reach the server. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                        Verify your Aadhaar
                    </h1>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                        Enter your registered mobile number to continue.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="phone"
                            className="mb-1.5 block text-sm font-medium text-slate-700"
                        >
                            Mobile number
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                            placeholder="9876543210"
                            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 shadow-sm transition-colors focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600" role="alert">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-slate-900 py-2.5 font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Checking..." : "Check status"}
                    </button>
                </form>

                {notRegistered && (
                    <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
                        <p className="text-sm leading-relaxed text-amber-800">
                            No Aadhaar found for this number. Register your Aadhaar on the
                            official UIDAI website before continuing.
                        </p>
                        <a
                            href={UIDAI_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-amber-900 underline underline-offset-2 hover:text-amber-950"
                        >
                            Register on UIDAI
                        </a>
                    </div>
                )}

                <p className="mt-6 text-center text-xs text-slate-400">
                    Already verified?{" "}
                    <NavLink
                        to="/government-login"
                        className="font-medium text-slate-600 underline underline-offset-2 hover:text-slate-900"
                    >
                        Go to government login
                    </NavLink>
                </p>
            </div>
        </div>
    );
}