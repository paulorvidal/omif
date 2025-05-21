import {
  useState,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";
import OmifIcon from "../../assets/omif-icon.svg";
import {
  AlignJustify,
  CircleUserRound,
  X,
  type LucideProps,
} from "lucide-react";

type Link = {
  title: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
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
      <div className="absolute bottom-0 left-0 flex h-14 w-full items-center justify-around bg-green-600 text-white md:hidden">
        <div
          className="h-10 w-10 shrink-0 cursor-pointer rounded-sm hover:bg-green-500 active:bg-green-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          <AlignJustify className="h-10 w-10 p-2" />
        </div>
        <div className="h-10 w-10 shrink-0 cursor-pointer rounded-sm bg-green-500">
          <img
            className="h-full w-full p-2"
            src={OmifIcon}
            alt="Logo da Omif"
          />
        </div>
        <div className="h-10 w-10 shrink-0 cursor-pointer rounded-sm hover:bg-green-500 active:bg-green-500">
          <CircleUserRound className="h-10 w-10 p-2" />
        </div>
      </div>
      {isOpen && (
        <div
          className="absolute top-0 left-0 z-10 h-screen w-screen bg-zinc-950/50"
          onClick={() => setIsOpen(!isOpen)}
        ></div>
      )}
      <div
        className={`absolute top-0 left-0 z-20 h-screen w-72 flex-col items-start duration-100 ${isOpen ? "flex" : "hidden"} gap-1 bg-green-600 p-2 text-slate-50`}
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
          <div className="flex w-full cursor-pointer items-center rounded-sm duration-500 hover:bg-green-500 active:bg-green-500">
            <div className="h-10 w-10 shrink-0 rounded-sm">
              <CircleUserRound className="h-10 w-10 p-2" />
            </div>
            <p
              className={`font-semibold text-nowrap ${isOpen ? "flex" : "hidden"}`}
            >
              Perfil
            </p>
          </div>
          <div className="h-0.5 w-full bg-white/30"></div>
          {linksCenter.map((link, index) => {
            const Icon = link.icon;
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
        <div className="flex w-full flex-1 flex-col justify-end gap-1">
          {linksBottom.map((link, index) => {
            const Icon = link.icon;
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
