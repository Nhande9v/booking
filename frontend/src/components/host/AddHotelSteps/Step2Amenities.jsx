import React from "react";

const amenityOptions = [
  "Wifi",
  "Air conditioning",
  "Pool",
  "Gym",
  "Kitchen",
  "Workspace",
];

const Step2Amenities = ({ data, update, next, back }) => {
  const toggleAmenity = (amenity) => {
    const current = data.amenities || [];
    const amenities = current.includes(amenity)
      ? current.filter((item) => item !== amenity)
      : [...current, amenity];

    update({ amenities });
  };

  const handleFacilityChange = (name, value) => {
    update({
      facilities: {
        ...(data.facilities || {}),
        [name]: value,
      },
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">
          Amenities
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Select the features guests can use during their stay.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50">
        <div className="grid gap-3 sm:grid-cols-2">
          {amenityOptions.map((amenity) => (
            <label
              key={amenity}
              className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 p-4 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
            >
              <input
                type="checkbox"
                checked={(data.amenities || []).includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
                className="h-4 w-4 accent-blue-600"
              />
              {amenity}
            </label>
          ))}
        </div>

        <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
          <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={Boolean(data.facilities?.hasBreakfast)}
              onChange={(e) =>
                handleFacilityChange("hasBreakfast", e.target.checked)
              }
              className="h-4 w-4 accent-blue-600"
            />
            Breakfast available
          </label>

          <label className="space-y-2 text-sm font-semibold text-slate-700">
            Parking
            <select
              value={data.facilities?.parking || "None"}
              onChange={(e) => handleFacilityChange("parking", e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            >
              <option value="None">None</option>
              <option value="Free">Free</option>
              <option value="Paid">Paid</option>
            </select>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={back}
          className="rounded-2xl border border-slate-200 px-8 py-3.5 font-semibold text-slate-500 transition hover:bg-slate-50"
        >
          Back
        </button>

        <button
          type="button"
          onClick={next}
          className="rounded-2xl bg-slate-900 px-10 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step2Amenities;
