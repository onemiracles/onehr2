import React, { useState, useEffect, forwardRef, useRef } from "react";
import { Loading } from "./Loading";
import { cn } from "../../utils";

export const Img = forwardRef(({ src, fallback = '/no-image.png', alt, className, ...props }, ref) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  // When src changes, reset the loading state
  useEffect(() => {
    const img = new Image();
    img.src = imgSrc;
    img.onload = handleLoad;
    img.onerror = handleError;
  }, [imgSrc]);

  const handleLoad = () => {
    console.log("Image loaded successfully.");
    setIsLoading(false);
  };

  const handleError = () => {
    console.warn("Image failed to load, switching to fallback.");
    setImgSrc(fallback);
    setIsLoading(false);
  };

  return isLoading ? 
    <div className={className}><Loading size="small" /></div> :
    <img
        ref={ref}
        {...props}
        src={imgSrc}
        alt={alt}
        className={cn(`${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`, className)}
        onLoad={handleLoad}
        onError={handleError}
    />;
});

export default Img;
