import React from "react";

interface SearchBarProps {
  setQuery: (value: string) => void; // specify the type of setQuery prop
  query: string;
}

const SearchBar = ({ setQuery, query }: SearchBarProps) => {
  function handleOnSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.currentTarget;
    setQuery(value);
  }
  return (
    <div className="p-8">
      <div className="flex items-center bg-white">
        <input
          name="search"
          type="search"
          placeholder="Search for a car. Ex: Toyota Corolla"
          autoComplete="off"
          className="w-full rounded-full py-4 px-6 leading-tight text-gray-700 shadow-xl focus:outline-none"
          id="search"
          value={query}
          onChange={handleOnSearch}
        />
      </div>
    </div>
  );
};

export default SearchBar;
