import { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { auth } from "../../lib/firebase"; 

const Sidebar = ({ setSearchQuery }) => {
  const [isOpen, setIsOpen] = useState(false); // true = sidebar open
  const [localSearch, setLocalSearch] = useState("");
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    setSearchQuery(localSearch); // Send the search term to parent
    setLocalSearch("");
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

    const handleLogout = async () => {
  try {
    await auth.signOut();
    navigate("/login");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};


  const all  = () =>{
    setLocalSearch("all");
  setSearchQuery("all");
    submit()
     setLocalSearch("");
       setSearchQuery("");
    setIsOpen(false);
  }

  const playlist  = () =>{
    setLocalSearch("My Playlist");
  setSearchQuery("My Playlist");
    submit()
     setLocalSearch("");
       setSearchQuery("");
    setIsOpen(false);
  }
  return (
    <>
      <div className="sidebar fixed top-0 left-0 bottom-0  z-[150]">
        {!isOpen && (
          <GiHamburgerMenu
            className={` ${isOpen ? "text-[#111]" : "text-[#fff]"} text-[30px] top-[38px] left-[24px] absolute cursor-pointer`}
            onClick={toggleMenu}
          />
        )}
        <div
          className={`sidebarbox flex flex-col justify-center items-center min-h-[100vh] bg-[#687d8a] gap-8 transition-all duration-300 ${isOpen ? "md:w-[20vw] w-[100vw]" : "w-0 overflow-hidden"}`}
        >
          <FaTimes
            className={` ${isOpen ? "text-[#fff]" : "text-[#111]"} text-[30px] top-2 right-2 absolute cursor-pointer`}
            onClick={toggleMenu}
          />

          {/* Only show this menu if sidebar is open */}
          {isOpen && (
            <div className="menu flex">
              <input
                type="text"
                className="bg-[#fff] border-none rounded-l-[10px] w-[200px] p-2 outline-none"
                placeholder="Search..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)} // update search query state
                onKeyPress={(e) => e.key === "Enter" && submit(e)} // submit on Enter key press
              />
              <button
                className="p-2 bg-[#fff] rounded-r-[10px] cursor-pointer outline-none border-none"
                onClick={submit}
              >
                <FaSearch />
              </button>
            </div>
          )}

          {/* Menu items */}
          {isOpen && (
            <div className="menu flex flex-col items-center mt-10">
              <ul className="flex flex-col gap-8 items-center">
                <li
                  className="text-[#fff] text-[20px] cursor-pointer"
                  onClick={all}
                >
                  All Songs
                </li>
                <li
                  className="text-[#fff] text-[20px] cursor-pointer"
                  onClick={playlist}
                >
                  My Playlist
                </li>
                <li className="text-[#fff] text-[20px] cursor-pointer" onClick={() => navigate(`/setting`)}>
                  Settings
                </li>
                  <li
                  className="text-[#fff] text-[20px] cursor-pointer"
                  onClick={() => navigate(`/profile`)}
                >
                  Profile
                </li>
                <li className="text-[#fff] text-[20px] cursor-pointer" onClick={handleLogout}>
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
