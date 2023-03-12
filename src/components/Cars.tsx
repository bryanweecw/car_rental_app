import React from 'react';


export interface carObject {
    id: number;
    name: string;
    imageSrc: string;
    imageAlt: string;
    description: string;
    price: number;
    color: string;
}

interface CarsProps {
    carResult: carObject[];
  }

const Cars = ( {carResult} : CarsProps ) => {
   return (
       <div>
            <ol className="flex row justify-center">
                {carResult.slice(0, 6).map((car: carObject, value: number) => (
                    <li key={value} className="p-4 rounded-md w-max my-8 mx-3 shadow-2xl text-center" >
                        <img className="m-auto w-16 h-16" src={car.imageSrc} alt={car.name.replaceAll('_', ' ')} />
                        <span>{car.name.replaceAll('_', ' ')}</span>
                    </li>
                ))}
            </ol>
       </div>
   );
}

export default Cars;
