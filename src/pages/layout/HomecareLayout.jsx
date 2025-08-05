import { Outlet } from "react-router-dom";
import NavbarNew from "../../components/homecare/NavbarNew";
import FooterNew from "../../components/homecare/FooterNew";
import ScrollToTop from "../../components/ScrollToTop";
const HomecareLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-Urbanist flex flex-col">
      <ScrollToTop />
      <NavbarNew />
      <main className="flex-grow">
        <Outlet />
      </main>
      <FooterNew />
    </div>
  );
};

export default HomecareLayout;
