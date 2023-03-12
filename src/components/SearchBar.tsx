import React from 'react';

interface SearchBarProps {
    setQuery: (value: string) => void; // specify the type of setQuery prop
    query: string;
  }

const SearchBar = ({ setQuery, query }: SearchBarProps) => {
    function handleOnSearch(event: React.ChangeEvent<HTMLInputElement>){
        const { value } = event.currentTarget;
        setQuery(value)
    }
   return (
       <div className="p-8">
           <div className="bg-white flex items-center rounded-full shadow-xl">
               <input name="search"
                   type="search"
                   placeholder="Search for a car. Ex: Toyota Corolla"
                   autoComplete="off"
                   className="rounded-l-full w-full py-4 px-6 text-gray-700 leading-tight focus:outline-none"
                   id="search"
                   value = { query }
                   onChange = { handleOnSearch } />
               <div className="p-4">
               </div>
           </div>
       </div>
   );
}

export default SearchBar;