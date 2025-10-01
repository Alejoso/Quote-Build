import { useNavigate, useLocation } from "react-router-dom";

const NavBar = () => {

    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="w-full flex items-center bg-[#ffffff] px-6 h-14">
            <div className="flex items-center gap-2">

                <img src="/QandBNavBar.png" alt="Logo" className="w-20 h-20 object-contain mr-2" />
                <button onClick={() => navigate("/")} className={`rounded-full w-12 h-12 flex items-center justify-center hover:bg-[#ffce91] ml-4 ${location.pathname === '/' ? 'bg-[#ffb354]' : 'bg-gray-100'}`}>
                    <i className="bi bi-house-door text-xl"></i>
                </button>
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate("/projects")} className={`rounded-full w-12 h-12 flex items-center justify-center hover:bg-[#ffce91] ${location.pathname === '/projects' ? 'bg-[#ffb354]' : 'bg-gray-100'}`}>
                        <i className="bi bi-book text-xl"></i>
                    </button>
                    <button onClick={() => navigate("/saveProject")} className={`rounded-full w-12 h-12 flex items-center justify-center hover:bg-[#ffce91] ${location.pathname === '/saveProject' ? 'bg-[#ffb354]' : 'bg-gray-100'}`}>
                        <i className="bi bi-plus-lg text-xl"></i>
                    </button>
                </div>

                <button onClick={() => navigate("/newRegistry")} className={`rounded-full w-12 h-12 flex items-center justify-center hover:bg-[#ffce91] ${location.pathname === '/newRegistry' ? 'bg-[#ffb354]' : 'bg-gray-100'}`}>
                    <i className="bi bi-database text-xl"></i>
                </button>
            </div>
            <div className="flex items-center ml-auto">
                <button onClick={() => navigate("/")} className="rounded-full bg-gray-200 w-8 h-8 flex items-center justify-center hover:bg-[#ffce91]">
                    <i className="bi bi-person-fill text-lg"></i>
                </button>
            </div>
        </nav>
    );
};

export default NavBar;
