import { useState } from "react";
import { Paintbrush } from "lucide-react";
import { toast } from "sonner";

import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";
import Loading from "../loading/loading";

export default function ReImagine({
  onRedesign,
}: {
  onRedesign: (md: string) => void;
}) {
  const [url, setUrl] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkIfUrlIsValid = (url: string) => {
    const urlPattern = new RegExp(
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
      "i"
    );
    return urlPattern.test(url);
  };

  const handleClick = async () => {
    if (!url) {
      toast.error("Please enter a URL.");
      return;
    }
    if (!checkIfUrlIsValid(url)) {
      toast.error("Please enter a valid URL.");
      return;
    }
    // Here you would typically handle the re-design logic
    setIsLoading(true);
    const request = await fetch("/api/re-design", {
      method: "POST",
      body: JSON.stringify({ url }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await request.json();
    if (response.ok) {
      setOpen(false);
      setUrl("");
      onRedesign(response.markdown);
      toast.success("CodeFusion is re-designing your site! Let him cook... 🔥");
    } else {
      toast.error(response.message || "Failed to re-design the site.");
    }
    setIsLoading(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <form>
        <PopoverTrigger asChild>
          <Button
            size="iconXs"
            variant="outline"
            className="!border-neutral-600 !text-neutral-400 !hover:!border-neutral-500 hover:!text-neutral-300"
          >
            <Paintbrush className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="!rounded-2xl !p-5 !bg-white !border-neutral-100 min-w-xs text-center"
        >
          <header className="mb-5">
            <p className="text-xl font-semibold text-neutral-950">
              Re-Design your Site!
            </p>
            <p className="text-sm text-neutral-500 mt-1.5 mb-6">
              Try our new Re-Design feature to give your site a fresh look.
            </p>
            <hr className="bg-neutral-200 max-w-44 mx-auto" />
          </header>
          <main className="space-y-4">
            <div>
              <p className="text-sm text-neutral-700 mb-2">
                Enter your website URL to get started:
              </p>
              <Input
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onBlur={(e) => {
                  const inputUrl = e.target.value.trim();
                  if (!inputUrl) {
                    setUrl("");
                    return;
                  }
                  if (!checkIfUrlIsValid(inputUrl)) {
                    toast.error("Please enter a valid URL.");
                    return;
                  }
                  setUrl(inputUrl);
                }}
                className="!bg-white !border-neutral-300 !text-neutral-800 !placeholder:text-neutral-400 selection:!bg-blue-100"
              />
            </div>
            <div>
              <p className="text-sm text-neutral-700 mb-2">
                Then, let's re-design it!
              </p>
              <Button
                variant="gray"
                size="sm"
                onClick={handleClick}
                className="relative"
                disabled={isLoading}
              >
                Re-Design <Paintbrush className="size-4" />
                {isLoading && <Loading className="ml-2 size-4 animate-spin" />}
              </Button>
            </div>
          </main>
        </PopoverContent>
      </form>
    </Popover>
  );
}
