import {
  useState,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";
import OmifIcon from "../../assets/omif-icon.svg";
import { AlignJustify, LogOut, X, type LucideProps } from "lucide-react";
import { NavLink } from "react-router-dom";

type Link = {
  title: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  link?: string;
  onClick?: () => void;
};

type SidebarDesktopProps = {
  linksCenter: Link[];
  linksBottom: Link[];
};

export const SidebarMobile = ({
  linksCenter,
  linksBottom,
}: SidebarDesktopProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 left-0 z-30 flex h-14 w-full items-center justify-around bg-green-600 text-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.25)] md:hidden">
        <div
          className="h-10 w-10 shrink-0 cursor-pointer rounded-sm hover:bg-green-500 active:bg-green-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          <AlignJustify className="h-10 w-10 p-2" />
        </div>
        <NavLink to="/avisos" className="cursor-pointer rounded-sm bg-green-500 p-1">
          <img className="h-8 w-8" src={OmifIcon} alt="Logo da Omif" />
        </NavLink>
        <div className="h-10 w-10 shrink-0 cursor-pointer rounded-sm hover:bg-green-500 active:bg-green-500">
          <LogOut className="h-10 w-10 p-2" />
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed top-0 left-0 z-40 h-screen w-screen bg-zinc-950/50"
          onClick={() => setIsOpen(!isOpen)}
        ></div>
      )}
      <div
        className={`fixed top-0 left-0 z-50 h-screen w-72 flex-col items-start duration-100 ${isOpen ? "flex" : "hidden"} gap-1 bg-green-600 p-2 text-slate-50`}
      >
        <div className="flex w-full flex-col gap-1">
          <div
            className="flex w-full cursor-pointer justify-end"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            <X className="h-10 w-10 rounded-sm p-2 duration-500 hover:bg-green-500 active:bg-green-500" />
          </div>
          <div className="flex w-full">
            <div
              className={`flex items-center ${isOpen ? "bg-green-500" : "bg-transparent"} w-full cursor-pointer rounded-sm duration-500 hover:bg-green-500 active:bg-green-500`}
            >
              <div
                className={`h-10 w-10 shrink-0 ${isOpen ? "bg-transparent" : "bg-green-500"} cursor-pointer rounded-sm duration-500 hover:bg-green-500 active:bg-green-500`}
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
            </div>
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
        </div>
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
    </>
  );
};
