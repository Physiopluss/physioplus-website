import { useEffect, useState } from "react";
import {
  Button,
  Collapse,
  IconButton,
  ListItem,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdClose, IoMdMenu } from "react-icons/io";
import { MdOutlineMailOutline, MdOutlinePhoneInTalk } from "react-icons/md";
import { BiChevronDown } from "react-icons/bi";
import { jwtDecode } from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import { setLogOut, setUser } from "../../slices/homecare/newAuthSlice";
import NewNavLinks from "./comp/NewNavLinks";
import { getNewNavData } from "./Mock/NewNavData";

export default function NavbarNew() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("homecareUser");
    if (user) dispatch(setUser(JSON.parse(user)));
  }, [dispatch]);

  const user =
    localStorage.getItem("homecareUser") &&
    JSON.parse(localStorage.getItem("homecareUser"));

  const userType = localStorage.getItem("homecareUserType");
  const decoded = user && jwtDecode(user?.userToken);
  const isPatient = userType === "patient";
  const isPhysio = userType === "physio";

  const name = isPatient
    ? decoded?.patient?.fullName
    : decoded?.physio?.fullName;

  const isUser = useSelector((e) => e.authNew.user);
  const navData = getNewNavData();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    closeMenu();
    localStorage.removeItem("homecareUser");
    localStorage.removeItem("homecareUserType");
    dispatch(setLogOut());
    navigate("/homecare");
  };

  return (
    <>
      {/* Topbar */}
      <header className="hidden py-4 px-6 lg:flex justify-between items-center bg-[#f5fef9]">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <MdOutlinePhoneInTalk className="w-4 h-4 text-black" />
            <span className="text-sm text-black">+91 8107333576</span>
          </div>
          <div className="flex items-center space-x-2">
            <MdOutlineMailOutline className="w-4 h-4 text-black" />
            <span className="text-sm text-black">
              info@physioplushealthcare.com
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {!isUser ? (
            <>
              <Link
                to="/homecare/login-new"
                className="text-sm text-black hover:text-blue-800"
                onClick={() =>
                  localStorage.setItem("homecareUserType", "patient")
                }
              >
                Patient Login
              </Link>
              <Link
                to="/homecare/login-physio"
                className="text-sm text-black hover:text-red-800"
                onClick={() =>
                  localStorage.setItem("homecareUserType", "physio")
                }
              >
                Physio Login
              </Link>
            </>
          ) : (
            <Menu
              open={isMenuOpen}
              handler={setIsMenuOpen}
              placement="bottom-end"
            >
              <MenuHandler>
                <div className="cursor-pointer text-sm text-green">
                  Hi, {name ?? "User"}
                </div>
              </MenuHandler>
              <MenuList className="p-1">
                {isPatient && (
                  <>
                    <Link to="/homecare/patient-profile">
                      <MenuItem>Profile</MenuItem>
                    </Link>
                    <Link to="/homecare/patient-order-history">
                      <MenuItem>Booking History</MenuItem>
                    </Link>
                  </>
                )}
                {isPhysio && (
                  <>
                    <Link to="/homecare/physio-profile">
                      <MenuItem>Profile</MenuItem>
                    </Link>
                    <Link to="/homecare/physio-order-history">
                      <MenuItem>Booking History</MenuItem>
                    </Link>
                  </>
                )}
                <MenuItem
                  className="text-red-600 hover:text-red-900"
                  onClick={handleLogout}
                >
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          )}
          <Link className="text-sm text-black" to="/homecare/contact">
            Support
          </Link>
        </div>
      </header>

      {/* Main Navbar */}
      <div className="max-w-[100vw] p-3 text-black bg-[#e6ffeb] shadow-sm">
        <div className="mx-auto flex items-center justify-between px-2 md:px-8">
          <Link to="/homecare">
            <img
              src="/logo-nobg.png"
              alt="Physio_logo"
              className="w-[100px] md:w-[120px]"
            />
          </Link>

          <div className="hidden lg:block">
            <NewNavLinks />
          </div>

          <IconButton
            size="sm"
            variant="text"
            onClick={toggleIsNavOpen}
            className="ml-auto mr-4 lg:hidden"
          >
            {isNavOpen ? <IoMdClose /> : <IoMdMenu />}
          </IconButton>

          <Button
            onClick={() => navigate("/homecare")}
            className="hidden md:block text-sm font-bold bg-white border-2 border-green text-black rounded-2xl px-8 py-2.5 hover:bg-green hover:text-white transition-colors"
          >
            Book an appointment
          </Button>
        </div>

        {/* Mobile Menu */}
        <Collapse open={isNavOpen} className="overflow-y-auto">
          <ul className="lg:hidden mt-2 mb-4 flex flex-col gap-2">
            {navData.map((data) => (
              <Link
                to={data.slug}
                key={data.id}
                onClick={() => setIsNavOpen(false)}
              >
                <MenuItem className="border-b">{data.name}</MenuItem>
              </Link>
            ))}

            {isUser ? (
              <>
                <ListItem
                  className="flex items-center justify-between border-b"
                  selected={isMobileMenuOpen}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <span className="text-sm text-green">Hi, {name}</span>
                  <BiChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isMobileMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </ListItem>

                {isMobileMenuOpen && (
                  <Collapse open={isMobileMenuOpen}>
                    {isPatient && (
                      <>
                        <Link to="/homecare/patient-profile">
                          <MenuItem className="text-sm">Profile</MenuItem>
                        </Link>
                        <Link to="/homecare/patient-order-history">
                          <MenuItem className="text-sm">
                            Booking History
                          </MenuItem>
                        </Link>
                      </>
                    )}
                    {isPhysio && (
                      <>
                        <Link to="/homecare/physio-profile">
                          <MenuItem className="text-sm">Profile</MenuItem>
                        </Link>
                        <Link to="/homecare/physio-order-history">
                          <MenuItem className="text-sm">
                            Booking History
                          </MenuItem>
                        </Link>
                      </>
                    )}
                    <MenuItem
                      className="text-sm text-red-600 hover:text-red-900"
                      onClick={handleLogout}
                    >
                      Sign Out
                    </MenuItem>
                  </Collapse>
                )}
              </>
            ) : (
              <>
                <Link to="/homecare/login-new">
                  <MenuItem
                    onClick={() =>
                      localStorage.setItem("homecareUserType", "patient")
                    }
                    className="text-green"
                  >
                    Patient Login
                  </MenuItem>
                </Link>
                <Link to="/homecare/login-physio">
                  <MenuItem
                    onClick={() =>
                      localStorage.setItem("homecareUserType", "physio")
                    }
                    className="text-blue-800"
                  >
                    Physio Login
                  </MenuItem>
                </Link>
              </>
            )}

            <Link to="/homecare/contact">
              <MenuItem className="border-b">Support</MenuItem>
            </Link>

            <Button
              className="text-sm font-semibold w-full text-black bg-white border-2 border-green rounded-2xl px-8 py-2.5 hover:bg-green hover:text-white"
              onClick={() => {
                navigate("/homecare");
                setIsNavOpen(false);
              }}
            >
              Book an appointment
            </Button>

            <div className="mt-2 px-4 space-y-1 text-sm text-black">
              <div className="flex items-center space-x-2">
                <MdOutlinePhoneInTalk className="w-4 h-4" />
                <span>+91 8107333576</span>
              </div>
              <div className="flex items-center space-x-2">
                <MdOutlineMailOutline className="w-4 h-4" />
                <span>info@physioplushealthcare.com</span>
              </div>
            </div>
          </ul>
        </Collapse>
      </div>
    </>
  );
}
