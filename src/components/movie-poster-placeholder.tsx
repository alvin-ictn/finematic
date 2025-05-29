import { cn } from "@/lib/utils";
import { Film } from "lucide-react";
import React from "react";

interface MoviePosterPlaceholderProps {
  title: string;
  className?: string;
}

export const MoviePosterPlaceholder: React.FC<MoviePosterPlaceholderProps> = ({
  title,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 flex flex-col items-center justify-center text-center p-4",
        className
      )}
    >
      <div className="mb-3">
        <Film className="w-12 h-12 text-gray-400" />
      </div>

      <h4 className="text-white text-sm font-medium leading-tight mb-2 line-clamp-3">
        {title}
      </h4>

      <div className="flex space-x-1 opacity-100">
        <div className="w-1 h-1 bg-amber-300 rounded-full"></div>
        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
        <div className="w-1 h-1 bg-amber-300 rounded-full"></div>
      </div>

      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
      </div>
    </div>
  );
};
