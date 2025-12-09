import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
    return (
        <div className={className}>
            <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
            <input
                className="w-full bg-background border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                {...props}
            />
        </div>
    );
};

export default Input;
