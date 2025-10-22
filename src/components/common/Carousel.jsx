import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Carousel = ({ items, renderItem, className = "" }) => {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scroll = (direction) => {
    if (!containerRef.current) return;
    const scrollAmount = containerRef.current.offsetWidth * 0.8;
    containerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const checkScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
  };

  useEffect(() => {
    checkScroll();
    const ref = containerRef.current;
    if (ref) {
      ref.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      ref?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Left Scroll Button */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute top-1/2 left-0 -translate-y-1/2 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 z-10"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </button>
      )}

      {/* Right Scroll Button */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute top-1/2 right-0 -translate-y-1/2 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 z-10"
        >
          <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </button>
      )}

      {/* Carousel Items */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto scroll-smooth gap-4 scrollbar-hide py-2 scroll-snap-x snap-mandatory"
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[45vw] sm:w-[250px] md:w-[220px] lg:w-[250px] snap-start"
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
