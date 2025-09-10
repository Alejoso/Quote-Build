import { useNavigate } from "react-router-dom";

const NavBar = () => {

    const navigate = useNavigate(); 

    return (
        <nav className="w-full flex items-center bg-[#ffffff] px-6 h-14">
            <div className="flex items-center gap-2">
                <img src="/QandBNavBar.png" alt="Logo" className="w-12 h-12 object-contain mr-2" />
                <button onClick={() => navigate("/")} className="bg-negroClaro rounded-full w-9 h-9 flex items-center justify-center hover:bg-blue-500 ml-4">
                    <img src="/HomeButton.png" alt="Home" className="w-8 h-8 rounded-full object-contain"/>
                </button>
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate("/projects")} className="bg-negroClaro rounded-full w-9 h-9 flex items-center justify-center hover:bg-blue-500">
                        <img src="/RepoButton.png" alt="Repo" className="w-8 h-8 rounded-full object-contain" />
                    </button>
                    <button onClick={() => navigate("/saveProject")} className="bg-negroClaro rounded-full w-9 h-9 flex items-center justify-center hover:bg-blue-500">
                        <img src="/AddProjectButton.png" alt="Add" className="w-8 h-8 rounded-full object-contain"/>
                    </button>
                </div>
                
                <button onClick={() => navigate("/newRegistry")} className="bg-negroClaro rounded-full w-9 h-9 flex items-center justify-center hover:bg-blue-500">
                    <img src="/DataBaseButton.png" alt="DB" className="w-8 h-8 rounded-full object-contain" />
                </button>
            </div>
            <div className="flex items-center ml-auto">
                <button onClick={() => navigate("/")} className="rounded-full bg-gray-200 w-8 h-8 flex items-center justify-center hover:bg-blue-500">
                    <img src="/Profile.png" alt="Perfil" className="w-8 h-8 rounded-full object-contain" />
                </button>
            </div>
        </nav>
    );
};

export default NavBar;
