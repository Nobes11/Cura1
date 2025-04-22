import React, { useState } from "react";
import { Input } from "@/components/ui/input";

interface Props {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
}

export const PhoneInput: React.FC<Props> = ({ 
  value, 
  onChange, 
  className = "", 
  placeholder = "(123) 456-7890", 
  required = false 
}) => {
  
  const formatPhoneNumber = (input: string) => {
    // Strip all non-numeric characters
    const numbers = input.replace(/\D/g, "");
    
    // Format the phone number
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    onChange(formattedValue);
  };
  
  return (
    <Input
      type="tel"
      value={value}
      onChange={handleChange}
      className={className}
      placeholder={placeholder}
      maxLength={14} // (123) 456-7890 is 14 characters
      required={required}
    />
  );
};
