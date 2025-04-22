import React from "react";

export interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export const CuraLogo: React.FC<LogoProps> = ({ 
  size = 32, 
  showText = true, 
  className = ""
}) => {
  // Calculate appropriate height based on size to maintain aspect ratio
  const logoHeight = showText ? Math.round(size * 0.7) : size;
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div style={{ width: size, height: logoHeight }}>
        {/* New Cura logo */}
        <img 
          src="https://static.databutton.com/public/577dda9b-1cba-46c8-a3ab-5f78eac9ea13/Cura new logo.jpeg" 
          alt="Cura Logo" 
          className="object-contain h-full w-full"
        />
      </div>
      {showText && (
        <div className="text-lg font-bold text-[#1A4742]">
          CURA
        </div>
      )}
    </div>
  );
};
