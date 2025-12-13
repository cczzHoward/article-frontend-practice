import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-slate-400 mb-6">
            Oops! The page you are looking for does not exist.
        </p>
        <Link
            to="/"
            className="inline-block px-6 py-3 bg-primary text-white rounded hover:bg-primary/80 transition-colors font-semibold"
        >
            Back to Home
        </Link>
    </div>
);

export default NotFoundPage;
