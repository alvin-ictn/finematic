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
        <Search className="h-5 w-5 text-white" />
      </div>
      <input
        type="text"
        placeholder="Search for movies..."
        data-testid="search-movie"
        ref={inputRef}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={searchQuery}
        className="w-full pl-14 pr-4 py-4 text-lg rounded-2xl outline-none  transition-all duration-300"
      />

    </form>
  );
};

export default SearchBar;
