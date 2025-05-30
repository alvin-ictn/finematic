import React from "react";
import { TrendingUp, Star, Calendar, Clock } from "lucide-react";
import type { CategoryProps } from "@/constants/category";
import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  list: {
    id: CategoryProps;
    name: string;
  }[];
}

const categories = [
  {
    id: "now_playing",
    label: "Now Playing",
    icon: Clock,
    gradient: "from-red-500 to-pink-500",
  },
  {
    id: "popular",
    label: "Popular",
    icon: TrendingUp,
    gradient: "from-blue-500 to-purple-500",
  },
  {
    id: "top_rated",
    label: "Top Rated",
    icon: Star,
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    id: "upcoming",
    label: "Upcoming",
    icon: Calendar,
    gradient: "from-green-500 to-teal-500",
  },
];

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  onCategoryChange,
  list,
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {list.map((category) => {
        const IconComponent = categories.find(
          (val) => val.id === category?.id
        )?.icon;

        const gradient = categories.find(
          (val) => val.id === category?.id
        )?.gradient;

        const isActive = activeCategory === category.id;

        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id as CategoryProps)}
            className={cn(
              "cursor-pointer group relative px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105",
              isActive
                ? "text-white shadow-2xl"
                : "text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10"
            )}
          >
            {isActive && (
              <div
                className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl opacity-90`}
              />
            )}

            <div className="relative flex items-center space-x-2">
              {IconComponent && <IconComponent className="w-5 h-5" />}
              <span>{category.name}</span>
            </div>

            <div
              className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
            />
          </button>
        );
      })}
    </div>
  );
};
