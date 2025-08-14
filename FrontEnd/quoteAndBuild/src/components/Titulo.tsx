import React from "react";

interface TituloProps {
    textValue: string;
}

const Titulo: React.FC<TituloProps> = ({ textValue }) => (
    <div className="text-[44px] font-bold text-black font-sans text-center" style={{ fontFamily: 'Latif, sans-serif' }}>
        {textValue}
    </div>
);

export default Titulo;
