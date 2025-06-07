import classNames from "classnames";
import { useState } from "react";
import { toast } from "sonner";

import SpaceIcon from "@/assets/space.svg";
import Loading from "../loading/loading";
import { Auth } from "../../../utils/types";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

function LoadButton({
  auth,
  setHtml,
  setPath,
}: {
  auth?: Auth;
  setHtml: (html: string) => void;
  setPath: (path?: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState<string | undefined>(undefined);

  const loadSpace = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/remix/${url}`);
      const data = await res.json();
      if (res.ok) {
        if (data.html) {
          setHtml(data.html);
          toast.success("Space loaded successfully.");
        }
        if (data.isOwner) {
          setPath(data.path);
        } else {
          setPath(undefined);
        }
        setOpen(false);
      } else {
        toast.error(data.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div
      className={classNames("max-md:hidden", {
        "border-r border-gray-700 pr-5": auth,
      })}
    >
      <Popover>
        <PopoverTrigger asChild>
          <p
            className="underline hover:text-white cursor-pointer text-xs lg:text-sm text-gray-300"
            onClick={() => setOpen(!open)}
          >
            Load Space
          </p>
        </PopoverTrigger>
        <PopoverContent
          className="!rounded-2xl p-0 overflow-hidden !bg-neutral-900"
          align="end"
        >
          <header className="flex items-center text-sm px-4 py-3 border-b gap-2 bg-neutral-950 border-neutral-800 font-semibold text-neutral-200">
            <span className="text-xs bg-pink-500 text-white rounded-full pl-1.5 pr-2.5 py-0.5 flex items-center justify-start gap-1.5">
              <img src={SpaceIcon} alt="Space Icon" className="size-4" />
              Space
            </span>
            Load Project
          </header>
          <main className="px-4 pt-3 pb-4 space-y-3">
            <p className="text-sm text-neutral-300 bg-neutral-300/15 border border-neutral-300/15 rounded-md px-3 py-2">
              Load an existing CodeFusion Space to continue working on it.
            </p>
            <label className="block">
              <p className="text-muted-foreground text-sm mb-1.5">Space URL</p>
              <Input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://huggingface.co/spaces/username/space-name"
                onBlur={(e) => {
                  if (!e.target.value) {
                    return setUrl(undefined);
                  }
                  if (
                    !e.target.value.startsWith(
                      "https://huggingface.co/spaces/"
                    ) &&
                    !e.target.value.includes("/")
                  ) {
                    toast.error("Please enter a valid Hugging Face Space URL.");
                    return;
                  }
                  const pathParts = e.target.value.split("/");
                  setUrl(
                    `${pathParts[pathParts.length - 2]}/${
                      pathParts[pathParts.length - 1]
                    }`
                  );
                }}
              />
            </label>
            <div className="pt-2 text-right">
              <Button
                size="sm"
                variant="default"
                disabled={loading || !url}
                onClick={loadSpace}
              >
                Load space
                {loading && <Loading />}
              </Button>
            </div>
          </main>
        </PopoverContent>
      </Popover>
    </div>
  );
}
export default LoadButton;
