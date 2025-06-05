/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaPowerOff } from "react-icons/fa6";
import { Auth } from "./../../../utils/types";

function DeployButton({
  auth,
}: {
  html: string;
  error: boolean;
  auth?: Auth;
  setHtml: (html: string) => void;
  prompts: string[];
}) {
  return (
    <div className="flex items-center justify-end gap-5">
      <div className="relative flex items-center justify-end">
        {auth &&
          (auth.isLocalUse ? (
            <>
              <div className="bg-amber-500/10 border border-amber-10 text-amber-500 font-semibold leading-5 lg:leading-6 py-1 px-5 text-xs lg:text-sm rounded-md mr-4 select-none">
                Local Usage
              </div>
            </>
          ) : (
            <>
              <button
                className="mr-2 cursor-pointer"
                onClick={() => {
                  if (confirm("Are you sure you want to log out?")) {
                    // go to /auth/logout page
                    window.location.href = "/auth/logout";
                  }
                }}
              >
                <FaPowerOff className="text-lg text-red-500" />
              </button>
              <p className="mr-3 text-xs lg:text-sm text-gray-300">
                <span className="max-lg:hidden">Connected as </span>
                <a
                  href={`https://huggingface.co/${auth.preferred_username}`}
                  target="_blank"
                  className="underline hover:text-white"
                >
                  {auth.preferred_username}
                </a>
              </p>
            </>
          ))}
      </div>
    </div>
  );
}

export default DeployButton;
