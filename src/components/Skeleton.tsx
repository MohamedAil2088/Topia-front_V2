import React from 'react';

export const ProductSkeleton = () => {
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
            {/* Image Skeleton */}
            <div className="aspect-[3/4] bg-gray-200" />

            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
                {/* Category */}
                <div className="h-3 bg-gray-200 rounded w-1/4" />

                {/* Title */}
                <div className="h-4 bg-gray-300 rounded w-3/4" />

                {/* Price & Rating */}
                <div className="flex justify-between items-center">
                    <div className="h-5 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>

                {/* Button */}
                <div className="h-10 bg-gray-200 rounded-lg w-full mt-2" />
            </div>
        </div>
    );
};

export const ProductDetailsSkeleton = () => {
    return (
        <div className="bg-white min-h-screen pb-20 animate-pulse">
            {/* Breadcrumb Skeleton */}
            <div className="bg-gray-50 py-4 border-b border-gray-100">
                <div className="container mx-auto px-6">
                    <div className="h-4 bg-gray-200 rounded w-64" />
                </div>
            </div>

            {/* Product Details Skeleton */}
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery Skeleton */}
                    <div className="space-y-4">
                        <div className="aspect-[3/4] bg-gray-200 rounded-2xl" />
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
                            ))}
                        </div>
                    </div>

                    {/* Product Info Skeleton */}
                    <div className="space-y-6">
                        <div className="h-3 bg-gray-200 rounded w-1/4" />
                        <div className="h-8 bg-gray-300 rounded w-3/4" />
                        <div className="flex items-center gap-4">
                            <div className="h-6 bg-gray-200 rounded w-20" />
                            <div className="h-4 bg-gray-200 rounded w-32" />
                        </div>
                        <div className="h-10 bg-gray-300 rounded w-1/3" />

                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                        </div>

                        <div className="flex gap-4 pt-6">
                            <div className="h-12 bg-gray-200 rounded-lg flex-1" />
                            <div className="h-12 bg-gray-200 rounded-lg w-12" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const OrderSkeleton = () => {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
            <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                    <div className="h-5 bg-gray-300 rounded w-32" />
                    <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
                <div className="h-6 bg-gray-200 rounded-full w-20" />
            </div>

            <div className="space-y-3">
                {[1, 2].map((i) => (
                    <div key={i} className="flex gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-3 bg-gray-200 rounded w-1/4" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="h-6 bg-gray-300 rounded w-1/3 ml-auto" />
            </div>
        </div>
    );
};

export const UserSkeleton = () => {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-300 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
            </div>

            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 bg-gray-200 rounded" />
                ))}
            </div>
        </div>
    );
};

export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <div className="animate-pulse">
                {/* Table Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                    <div className="flex gap-4">
                        {Array(columns).fill(0).map((_, i) => (
                            <div key={i} className="h-4 bg-gray-200 rounded flex-1" />
                        ))}
                    </div>
                </div>

                {/* Table Rows */}
                {Array(rows).fill(0).map((_, rowIndex) => (
                    <div key={rowIndex} className="px-6 py-4 border-b border-gray-100 last:border-b-0">
                        <div className="flex gap-4">
                            {Array(columns).fill(0).map((_, colIndex) => (
                                <div key={colIndex} className="h-5 bg-gray-200 rounded flex-1" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const CardSkeleton = () => {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
            <div className="space-y-4">
                <div className="h-6 bg-gray-300 rounded w-1/3" />
                <div className="h-10 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
        </div>
    );
};

export const DashboardStatsSkeleton = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                        <div className="h-8 bg-gray-200 rounded w-16" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-8 bg-gray-300 rounded w-24" />
                        <div className="h-4 bg-gray-200 rounded w-32" />
                    </div>
                </div>
            ))}
        </div>
    );
};
