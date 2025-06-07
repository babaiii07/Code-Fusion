import classNames from "classnames";
import { FaMobileAlt, FaUserCircle } from "react-icons/fa";
import { ChevronDown, LogOut, RefreshCcw } from "lucide-react";
import { FaLaptopCode } from "react-icons/fa6";
import { Auth, HtmlHistory } from "../../../utils/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MdAdd } from "react-icons/md";
import History from "../history/history";

const DEVICES = [
  {
    name: "desktop",
    icon: FaLaptopCode,
  },
  {
    name: "mobile",
    icon: FaMobileAlt,
  },
];

function Footer({
  onReset,
  auth,
  htmlHistory,
  setHtml,
  device,
  setDevice,
  iframeRef,
}: {
  onReset: () => void;
  auth?: Auth;
  htmlHistory?: HtmlHistory[];
  device: "desktop" | "mobile";
  setHtml: (html: string) => void;
  iframeRef?: React.RefObject<HTMLIFrameElement | null>;
  setDevice: React.Dispatch<React.SetStateAction<"desktop" | "mobile">>;
}) {
  const handleRefreshIframe = () => {
    if (iframeRef?.current) {
      const iframe = iframeRef.current;
      const content = iframe.srcdoc;
      iframe.srcdoc = "";
      setTimeout(() => {
        iframe.srcdoc = content;
      }, 10);
    }
  };

  return (
    <footer className="border-t bg-slate-200 border-slate-300 dark:bg-neutral-950 dark:border-neutral-800 px-3 py-2 flex items-center justify-between sticky bottom-0 z-20">
      <div className="flex items-center gap-2">
        {auth && !auth.isLocalUse && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <p className="mr-3 text-xs lg:text-sm text-gray-300 flex items-center gap-1 cursor-pointer hover:brightness-110">
                <ChevronDown className="size-4" />
                <Avatar className="size-6 mr-1">
                  <AvatarImage src={auth?.picture} alt="@shadcn" />
                  <AvatarFallback className="text-sm">
                    {auth?.preferred_username?.charAt(0).toUpperCase() ?? "E"}
                  </AvatarFallback>
                </Avatar>
                {auth?.preferred_username ?? "parthib"}
              </p>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel className="font-bold flex items-center gap-2 justify-start">
                <FaUserCircle className="" />
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <a
                  href="https://huggingface.co/settings/billing"
                  target="_blank"
                >
                  <DropdownMenuItem>Usage Quota</DropdownMenuItem>
                </a>
                <a
                  href={`https://huggingface.co/${auth?.preferred_username}`}
                  target="_blank"
                >
                  <DropdownMenuItem>Hugging Face profile</DropdownMenuItem>
                </a>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  if (confirm("Are you sure you want to log out?")) {
                    // go to /auth/logout page
                    window.location.href = "/auth/logout";
                  }
                }}
              >
                <LogOut className="size-4 text-red-500" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {auth && <p className="text-neutral-700">|</p>}
        <Button size="sm" variant="secondary" onClick={onReset}>
          <MdAdd className="text-sm" />
          <span>New Project</span>
        </Button>
        {htmlHistory && htmlHistory.length > 0 && (
          <>
            <p className="text-neutral-700">|</p>
            <History history={htmlHistory} setHtml={setHtml} />
          </>
        )}
      </div>
      <div className="flex justify-end items-center gap-2.5">
        <Button size="sm" variant="default" onClick={handleRefreshIframe}>
          <RefreshCcw className="size-3.5" />
          <span className="max-lg:hidden">Refresh Preview</span>
        </Button>
        <div className="flex items-center rounded-full p-0.5 bg-neutral-700/70 relative overflow-hidden z-0 max-lg:hidden gap-0.5">
          <div
            className={classNames(
              "absolute left-0.5 top-0.5 rounded-full bg-white size-7 -z-[1] transition-all duration-200",
              {
                "translate-x-[calc(100%+2px)]": device === "mobile",
              }
            )}
          />
          {DEVICES.map((deviceItem) => (
            <button
              key={deviceItem.name}
              className={classNames(
                "rounded-full text-neutral-300 size-7 flex items-center justify-center cursor-pointer",
                {
                  "!text-black": device === deviceItem.name,
                  "hover:bg-neutral-800": device !== deviceItem.name,
                }
              )}
              onClick={() => setDevice(deviceItem.name as "desktop" | "mobile")}
            >
              <deviceItem.icon className="text-sm" />
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
