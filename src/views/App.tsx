import { useRef, useState } from "react";
import {
  useCopyToClipboard,
  useEvent,
  useLocalStorage,
  useMount,
  useSearchParam,
  useUnmount,
  useUpdateEffect,
} from "react-use";
import Editor from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { toast, Toaster } from "sonner";
import classNames from "classnames";
import { CopyIcon } from "lucide-react";

import { ThemeProvider } from "../components/theme/theme-provider";
import Header from "../components/header/header";
import { Auth, HtmlHistory } from "../../utils/types";
import { defaultHTML } from "../../utils/consts";
import Preview from "../components/preview/preview";
import Footer from "../components/footer/footer";
import AskAI from "../components/ask-ai/ask-ai";

export default function App() {
  const [htmlStorage, , removeHtmlStorage] = useLocalStorage("html_content");
  const remix = useSearchParam("remix");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, copyToClipboard] = useCopyToClipboard();

  const preview = useRef<HTMLDivElement>(null);
  const editor = useRef<HTMLDivElement>(null);
  const resizer = useRef<HTMLDivElement>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const monacoRef = useRef<any>(null);

  const [html, setHtml] = useState((htmlStorage as string) ?? defaultHTML);
  const [isAiWorking, setisAiWorking] = useState(false);
  const [auth, setAuth] = useState<Auth | undefined>(undefined);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [htmlHistory, setHtmlHistory] = useState<HtmlHistory[]>([]);
  const [currentTab, setCurrentTab] = useState("chat");
  const [isResizing, setIsResizing] = useState(false);

  const fetchMe = async () => {
    const res = await fetch("/api/@me");
    if (res.ok) {
      const data = await res.json();
      setAuth(data);
    } else {
      setAuth(undefined);
    }
  };

  const fetchRemix = async () => {
    if (!remix) return;
    const res = await fetch(`/api/remix/${remix}`);
    if (res.ok) {
      const data = await res.json();
      if (data.html) {
        setHtml(data.html);
        toast.success("Remix content loaded successfully.");
      }
    } else {
      toast.error("Failed to load remix content.");
    }
    const url = new URL(window.location.href);
    url.searchParams.delete("remix");
    window.history.replaceState({}, document.title, url.toString());
  };

  /**
   * Resets the layout based on screen size
   * - For desktop: Sets editor to 1/3 width and preview to 2/3
   * - For mobile: Removes inline styles to let CSS handle it
   */
  const resetLayout = () => {
    if (!editor.current || !preview.current) return;

    // lg breakpoint is 1024px based on useBreakpoint definition and Tailwind defaults
    if (window.innerWidth >= 1024) {
      // Set initial 1/3 - 2/3 sizes for large screens, accounting for resizer width
      const resizerWidth = resizer.current?.offsetWidth ?? 8; // w-2 = 0.5rem = 8px
      const availableWidth = window.innerWidth - resizerWidth;
      const initialEditorWidth = availableWidth / 3; // Editor takes 1/3 of space
      const initialPreviewWidth = availableWidth - initialEditorWidth; // Preview takes 2/3
      editor.current.style.width = `${initialEditorWidth}px`;
      preview.current.style.width = `${initialPreviewWidth}px`;
    } else {
      // Remove inline styles for smaller screens, let CSS flex-col handle it
      editor.current.style.width = "";
      preview.current.style.width = "";
    }
  };

  /**
   * Handles resizing when the user drags the resizer
   * Ensures minimum widths are maintained for both panels
   */
  const handleResize = (e: MouseEvent) => {
    if (!editor.current || !preview.current || !resizer.current) return;

    const resizerWidth = resizer.current.offsetWidth;
    const minWidth = 100; // Minimum width for editor/preview
    const maxWidth = window.innerWidth - resizerWidth - minWidth;

    const editorWidth = e.clientX;
    const clampedEditorWidth = Math.max(
      minWidth,
      Math.min(editorWidth, maxWidth)
    );
    const calculatedPreviewWidth =
      window.innerWidth - clampedEditorWidth - resizerWidth;

    editor.current.style.width = `${clampedEditorWidth}px`;
    preview.current.style.width = `${calculatedPreviewWidth}px`;
  };

  const handleMouseDown = () => {
    setIsResizing(true);
    document.addEventListener("mousemove", handleResize);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    document.removeEventListener("mousemove", handleResize);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  useMount(() => {
    fetchMe();
    fetchRemix();

    if (htmlStorage) {
      removeHtmlStorage();
      toast.warning("Previous HTML content restored from local storage.");
    }

    resetLayout();
    if (!resizer.current) return;
    resizer.current.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("resize", resetLayout);
  });
  useUnmount(() => {
    document.removeEventListener("mousemove", handleResize);
    document.removeEventListener("mouseup", handleMouseUp);
    if (resizer.current) {
      resizer.current.removeEventListener("mousedown", handleMouseDown);
    }
    window.removeEventListener("resize", resetLayout);
  });

  // Prevent accidental navigation away when AI is working or content has changed
  useEvent("beforeunload", (e) => {
    if (isAiWorking || html !== defaultHTML) {
      e.preventDefault();
      return "";
    }
  });

  useUpdateEffect(() => {
    if (currentTab === "chat") {
      // Reset editor width when switching to reasoning tab
      resetLayout();
      // re-add the event listener for resizing
      if (resizer.current) {
        resizer.current.addEventListener("mousedown", handleMouseDown);
      }
    } else {
      if (preview.current) {
        // Reset preview width when switching to preview tab
        preview.current.style.width = "100%";
      }
    }
  }, [currentTab]);

  return (
    <ThemeProvider
      defaultTheme="dark"
      storageKey="codefusion-ui-theme"
      className="h-screen bg-slate-100 dark:bg-neutral-950 flex flex-col"
    >
      <Header tab={currentTab} onNewTab={setCurrentTab} />
      <main className="bg-neutral-950 flex-1 max-lg:flex-col flex w-full">
        {currentTab === "chat" && (
          <>
            <div ref={editor} className="relative">
              <CopyIcon
                className="size-4 absolute top-2 right-5 text-neutral-500 hover:text-neutral-300 z-2 cursor-pointer"
                onClick={() => {
                  copyToClipboard(html);
                  toast.success("HTML copied to clipboard!");
                }}
              />
              <Editor
                language="html"
                theme="vs-dark"
                className={classNames(
                  "h-[calc(100dvh-98px)] lg:h-full bg-neutral-900 transition-all duration-200 ",
                  {
                    "pointer-events-none": isAiWorking,
                  }
                )}
                options={{
                  colorDecorators: true,
                  fontLigatures: true,
                  theme: "vs-dark",
                  minimap: { enabled: false },
                  scrollbar: {
                    horizontal: "hidden",
                  },
                }}
                value={html}
                onChange={(value) => {
                  const newValue = value ?? "";
                  setHtml(newValue);
                }}
                onMount={(editor, monaco) => {
                  editorRef.current = editor;
                  monacoRef.current = monaco;
                }}
              />
              <AskAI
                html={html}
                setHtml={(newHtml: string) => {
                  setHtml(newHtml);
                }}
                htmlHistory={htmlHistory}
                onSuccess={(
                  finalHtml: string,
                  p: string,
                  updatedLines?: number[][]
                ) => {
                  const currentHistory = [...htmlHistory];
                  currentHistory.unshift({
                    html: finalHtml,
                    createdAt: new Date(),
                    prompt: p,
                  });
                  setHtmlHistory(currentHistory);
                  // if xs or sm
                  if (window.innerWidth <= 1024) {
                    setCurrentTab("preview");
                  }
                  if (updatedLines && updatedLines?.length > 0) {
                    const decorations = updatedLines.map((line) => ({
                      range: new monacoRef.current.Range(
                        line[0],
                        1,
                        line[1],
                        1
                      ),
                      options: {
                        inlineClassName: "matched-line",
                      },
                    }));
                    setTimeout(() => {
                      editorRef?.current
                        ?.getModel()
                        ?.deltaDecorations([], decorations);

                      editorRef.current?.revealLine(updatedLines[0][0]);
                    }, 100);
                  }
                }}
                isAiWorking={isAiWorking}
                setisAiWorking={setisAiWorking}
                onNewPrompt={() => {
                  // No need to update prompts as it's not used in the new code
                }}
                onScrollToBottom={() => {
                  editorRef.current?.revealLine(
                    editorRef.current?.getModel()?.getLineCount() ?? 0
                  );
                }}
              />
            </div>
            <div
              ref={resizer}
              className="bg-neutral-800 hover:bg-sky-500 active:bg-sky-500 w-1.5 cursor-col-resize h-full max-lg:hidden"
            />
          </>
        )}
        <Preview
          html={html}
          isResizing={isResizing}
          isAiWorking={isAiWorking}
          ref={preview}
          device={device}
          currentTab={currentTab}
          iframeRef={iframeRef}
        />
      </main>
      <Footer
        onReset={() => {
          if (isAiWorking) {
            toast.warning("Please wait for the AI to finish working.");
            return;
          }
          if (
            window.confirm("You're about to reset the editor. Are you sure?")
          ) {
            setHtml(defaultHTML);
            removeHtmlStorage();
            editorRef.current?.revealLine(
              editorRef.current?.getModel()?.getLineCount() ?? 0
            );
          }
        }}
        htmlHistory={htmlHistory}
        setHtml={setHtml}
        iframeRef={iframeRef}
        auth={auth}
        device={device}
        setDevice={setDevice}
      />
      <Toaster richColors position="bottom-center" />
    </ThemeProvider>
  );
}
