// src/components/Button.tsx
import React from "react";

// Define prop types
type ButtonProps = {
  label: string;
  onClick?: () => void; // optional prop
  disabled?: boolean;
};

// Functional component
const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );

}

export default Button; 