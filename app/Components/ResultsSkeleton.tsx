import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const ResultsSkeleton = () => (
  <div className="space-y-6">
    <SkeletonTheme baseColor="#e0e7ff" highlightColor="#c7d2fe">
      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton height={224} className="rounded-lg" />
          <Skeleton height={224} className="rounded-lg" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-700">
        <Skeleton width={250} />
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl shadow-md border border-gray-200"
          >
            <div className="flex justify-between items-center mb-4">
              <Skeleton width={80} height={24} />
              <Skeleton width={80} height={24} />
            </div>
            <div className="space-y-3 mb-5">
              <Skeleton height={40} />
              <Skeleton height={40} />
            </div>
            <Skeleton height={40} />
          </div>
        ))}
      </div>
    </SkeletonTheme>
  </div>
);

export default ResultsSkeleton;
