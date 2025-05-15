import React, { useRef, useEffect, useState } from "react";

const PhonePreview = ({ screenshotSrc, overlaySrc , layoutClassName, ...props}) => {
  const scrollRef = useRef(null);
  const [hideOverlay, setHideOverlay] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current.scrollTop > 10) {
        setHideOverlay(true);
      } else {
        setHideOverlay(false);
      }
    };

    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollEl) {
        scrollEl.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    
     <div className={`${layoutClassName} relative flex-shrink-0`} {...props}>
      {/* Phone frame */}
      <img
        src="home/phone-preview.png"
        alt="App preview"
        className="w-full h-auto relative z-5 bg-transparent"
      />

      {/* Scrollable content inside the phone */}
      <div
        ref={scrollRef}
        className="absolute top-[3%] left-[6%] right-[6%] h-[94%] overflow-y-scroll scrollbar-hide rounded-[20px] z-10 bg-white"
      >
        <img
          src={screenshotSrc}
          alt="App screen content"
          className="w-full"
          // Ensure it's tall enough to scroll
        />
      </div>

      {/* Overlay image ABOVE scroll area (and not constrained by it) */}
      {!hideOverlay && (
        <div className="absolute top-[27%] left-1/2 transform -translate-x-1/2 w-[108%] z-20 pointer-events-none">
          <img
            src={overlaySrc}
            alt=""
            className="absolute top-[27%] left-1/2 transform -translate-x-1/2 w-[110%] z-20 pointer-events-none"
          />
        </div>
      )}
    </div>
  );
};

export default PhonePreview;
