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

import { NewNavData } from "./Mock/NewNavData";
import { setLogOut, setUser } from "../../slices/homecare/newAuthSlice";
import NewNavLinks from "./comp/NewNavLinks";

export default function NavbarNew() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const user = localStorage.getItem("homecareUser");
    if (user) {
      dispatch(setUser(JSON.parse(user)));
    }
  }, [dispatch]);
  const user =
    localStorage.getItem("homecareUser") &&
    JSON.parse(localStorage.getItem("homecareUser"));
  const decoded = user && jwtDecode(user?.userToken);
  const patientName = decoded?.patient?.fullName;
  const physioName = decoded?.physio?.fullName;
  const isUser = useSelector((e) => e.authNew.user);
  const userType = localStorage.getItem("homecareUserType");
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);
  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

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
            <Menu
              open={isMenuOpen}
              handler={setIsMenuOpen}
              placement="bottom-end"
            >
              <MenuHandler>
                <Link
                  className="text-sm text-black cursor-pointer"
                  to="/homecare/login-new"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(false);
                    setIsNavOpen(false);
                    localStorage.setItem("homecareUserType", "patient");
                    navigate("/homecare/login-new");
                  }}
                >
                  Login
                </Link>
              </MenuHandler>
            </Menu>
          ) : (
            <Menu
              open={isMenuOpen}
              handler={setIsMenuOpen}
              placement="bottom-end"
              allowHover
            >
              <MenuHandler>
                <div className="cursor-pointer text-sm text-green">
                  Hi, {patientName ?? "User"}
                </div>
              </MenuHandler>

              <MenuList className="p-1">
                <Link to={"/homecare/patient-profile"} className="font-normal">
                  <MenuItem>Hi, {patientName ?? "User"}</MenuItem>
                </Link>
                <Link
                  to={"/homecare/patient-order-history"}
                  className="font-normal"
                >
                  <MenuItem
                    onClick={closeMenu}
                    className="flex items-center gap-2 rounded"
                  >
                    Order History
                  </MenuItem>
                </Link>
                <MenuItem
                  onClick={() => {
                    closeMenu();
                    localStorage.removeItem("homecareUser");
                    localStorage.removeItem("homecareUserType");
                    dispatch(setLogOut());
                    navigate("/homecare");
                  }}
                  className="flex items-center gap-2 rounded text-red-600 hover:text-red-900"
                >
                  <Typography as="span" variant="small" className="font-normal">
                    Sign Out
                  </Typography>
                </MenuItem>
              </MenuList>
            </Menu>
          )}
          <Link className="text-sm text-black" to={"/homecare/contact"}>
            Support
          </Link>
        </div>
      </header>

      {/* Main Navbar */}
      <div className="max-w-[100vw] p-3 text-black bg-[#e6ffeb] shadow-sm">
        <div className="relative mx-auto flex items-center justify-between px-2 md:px-8">
          <Link to="/homecare">
            <img
              src={"/logo-nobg.png"}
              alt="Physio_logo"
              loading="lazy"
              className="w-[100px] md:w-[120px] py-1 md:py-2"
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
            {isNavOpen ? (
              <IoMdClose className="h-6 w-6" />
            ) : (
              <IoMdMenu className="h-6 w-6" />
            )}
          </IconButton>

          <Button
            onClick={() => navigate("/homecare")}
            className="hidden md:block text-sm font-bold bg-white border-2 border-green text-black rounded-2xl px-8 py-2.5 hover:bg-green hover:text-white transition-colors duration-200"
          >
            Book an appointment
          </Button>
        </div>

        {/* Mobile Menu */}
        <Collapse open={isNavOpen} className="overflow-y-auto">
          <ul className="lg:hidden mt-2 mb-4 flex flex-col gap-2">
            {NewNavData.map((data) => (
              <Link
                to={data.slug}
                key={data.id}
                onClick={() => setIsNavOpen(false)}
              >
                <MenuItem className="flex items-center gap-2 rounded-none border-b border-gray-300">
                  {data.name}
                </MenuItem>
              </Link>
            ))}

            {isUser ? (
              <>
                <ListItem
                  className="focus:!bg-transparent flex items-center justify-between gap-2 py-2 pr-4 font-medium text-black border-b border-gray-300"
                  selected={isMobileMenuOpen}
                  onClick={() => setIsMobileMenuOpen((cur) => !cur)}
                >
                  <Link
                    to={"/homecare/patient-profile"}
                    className="text-sm text-green"
                    onClick={() => setIsNavOpen(false)}
                  >
                    <MenuItem>Hi, {patientName ?? "User"}</MenuItem>
                  </Link>

                  <BiChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isMobileMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </ListItem>

                {isMobileMenuOpen && (
                  <Collapse open={isMobileMenuOpen}>
                    <Link
                      to="/homecare/patient-order-history"
                      onClick={() => setIsNavOpen(false)}
                    >
                      <MenuItem className="text-sm">Order History</MenuItem>
                    </Link>

                    <MenuItem
                      className="text-sm text-red-600 hover:text-red-900"
                      onClick={() => {
                        closeMenu();
                        localStorage.removeItem("homecareUser");
                        localStorage.removeItem("homecareUserType");
                        dispatch(setLogOut());
                        navigate("/homecare");
                      }}
                    >
                      Sign Out
                    </MenuItem>
                  </Collapse>
                )}
              </>
            ) : (
              <Link
                to="/homecare/login-new"
                onClick={() => {
                  setIsNavOpen(false);
                  localStorage.setItem("homecareUserType", "patient");
                }}
              >
                <div className="px-4 py-2 text-sm font-medium text-black border-b border-gray-300 hover:bg-gray-100">
                  Login
                </div>
              </Link>
            )}

            <Link to="/homecare/contact" onClick={() => setIsNavOpen(false)}>
              <MenuItem className="flex items-center gap-2 rounded-none border-b border-gray-300">
                Support
              </MenuItem>
            </Link>

            <Button
              className="text-sm font-semibold w-full text-black bg-white border-2 border-green rounded-2xl px-8 py-2.5 hover:bg-green hover:text-white transition-colors duration-200"
              onClick={() => {
                navigate("/homecare");
                setIsNavOpen(false);
              }}
            >
              Book an appointment
            </Button>

            <div className="mt-2 flex flex-col gap-1 text-sm text-black px-4">
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
