import React, { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import TestimonyComponent from "./TestimonyComponent";
import testimonies from "~/pages/testimonies.json";

export default function TestimonyCarousel() {
  const autoplayOptions = {
    delay: 2000,
    stopOnInteraction: false,
  };
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay(autoplayOptions),
  ]);

  return (
    <div className="embla bg-transparent" ref={emblaRef}>
      <div className="embla__container bg-transparent">
        {testimonies.map((ele, id) => {
          return (
            <div key={id} className="embla__slide bg-transparent">
              <TestimonyComponent testimonyObject={ele} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
