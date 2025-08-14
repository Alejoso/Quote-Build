import React from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface ProjectElementProps {
    textValue: string;
}

const ProjectElement: React.FC<ProjectElementProps> = ({ textValue }) => (
    <div className="bg-[#FFFFFF] w-full max-w-[700px] h-[56px] rounded-[16px] flex items-center justify-between px-5 shadow-[0_4px_8px_rgba(0,0,0,0.1)] my-3 mx-auto">
        <span className="font-bold text-[24px] text-black font-sans truncate" style={{ fontFamily: 'Latif, sans-serif' }}>{textValue}</span>
        <button className="bg-transparent border-none cursor-pointer flex items-center justify-center p-0 h-full">
            <i className="bi bi-trash-fill text-red-800 text-2xl"></i>
        </button>
    </div>
);

export default ProjectElement;
