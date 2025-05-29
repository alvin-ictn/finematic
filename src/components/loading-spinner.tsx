import React from "react";

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-16 gap-2">
      <div className="bg-red-400 rounded-full h-4 w-4 animate-grow-height delay-0" />
      <div className="bg-red-400 rounded-full h-4 w-4 animate-grow-height delay-100" />
      <div className="bg-red-400 rounded-full h-4 w-4 animate-grow-height delay-200" />
    </div>
  );
};
