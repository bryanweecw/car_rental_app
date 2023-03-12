import React, { useState } from 'react';
import SearchBar from '~/components/searchbar';
import Cars, { carObject } from './Cars';
import Fuse from 'fuse.js';

interface CarsSearchBarProps {
    apiData: carObject[];
  }

// const formattedData = Object.entries(data).map((entry) => ({ car_name: entry[0], car_url: entry[1] }));
const CarsSearchBar = ({ apiData }: CarsSearchBarProps) => {
    const [query, setQuery] = useState('')
    const options ={
        keys: [
            "name",
        ],
        includedScore: true
    };
    const fuse = new Fuse(apiData, options);
    console.log(query)
    const results = fuse.search(query);
    console.log(results)
    const carResult = query ? results.map(result => result.item) : apiData;

   return (
       <div className="w-3/6">
            <SearchBar query={query} setQuery={setQuery}/>
           <Cars carResult={ carResult }/>
       </div>
   );

}

export default CarsSearchBar;