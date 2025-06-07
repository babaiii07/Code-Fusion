import classNames from "classnames";

import { toast } from "sonner";
import { GridPattern } from "./../magicui/grid-pattern";
import { cn } from "../../lib/utils";

function Preview({
  html,
  isResizing,
  isAiWorking,
  ref,
  device,
  currentTab,
  iframeRef,
}: {
  html: string;
  isResizing: boolean;
  isAiWorking: boolean;
  ref: React.RefObject<HTMLDivElement | null>;
  iframeRef?: React.RefObject<HTMLIFrameElement | null>;
  device: "desktop" | "mobile";
  currentTab: string;
}) {
  return (
    <div
      ref={ref}
      className={classNames(
        "w-full border-l border-gray-900 h-full relative z-0 flex items-center justify-center",
        {
          "lg:p-4": currentTab !== "preview",
        }
      )}
      onClick={(e) => {
        if (isAiWorking) {
          e.preventDefault();
          e.stopPropagation();
          toast.warning("Please wait for the AI to finish working.");
        }
      }}
    >
      <GridPattern
        x={-1}
        y={-1}
        strokeDasharray={"4 2"}
        className={cn(
          "[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]"
        )}
      />
      <iframe
        id="preview-iframe"
        ref={iframeRef}
        title="output"
        className={classNames(
          "w-full select-none transition-all duration-200 bg-black max-lg:h-full",
          {
            "pointer-events-none": isResizing || isAiWorking,
            "lg:max-w-md lg:mx-auto lg:h-[80dvh] lg:!rounded-[42px] lg:border-[8px] lg:border-neutral-700 lg:shadow-2xl":
              device === "mobile",
            "h-full": device === "desktop",
            "lg:border-[8px] lg:border-neutral-700 lg:shadow-2xl lg:rounded-[44px]":
              currentTab !== "preview" && device === "desktop",
          }
        )}
        srcDoc={html}
        onLoad={() => {
          if (iframeRef?.current?.contentWindow?.document?.body) {
            iframeRef.current.contentWindow.document.body.scrollIntoView({
              block: isAiWorking ? "end" : "start",
              inline: "nearest",
              behavior: isAiWorking ? "instant" : "smooth",
            });
          }
        }}
      />
    </div>
  );
}

export default Preview;
