import { useState } from "react";
import NavLinks from "./NavLinks";
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
import { NavData } from "../Mock/navData";
import { useSelector, useDispatch } from "react-redux";
import { setLogOut } from "../slices/authSlice";
import { jwtDecode } from "jwt-decode";
import { MdOutlineMailOutline, MdOutlinePhoneInTalk } from "react-icons/md";
import { BiChevronDown } from "react-icons/bi";

import { FaUser, FaUserMd } from "react-icons/fa"; // for patient and physio icons
import LoginGuide from "../pages/LoginGuide";

export default function Navbar() {
  const user =
    localStorage.getItem("user") && JSON.parse(localStorage.getItem("user"));
  const decoded = user && jwtDecode(user?.userToken);
  const patientName = decoded?.patient?.fullName;
  const physioName = decoded?.physio?.fullName;
  const isUser = useSelector((e) => e.auth.user);
  const userType = localStorage.getItem("userType");

  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const closeMenu = () => setIsMenuOpen(false);
  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  return (
    <>
      <LoginGuide openLoginMenu={() => setIsMenuOpen(true)} />
      <header className="hidden bg-[#F1F9F4] py-4 px-6 lg:flex justify-between items-center">
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
                  className="text-sm text-black cursor-pointer guide-desktop-login-btn"
                  to="/login"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(!isMenuOpen);
                    setIsMenuOpen(false);
                    setIsNavOpen(false);
                    localStorage.setItem("userType", "patient");
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
                <Link to={"/profile"} variant="small" className="font-normal">
                  <MenuItem> Hi, {patientName ?? "User"}</MenuItem>
                </Link>
                <Link
                  to={"/order-history"}
                  variant="small"
                  className="font-normal"
                >
                  <MenuItem
                    key={2}
                    onClick={closeMenu}
                    className={`flex items-center gap-2 rounded`}
                  >
                    Order History
                  </MenuItem>
                </Link>
                <MenuItem
                  key={3}
                  className={`flex items-center gap-2 rounded`}
                  onClick={() => {
                    closeMenu();
                    localStorage.removeItem("user");
                    localStorage.removeItem("userType");
                    dispatch(setLogOut());
                    navigate("../");
                  }}
                >
                  <Typography
                    as="span"
                    variant="small"
                    className="font-normal text-red-600 hover:text-red-900"
                  >
                    Sign Out
                  </Typography>
                </MenuItem>
              </MenuList>
            </Menu>
          )}
          <Link className="text-sm text-black" to={"/contact"}>
            Support
          </Link>
        </div>
      </header>

      <div className="max-w-[100vw] p-3 text-black rounded-none bg-[#F8F9FA] shadow-none">
        <div className="relative mx-auto flex items-center justify-between px-2 md:px-8">
          <Link to="/">
            <img
              src={"/logo-nobg.png"}
              alt="Physio_logo"
              loading="lazy"
              className="w-[100px] md:w-[120px] py-1 md:py-2"
            />
          </Link>
          <div className="hidden lg:block">
            <NavLinks />
          </div>
          <IconButton
            size="sm"
            color="blue-gray"
            variant="text"
            onClick={toggleIsNavOpen}
            className="ml-auto mr-4 lg:hidden guide-mobile-menu-btn"
          >
            {isNavOpen ? (
              <IoMdClose className="h-6 w-6" />
            ) : (
              <IoMdMenu className="h-6 w-6" />
            )}
          </IconButton>

          <Button
            onClick={() => navigate("/physios")}
            className="hidden md:block text-nowrap text-sm lg:text-base font-bold  text-black  bg-white border-2  border-green w-fit rounded-2xl px-8 py-2.5 active:bg-green active:text-white   transition-colors duration-200"
          >
            Book an appointment
          </Button>
        </div>

        <Collapse open={isNavOpen} className="overflow-y-auto">
          {isNavOpen && (
            <ul className="lg:hidden mt-2 mb-4 flex flex-col gap-2">
              <>
                {NavData.map((data) => (
                  <Link
                    to={data.slug}
                    key={data.id}
                    onClick={() => setIsNavOpen(false)}
                  >
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-medium text-black"
                    >
                      <MenuItem className="flex items-center gap-2 rounded-none border-b border-gray-300">
                        {data.name}
                      </MenuItem>
                    </Typography>
                  </Link>
                ))}
                {isUser ? (
                  <>
                    <div>
                      <Typography
                        as="div"
                        variant="small"
                        className="font-medium border-b border-gray-300"
                      >
                        <ListItem
                          className="focus:!bg-transparent flex items-center justify-between gap-2 py-2 pr-4 font-medium text-black"
                          selected={isMobileMenuOpen}
                          onClick={() => {
                            setIsMobileMenuOpen((cur) => !cur);
                          }}
                        >
                          <Link
                            to={"/profile"}
                            variant="small"
                            className="font-normal"
                            onClick={() => setIsNavOpen(false)}
                          >
                            <div className="cursor-pointer text-sm text-green">
                              Hi, {patientName ?? "User"}
                            </div>
                          </Link>
                          <BiChevronDown
                            strokeWidth={2.5}
                            className={`block h-3 w-3 transition-transform lg:hidden ${
                              isMobileMenuOpen ? "rotate-180" : ""
                            }`}
                          />
                        </ListItem>
                      </Typography>
                    </div>
                    <div className="block lg:hidden -mt-2">
                      <Collapse open={isMobileMenuOpen}>
                        <Link
                          to={"/order-history"}
                          variant="small"
                          className="font-normal"
                        >
                          <MenuItem
                            key={2}
                            onClick={() => {
                              closeMenu();
                              setIsNavOpen(false);
                            }}
                            className={`flex items-center gap-2 rounded text-sm`}
                          >
                            Order History
                          </MenuItem>
                        </Link>
                        <MenuItem
                          key={3}
                          className={`flex items-center gap-2 rounded text-sm text-red-600 hover:text-red-900`}
                          onClick={() => {
                            closeMenu();
                            localStorage.removeItem("user");
                            localStorage.removeItem("userType");
                            dispatch(setLogOut());
                            navigate("../");
                          }}
                        >
                          Sign Out
                        </MenuItem>
                      </Collapse>
                    </div>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => {
                      setIsNavOpen(false);
                      localStorage.setItem("userType", "patient");
                    }}
                    className="guide-mobile-login-btn"
                  >
                    <div className="px-4 py-2 text-sm font-medium text-black border-b border-gray-300 hover:bg-gray-100">
                      Login
                    </div>
                  </Link>
                )}
                <Link to={"/contact"} onClick={() => setIsNavOpen(false)}>
                  <Typography
                    variant="small"
                    color="gray"
                    className="font-medium text-black mb-2"
                  >
                    <MenuItem className="flex items-center gap-2 rounded-none border-b border-gray-300">
                      Support
                    </MenuItem>
                  </Typography>
                </Link>

                <Button
                  className="text-nowrap text-sm lg:text-base font-semibold w-full text-black bg-white border-2 border-green rounded-2xl px-8 py-2.5 active:bg-green active:text-white transition-colors duration-200 "
                  onClick={() => {
                    navigate("/physios");
                    setIsNavOpen(false);
                  }}
                >
                  Book an appointment
                </Button>

                <div className="cursor-pointer mt-2 flex items-center space-x-2 font-medium text-blue-gray-500 mb-2">
                  <MdOutlinePhoneInTalk className="w-4 h-4 text-black" />
                  <span className="text-sm text-black">+91 8107333576</span>
                </div>
                <div className="cursor-pointer flex items-center space-x-2 font-medium text-blue-gray-500 mb-2">
                  <MdOutlineMailOutline className="w-4 h-4 text-black" />
                  <span className="text-sm text-black">
                    info@physioplushealthcare.com
                  </span>
                </div>
              </>
            </ul>
          )}
        </Collapse>
      </div>
    </>
  );
}
