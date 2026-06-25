import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    const inputId = id || props.name || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div>
        <label className="text-sm font-medium text-slate-800" htmlFor={inputId}>
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 ${className}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-700" id={`${inputId}-error`}>
            {error}
          </p>
        )}
      </div>
    );
  },
);

FormField.displayName = "FormField";
