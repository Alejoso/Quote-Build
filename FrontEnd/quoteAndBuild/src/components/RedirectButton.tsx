import React from "react";
import { useNavigate } from "react-router-dom";

interface RedirectButtonProps {
  text: string;
  to: string; // ruta a la que redirigirá
}

const RedirectButton: React.FC<RedirectButtonProps> = ({ text, to }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
    >
      {text}
    </button>
  );
};

export default RedirectButton;