import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react"

type Props = {
  label?: string;
  error?: string;
  className?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const CustomFormArea = forwardRef<HTMLTextAreaElement, Props>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && <label className="font-medium">{label}</label>}
        <textarea
          ref={ref}
          {...props}
          className={`border px-3 py-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            error ? "border-red-500" : ""
          } ${className}`}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  }
);
