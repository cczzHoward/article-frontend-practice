import React from 'react';

interface SkeletonProps {
    count?: number;
    height?: string;
    className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ count = 1, height = 'h-48', className = '' }) => {
    return (
        <div className="space-y-4 w-full">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={`bg-surface rounded-lg animate-pulse border border-slate-700 ${height} ${className}`}
                ></div>
            ))}
        </div>
    );
};

export default Skeleton;
