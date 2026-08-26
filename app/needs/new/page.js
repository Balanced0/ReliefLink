"use client";

import { useState, useEffect } from "react";
import { Droplet, Pill, Home, LifeBuoy, Package } from "lucide-react";
import { apiPost } from "../../../lib/api";

const CATEGORIES = [
  { value: "food",     label: "Food & Water",          Icon: Droplet  },
  { value: "medicine", label: "Medicine & First Aid",   Icon: Pill     },
  { value: "shelter",  label: "Shelter & Clothing",     Icon: Home     },
  { value: "rescue",   label: "Rescue & Evac",          Icon: LifeBuoy },
  { value: "other",    label: "Other Essentials",       Icon: Package  },
];

const URGENCIES = [
  {
    value: "critical",
    label: "Critical",
    dot: "bg-red-500",
    activeClass: "border-red-500 bg-red-50 text-red-600",
    inactiveClass: "border-gray-200 text-gray-600 bg-white hover:border-gray-300",
  },
  {
    value: "high",
    label: "High",
    dot: "bg-orange-500",
    activeClass: "border-orange-500 bg-orange-50 text-orange-600",
    inactiveClass: "border-gray-200 text-gray-600 bg-white hover:border-gray-300",
  },
  {
    value: "medium",
    label: "Medium",
    dot: "bg-blue-500",
    activeClass: "border-blue-500 bg-blue-50 text-blue-600",
    inactiveClass: "border-gray-200 text-gray-600 bg-white hover:border-gray-300",
  },
  {
    value: "low",
    label: "Low",
    dot: "bg-gray-400",
    activeClass: "border-gray-400 bg-gray-100 text-gray-700",
    inactiveClass: "border-gray-200 text-gray-600 bg-white hover:border-gray-300",
  },
];

export default function PostNeedPage() {
  const [category, setCategory] = useState("");
  const [areaId, setAreaId] = useState("");
  const [urgency, setUrgency] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");

  const [areas, setAreas] = useState([]);
  const [areasLoading, setAreasLoading] = useState(true);
  const [areasError, setAreasError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadAreas() {
      try {
        const res = await fetch("http://localhost:5000/api/areas", {
          credentials: "include",
        });
        const data = await res.json().catch(() => []);
        if (!res.ok) {
          setAreasError("Could not load areas. Please refresh the page.");
        } else {
          setAreas(data);
        }
      } catch {
        setAreasError("Could not reach the server. Please check your connection.");
      } finally {
        setAreasLoading(false);
      }
    }
    loadAreas();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!category) {
      setError("Please select a category.");
      return;
    }
    if (!urgency) {
      setError("Please select an urgency level.");
      return;
    }
    if (!areaId) {
      setError("Please select an area.");
      return;
    }
    if (!description.trim()) {
      setError("Description is required.");
      return;
    }

    setLoading(true);
    try {
      const body = {
        category,
        area_id: Number(areaId),
        urgency,
        description: description.trim(),
      };
      if (quantity.trim()) {
        body.quantity = quantity.trim();
      }

      await apiPost("/needs", body);
      setSuccess(true);
      setCategory("");
      setAreaId("");
      setUrgency("");
      setDescription("");
      setQuantity("");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 bg-gray-50 min-h-screen px-4 py-12">
      <div className="w-full max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Post a Need</h1>
          <p className="text-gray-500 mt-1">
            Describe what your community urgently needs. We&apos;ll connect you with
            the right responders.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 rounded-md text-sm">
              ✓ Your need has been posted! Responders in your area will be notified.
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {CATEGORIES.map(({ value, label, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setCategory(value)}
                    style={{ height: "106px" }}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                      category === value
                        ? "border-2 border-blue-900 bg-blue-50 text-blue-900"
                        : "border border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <Icon size={28} />
                    <span
                      className={`text-xs font-medium text-center leading-tight ${
                        category === value ? "text-blue-900" : "text-gray-700"
                      }`}
                    >
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Urgency Level <span className="text-red-500">*</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {URGENCIES.map((u) => (
                  <button
                    key={u.value}
                    type="button"
                    onClick={() => setUrgency(u.value)}
                    className={`rounded-full border px-4 py-2 flex items-center gap-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-900 ${
                      urgency === u.value ? u.activeClass : u.inactiveClass
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${u.dot}`} />
                    {u.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="area"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Area <span className="text-red-500">*</span>
              </label>
              {areasError ? (
                <p className="text-sm text-red-600">{areasError}</p>
              ) : (
                <select
                  id="area"
                  value={areaId}
                  onChange={(e) => setAreaId(e.target.value)}
                  disabled={areasLoading || loading}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-sm disabled:opacity-60"
                >
                  <option value="">
                    {areasLoading ? "Loading areas…" : "Select an area"}
                  </option>
                  {areas.map((a) => (
                    <option key={a.area_id} value={a.area_id}>
                      {a.area_name}{a.district ? ` — ${a.district}` : ""}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Describe what is needed and any important details — location, conditions, who is affected…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-sm resize-none disabled:opacity-60"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Quantity{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                id="quantity"
                type="text"
                placeholder="e.g. 200 boxes, 500 liters, 30 families"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                disabled={loading}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-sm disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={loading || areasLoading}
              className="w-full bg-blue-900 text-white rounded-lg py-3 font-medium hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? "Publishing…" : "Publish Need"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
