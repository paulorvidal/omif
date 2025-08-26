import OmifIcon from "../../assets/omif-icon.svg";
import { type LucideProps } from "lucide-react";
import {
  useState,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";
import { NavLink } from "react-router-dom";

type Link = {
  title: string;
  link?: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  onClick?: () => void;
};

type SidebarDesktopProps = {
  linksCenter: Link[];
  linksBottom: Link[];
};

export const SidebarDesktop = ({
  linksCenter,
  linksBottom,
}: SidebarDesktopProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`bottom-0 left-0 hidden h-screen flex-col items-start duration-200 md:fixed md:flex ${isOpen ? "w-72" : "w-14"
        } z-50 gap-1 bg-green-600 p-2 text-slate-50 shadow-md`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="flex w-full flex-col gap-1">
        <NavLink
          to="/avisos"
          className={({ isActive }) =>
            `flex w-full cursor-pointer items-center rounded-sm duration-300 hover:bg-green-500 active:bg-green-500 ${isActive && isOpen ? "bg-green-500/50" : ""
            }`
          }
        >
          <div
            className={`h-10 w-10 shrink-0 cursor-pointer rounded-sm duration-300 hover:bg-green-500 active:bg-green-500 ${isOpen ? "bg-transparent" : "bg-green-500"
              }`}
          >
            <img
              className="h-full w-full p-2"
              src={OmifIcon}
              alt="Logo da Omif"
            />
          </div>
          <p
            className={`font-semibold text-nowrap ${isOpen ? "flex" : "hidden"}`}
          >
            Página Inicial
          </p>
        </NavLink>
      </div>
      <div className="h-0.5 w-full bg-white/30"></div>
      {linksCenter.map((link, index) => {
        const Icon = link.icon;

        if (link.link) {
          return (
            <NavLink
              to={link.link}
              key={index}
              className="flex w-full cursor-pointer items-center rounded-sm duration-500 hover:bg-green-500 active:bg-green-500"
            >
              <div className="h-10 w-10 shrink-0 rounded-sm">
                <Icon className="h-10 w-10 p-2" />
              </div>
              <p
                className={`font-semibold text-nowrap ${isOpen ? "flex" : "hidden"}`}
              >
                {link.title}
              </p>
            </NavLink>
          );
        } else {
          return (
            <div
              key={index}
              className="flex w-full cursor-pointer items-center rounded-sm duration-500 hover:bg-green-500 active:bg-green-500"
            >
              <div className="h-10 w-10 shrink-0 rounded-sm">
                <Icon className="h-10 w-10 p-2" />
              </div>
              <p
                className={`font-semibold text-nowrap ${isOpen ? "flex" : "hidden"}`}
              >
                {link.title}
              </p>
            </div>
          );
        }
      })}

      <div className="flex w-full flex-1 flex-col justify-end gap-1">
        {linksBottom.map((link, index) => {
          const Icon = link.icon;
          if (link.onClick) {
            return (
              <div
                key={index}
                onClick={link.onClick}
                className="flex w-full cursor-pointer items-center rounded-sm duration-500 hover:bg-green-500 active:bg-green-500"
              >
                <div className="h-10 w-10 shrink-0 rounded-sm">
                  <Icon className="h-10 w-10 p-2" />
                </div>
                <p
                  className={`font-semibold text-nowrap ${isOpen ? "flex" : "hidden"}`}
                >
                  {link.title}
                </p>
              </div>
            );
          }
          return (
            <div
              key={index}
              className="flex w-full cursor-pointer items-center rounded-sm duration-500 hover:bg-green-500 active:bg-green-500"
            >
              <div className="h-10 w-10 shrink-0 rounded-sm">
                <Icon className="h-10 w-10 p-2" />
              </div>
              <p
                className={`font-semibold text-nowrap ${isOpen ? "flex" : "hidden"}`}
              >
                {link.title}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
