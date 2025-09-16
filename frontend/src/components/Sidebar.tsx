import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Home, Box } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";

const navItems = [
  { label: "Início", icon: <Home className="h-5 w-5" />, path: "/dashboard" },
  {
    label: "Meus Ativos",
    icon: <Box className="h-5 w-5" />,
    path: "/my-assets",
  },
];

export const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar className="flex flex-col w-56  text-white">
      {/* Header */}
      <SidebarHeader className="bg-black flex items-center justify-between px-4 py-2 border-b border-gray-700 min-h-[3rem] !p-3">
        <h2 className="text-2xl text-purple-200 font-bold">Zyfira</h2>
      </SidebarHeader>

      {/* Content / Menu */}
      <SidebarContent className="bg-black !p-3 not-visited:flex-1 overflow-y-auto !gap-1.5">
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map(({ label, icon, path }) => {
              const isActive = location.pathname === path;
              return (
                <SidebarMenuItem key={label} className="mb-1">
                  <SidebarMenuButton
                    onClick={() => navigate(path)}
                    className={`flex items-center w-full !px-2 !py-5 rounded-md transition-colors duration-500 
                      ${
                        isActive
                          ? "text-blue-500 bg-gray-800"
                          : "hover:bg-gray-300 hover:text-black"
                      }`}
                  >
                    {icon}
                    <span className="ml-2 text-lg">{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="bg-black !p-5 px-4 py-4 border-t border-gray-700">
        <ProfileMenu />
      </SidebarFooter>
    </Sidebar>
  );
};
