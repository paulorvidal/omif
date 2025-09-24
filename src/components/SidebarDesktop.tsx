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

  return (
    <div>teste</div>
  );
};
