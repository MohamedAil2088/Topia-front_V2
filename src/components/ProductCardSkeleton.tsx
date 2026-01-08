import React from 'react';
import Skeleton from './Skeleton';

const ProductCardSkeleton = () => {
    return (
        <div className="group relative block overflow-hidden rounded-xl bg-white border border-gray-100">
            {/* Image Skeleton */}
            <Skeleton variant="rectangular" className="h-[250px] sm:h-[300px] w-full" />

            <div className="relative p-4">
                {/* Title Skeleton */}
                <Skeleton variant="text" height={20} width="80%" className="mb-2" />

                <div className="mt-2 flex items-center justify-between">
                    {/* Price Skeleton */}
                    <Skeleton variant="text" height={24} width="30%" />

                    {/* Category Badge Skeleton */}
                    <Skeleton variant="circular" height={20} width={60} />
                </div>
            </div>
        </div>
    );
};

export default ProductCardSkeleton;
