/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from "classnames";
import { PiGearSixFill } from "react-icons/pi";
import { RiCheckboxCircleFill } from "react-icons/ri";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
// @ts-expect-error not needed
import { PROVIDERS, MODELS } from "./../../../utils/providers";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useMemo } from "react";
import { useUpdateEffect } from "react-use";

function Settings({
  open,
  onClose,
  provider,
  model,
  error,
  onChange,
  onModelChange,
}: {
  open: boolean;
  provider: string;
  model: string;
  error?: string;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  onChange: (provider: string) => void;
  onModelChange: (model: string) => void;
}) {
  const modelAvailableProviders = useMemo(() => {
    const availableProviders = MODELS.find(
      (m: { value: string }) => m.value === model
    )?.providers;
    if (!availableProviders) return Object.keys(PROVIDERS);
    return Object.keys(PROVIDERS).filter((id) =>
      availableProviders.includes(id)
    );
  }, [model]);

  useUpdateEffect(() => {
    if (provider !== "auto" && !modelAvailableProviders.includes(provider)) {
      onChange("auto");
    }
  }, [model, provider]);

  return (
    <div className="">
      <Popover open={open} onOpenChange={onClose}>
        <PopoverTrigger asChild>
          <Button variant="gray" size="sm">
            <PiGearSixFill className="size-4" />
            Settings
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="!rounded-2xl p-0 !w-96 overflow-hidden !bg-neutral-900"
          align="center"
        >
          <header className="flex items-center text-sm px-4 py-3 border-b gap-2 bg-neutral-950 border-neutral-800 font-semibold text-neutral-200">
            {/* <span className="text-xs bg-blue-500 text-white rounded-full px-1.5 py-0.5">
              Provider
            </span> */}
            Customize Settings
          </header>
          <main className="px-4 pt-5 pb-6 space-y-5">
            <a
              href="https://huggingface.co/spaces/parthib/codefusion/discussions/74"
              target="_blank"
              className="w-full flex items-center justify-between text-neutral-300 bg-neutral-300/15 border border-neutral-300/15 pl-4 p-1.5 rounded-full text-sm font-medium hover:brightness-95"
            >
              How to use it locally?
              <Button size="xs">See guide</Button>
            </a>
            {error !== "" && (
              <p className="text-red-500 text-sm font-medium mb-2 flex items-center justify-between bg-red-500/10 p-2 rounded-md">
                {error}
              </p>
            )}
            <label className="block">
              <p className="text-neutral-300 text-sm mb-2.5">
                Choose a DeepSeek model
              </p>
              <Select defaultValue={model} onValueChange={onModelChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a DeepSeek model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>DeepSeek models</SelectLabel>
                    {MODELS.map(
                      ({
                        value,
                        label,
                        isNew = false,
                      }: {
                        value: string;
                        label: string;
                        isNew?: boolean;
                      }) => (
                        <SelectItem key={value} value={value} className="">
                          {label}
                          {isNew && (
                            <span className="text-xs bg-gradient-to-br from-sky-400 to-sky-600 text-white rounded-full px-1.5 py-0.5">
                              New
                            </span>
                          )}
                        </SelectItem>
                      )
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </label>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-300 text-sm mb-1.5">
                    Use auto-provider
                  </p>
                  <p className="text-xs text-neutral-400/70">
                    We'll automatically select the best provider for you based
                    on your prompt.
                  </p>
                </div>
                <div
                  className={classNames(
                    "bg-neutral-700 rounded-full min-w-10 w-10 h-6 flex items-center justify-between p-1 cursor-pointer transition-all duration-200",
                    {
                      "!bg-sky-500": provider === "auto",
                    }
                  )}
                  onClick={() => {
                    const foundModel = MODELS.find(
                      (m: { value: string }) => m.value === model
                    );
                    if (provider === "auto") {
                      onChange(foundModel.autoProvider);
                    } else {
                      onChange("auto");
                    }
                  }}
                >
                  <div
                    className={classNames(
                      "w-4 h-4 rounded-full shadow-md transition-all duration-200 bg-neutral-200",
                      {
                        "translate-x-4": provider === "auto",
                      }
                    )}
                  />
                </div>
              </div>
              <label className="block">
                <p className="text-neutral-300 text-sm mb-2">
                  Inference Provider
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {modelAvailableProviders.map((id: string) => (
                    <Button
                      key={id}
                      variant={id === provider ? "default" : "secondary"}
                      size="sm"
                      onClick={() => {
                        onChange(id);
                      }}
                    >
                      <img
                        src={`/providers/${id}.svg`}
                        alt={PROVIDERS[id].name}
                        className="size-5 mr-2"
                      />
                      {PROVIDERS[id].name}
                      {id === provider && (
                        <RiCheckboxCircleFill className="ml-2 size-4 text-blue-500" />
                      )}
                    </Button>
                  ))}
                </div>
              </label>
            </div>
          </main>
        </PopoverContent>
      </Popover>
    </div>
  );
}
export default Settings;
