import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Users,
  GraduationCap,
  Calendar,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Settings,
  HelpCircle,
} from "lucide-react";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

interface NavItem {
  title: string;
  icon: React.ReactNode;
  href: string;
}

const mainNavItems: NavItem[] = [
  { title: "Enquiries", icon: <Users className="w-5 h-5" />, href: "/" },
  {
    title: "Courses",
    icon: <GraduationCap className="w-5 h-5" />,
    href: "/courses",
  },
  {
    title: "Appointments",
    icon: <Calendar className="w-5 h-5" />,
    href: "/appointments",
  },
  {
    title: "Reports",
    icon: <BarChart3 className="w-5 h-5" />,
    href: "/reports",
  },
];

const bottomNavItems: NavItem[] = [
  {
    title: "Settings",
    icon: <Settings className="w-5 h-5" />,
    href: "/settings",
  },
  { title: "Help", icon: <HelpCircle className="w-5 h-5" />, href: "/help" },
];

export default function Sidebar({
  collapsed = false,
  onToggle = () => {},
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    onToggle();
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-background border-r transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo Area */}
      <div className="h-14 flex items-center justify-between px-4 border-b">
        {!isCollapsed && (
          <span className="font-semibold text-lg">SMS Admin</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={toggleSidebar}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Main Navigation */}
      <ScrollArea className="flex-1 py-2">
        <nav className="space-y-2 px-2">
          {mainNavItems.map((item) => (
            <TooltipProvider key={item.title}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      isCollapsed ? "px-2" : "px-4",
                    )}
                  >
                    {item.icon}
                    {!isCollapsed && <span className="ml-2">{item.title}</span>}
                  </Button>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">{item.title}</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>
      </ScrollArea>

      {/* Bottom Navigation */}
      <div className="mt-auto py-2">
        <Separator className="my-2" />
        <nav className="space-y-2 px-2">
          {bottomNavItems.map((item) => (
            <TooltipProvider key={item.title}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      isCollapsed ? "px-2" : "px-4",
                    )}
                  >
                    {item.icon}
                    {!isCollapsed && <span className="ml-2">{item.title}</span>}
                  </Button>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">{item.title}</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>
      </div>
    </div>
  );
}
