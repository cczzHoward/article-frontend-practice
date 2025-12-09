import React from 'react';

interface AlertProps {
    type?: 'error' | 'success' | 'info';
    message: string;
    className?: string;
}

const Alert: React.FC<AlertProps> = ({ type = 'error', message, className = '' }) => {
    if (!message) return null;

    const styles = {
        error: 'bg-red-900/20 border-red-700 text-red-400',
        success: 'bg-green-900/20 border-green-800 text-green-400',
        info: 'bg-blue-900/20 border-blue-800 text-blue-400',
    };

    return (
        <div className={`border px-4 py-3 rounded-lg mb-4 text-sm ${styles[type]} ${className}`}>
            {message}
        </div>
    );
};

export default Alert;
