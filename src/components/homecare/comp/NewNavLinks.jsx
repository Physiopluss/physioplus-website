import { NavLink } from "react-router-dom";
import { NewNavData } from "../Mock/NewNavData";
const NewNavLinks = () => {
  return (
    <div className="flex gap-x-1 lg:gap-x-2">
      {NewNavData.map((data) => (
        <NavLink
          key={data.id}
          to={data.slug}
          className={({ isActive }) =>
            `text-lg font-semibold px-2 xl:px-4 cursor-pointer hover:text-green  ${
              isActive
                ? "text-green  transition-transform hover:scale-105 "
                : "  transition transform hover:scale-105"
            }`
          }
        >
          {data.name}
        </NavLink>
      ))}
    </div>
  );
};
export default NewNavLinks;
