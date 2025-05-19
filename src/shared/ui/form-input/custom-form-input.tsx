import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react"

type Props = {
  label: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const CustomFormInput = forwardRef<HTMLInputElement, Props>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col">
        <label className="mb-1 font-medium">{label}</label>
        <input
          ref={ref}
          {...props}
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);