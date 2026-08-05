import React from "react";

const Step3Policies = ({ data, update, next, back }) => {
  const handlePolicyChange = (name, value) => {
    update({
      policies: {
        ...(data.policies || {}),
        [name]: value,
      },
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">
          Policies
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Set basic rules before guests book your property.
        </p>
      </div>

      <div className="space-y-4 rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50">
        <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4">
          <span>
            <span className="block font-semibold text-slate-900">
              Allow children
            </span>
            <span className="text-sm text-slate-500">
              Guests can book with children.
            </span>
          </span>

          <input
            type="checkbox"
            checked={Boolean(data.policies?.allowChildren)}
            onChange={(e) =>
              handlePolicyChange("allowChildren", e.target.checked)
            }
            className="h-5 w-5 accent-blue-600"
          />
        </label>

        <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4">
          <span>
            <span className="block font-semibold text-slate-900">
              Allow pets
            </span>
            <span className="text-sm text-slate-500">
              Guests can bring pets to this property.
            </span>
          </span>

          <input
            type="checkbox"
            checked={Boolean(data.policies?.allowPets)}
            onChange={(e) =>
              handlePolicyChange("allowPets", e.target.checked)
            }
            className="h-5 w-5 accent-blue-600"
          />
        </label>
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

export default Step3Policies;
