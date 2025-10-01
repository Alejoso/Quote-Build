import { useNavigate, useLocation } from "react-router-dom";

const NavBar = () => {

    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="w-full flex items-center bg-[#ffffff] px-6 h-14">
            <div className="flex items-center gap-2">

                <img src="/QandBNavBar.png" alt="Logo" className="w-20 h-20 object-contain mr-2" />
                <button onClick={() => navigate("/")} className="bg-negroClaro rounded-full w-9 h-9 flex items-center justify-center hover:bg-blue-500 ml-4">
                    <img src="/HomeButton.png" alt="Home" className="w-8 h-8 rounded-full object-contain"/>
                </button>
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate("/projects")} className={`rounded-full w-12 h-12 flex items-center justify-center hover:bg-blue-500 ${location.pathname === '/projects' ? 'bg-blue-500' : 'bg-gray-100'}`}>
                        <img src="/RepoButton.png" alt="Repo" className="w-10 h-10 rounded-full object-contain" />
                    </button>
                    <button onClick={() => navigate("/saveProject")} className={`rounded-full w-12 h-12 flex items-center justify-center hover:bg-blue-500 ${location.pathname === '/saveProject' ? 'bg-blue-500' : 'bg-gray-100'}`}>
                        <img src="/AddProjectButton.png" alt="Add" className="w-10 h-10 rounded-full object-contain" />
                    </button>
                </div>

                <button onClick={() => navigate("/newRegistry")} className={`rounded-full w-12 h-12 flex items-center justify-center hover:bg-blue-500 ${location.pathname === '/newRegistry' ? 'bg-blue-500' : 'bg-gray-100'}`}>
                    <img src="/DataBaseButton.png" alt="DB" className="w-10 h-10 rounded-full object-contain" />
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
