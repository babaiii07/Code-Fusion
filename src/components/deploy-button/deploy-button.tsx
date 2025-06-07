/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { toast } from "sonner";

import SpaceIcon from "@/assets/space.svg";
import Loading from "../loading/loading";
import Login from "../login/login";
import { Auth } from "./../../../utils/types";
import LoadButton from "../load-button/load-button";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const MsgToast = ({ url }: { url: string }) => (
  <div className="w-full flex items-center justify-center gap-3">
    Your space is live!
    <button
      className="bg-black text-sm block text-white rounded-md px-3 py-1.5 hover:bg-gray-900 cursor-pointer"
      onClick={() => {
        window.open(url, "_blank");
      }}
    >
      See Space
    </button>
  </div>
);

function DeployButton({
  html,
  auth,
  setHtml,
  prompts,
}: {
  html: string;
  auth?: Auth;
  setHtml: (html: string) => void;
  prompts: string[];
}) {
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState<string | undefined>(undefined);

  const [config, setConfig] = useState({
    title: "",
  });

  const createSpace = async () => {
    setLoading(true);

    try {
      const request = await fetch("/api/deploy", {
        method: "POST",
        body: JSON.stringify({
          title: config.title,
          path,
          html,
          prompts,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await request.json();
      if (response.ok) {
        toast.success(
          <MsgToast
            url={`https://huggingface.co/spaces/${response.path ?? path}`}
          />
        );
        setPath(response.path);
      } else {
        toast.error(response.message);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-5">
      <LoadButton auth={auth} setHtml={setHtml} setPath={setPath} />
      <div className="relative flex items-center justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <div>
              <Button variant="pink" className="max-lg:hidden">
                {path ? "Update Space" : "Deploy to Space"}
              </Button>
              <Button variant="pink" size="sm" className="lg:hidden">
                {path ? "Update" : "Deploy"}
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="!rounded-2xl p-0 overflow-hidden !bg-neutral-900"
            align="end"
          >
            {!auth ? (
              <Login html={html}>
                <p className="text-muted-foreground text-sm mb-3">
                  Host this project for free and share it with your friends.
                </p>
              </Login>
            ) : (
              <>
                <header className="flex items-center text-sm px-4 py-3 border-b gap-2 bg-neutral-950 border-neutral-800 font-semibold text-neutral-200">
                  <span className="text-xs bg-pink-500/10 text-pink-500 rounded-full pl-1.5 pr-2.5 py-0.5 flex items-center justify-start gap-1.5">
                    <img src={SpaceIcon} alt="Space Icon" className="size-4" />
                    Space
                  </span>
                  Configure Deployment
                </header>
                <main className="px-4 pt-3 pb-4 space-y-3">
                  <p className="text-xs text-amber-600 bg-amber-500/10 rounded-md p-2">
                    {path ? (
                      <span>
                        Your space is live at{" "}
                        <a
                          href={`https://huggingface.co/spaces/${path}`}
                          target="_blank"
                          className="underline hover:text-amber-700"
                        >
                          huggingface.co/{path}
                        </a>
                        . You can update it by deploying again.
                      </span>
                    ) : (
                      "Deploy your project to a space on the Hub. Spaces are a way to share your project with the world."
                    )}
                  </p>
                  {!path && (
                    <label className="block">
                      <p className="text-muted-foreground text-sm mb-1.5">
                        Space Title
                      </p>
                      <input
                        type="text"
                        value={config.title}
                        className="mr-2 border rounded-md px-3 py-1.5 border-gray-300 w-full text-sm"
                        placeholder="My Awesome Space"
                        onChange={(e) =>
                          setConfig({ ...config, title: e.target.value })
                        }
                      />
                    </label>
                  )}
                  <div className="pt-2 text-right">
                    <button
                      disabled={loading || (!path && !config.title)}
                      className="relative rounded-full bg-black px-5 py-2 text-white font-semibold text-xs hover:bg-black/90 transition-all duration-100 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
                      onClick={createSpace}
                    >
                      {path ? "Update Space" : "Create Space"}
                      {loading && <Loading />}
                    </button>
                  </div>
                </main>
              </>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export default DeployButton;
