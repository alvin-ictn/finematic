import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useRef, useState, type ChangeEvent, type FC } from "react";

interface SearchBar {
  searchQuery: (e: ChangeEvent<HTMLInputElement>) => void;
}
const SearchBar: FC<SearchBar> = ({ searchQuery }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <form
      onSubmit={() => {}}
      className={cn(
        "relative max-w-2xl mx-auto mb-8 border border-border rounded-2xl flex justify-between items-center",
        isFocused && "outline-2 outline-amber-300"
      )}
    >
      <div className="absolute top-0 z-50 h-full flex items-center justify-center w-14">
        <Search className="h-5 w-5 text-black" />
      </div>
      <input
        type="text"
        placeholder="Search for movies..."
        ref={inputRef}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        // value={""}
        onChange={searchQuery}
        className="w-full pl-14 pr-4 py-4 text-lg bg-white/10 border-white/20 rounded-2xl outline-none text-black placeholder:text-gray-400 transition-all duration-300"
      />
      <div className="h-full relative pr-4">
        <button type="submit" className="text-white">
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
