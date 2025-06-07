import { HtmlHistory } from "../../../utils/types";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";

export default function History({
  history,
  setHtml,
}: {
  history: HtmlHistory[];
  setHtml: (html: string) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="max-lg:hidden">
          {history?.length} edit{history.length !== 1 ? "s" : ""}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="!rounded-2xl !p-0 overflow-hidden !bg-neutral-900"
        align="start"
      >
        <header className="text-sm px-4 py-3 border-b gap-2 bg-neutral-950 border-neutral-800 font-semibold text-neutral-200">
          History
        </header>
        <main className="px-4 space-y-3">
          <ul className="max-h-[250px] overflow-y-auto">
            {history?.map((item, index) => (
              <li
                key={index}
                className="text-gray-300 text-xs py-2 border-b border-gray-800 last:border-0 flex items-center justify-between gap-2"
              >
                <div className="">
                  <span className="line-clamp-1">{item.prompt}</span>
                  <span className="text-gray-500 text-[10px]">
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "2-digit",
                    }) +
                      " " +
                      new Date(item.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                      })}
                  </span>
                </div>
                <button
                  className="bg-pink-500 text-white text-xs font-medium rounded-md px-2 py-1 transition-all duration-100 hover:bg-pink-600 cursor-pointer"
                  onClick={() => {
                    setHtml(item.html);
                  }}
                >
                  Select
                </button>
              </li>
            ))}
          </ul>
        </main>
      </PopoverContent>
    </Popover>
    // <div
    //         className="relative"
    //         onMouseEnter={() => setVisible(true)}
    //         onMouseLeave={() => setVisible(false)}
    //       >
    //         <button
    //           className={classNames(
    //             "text-gray-400 hover:text-gray-300 cursor-pointer text-sm nderline flex items-center justify-start gap-1",
    //             {
    //               "!text-gray-300": visible,
    //             }
    //           )}
    //         >
    //           <IoTimeOutline />
    //           {htmlHistory?.length} versions
    //         </button>
    //         <div
    //           className={classNames(
    //             "absolute bottom-0 left-0 min-w-sm w-full z-10 translate-y-full pt-2 transition-all duration-200",
    //             {
    //               "opacity-0 pointer-events-none": !visible,
    //             }
    //           )}
    //         >
    //           <div className="bg-gray-950 border border-gray-800 rounded-xl shadow-2xs p-4">
    //             <p className="text-xs font-bold text-white">Version History</p>
    //             <p className="text-gray-400 text-xs mt-1">
    //               This is a list of the full history of what AI has done to
    //               this.
    //             </p>
    //             <ul className="mt-2 max-h-[250px] overflow-y-auto">
    //               {htmlHistory?.map((item, index) => (
    //                 <li
    //                   key={index}
    //                   className="text-gray-300 text-xs py-2 border-b border-gray-800 last:border-0 flex items-center justify-between gap-2"
    //                 >
    //                   <div className="">
    //                     <span className="line-clamp-1">{item.prompt}</span>
    //                     <span className="text-gray-500 text-[10px]">
    //                       {new Date(item.createdAt).toLocaleDateString(
    //                         "en-US",
    //                         {
    //                           month: "2-digit",
    //                           day: "2-digit",
    //                           year: "2-digit",
    //                         }
    //                       ) +
    //                         " " +
    //                         new Date(item.createdAt).toLocaleTimeString(
    //                           "en-US",
    //                           {
    //                             hour: "2-digit",
    //                             minute: "2-digit",
    //                             second: "2-digit",
    //                             hour12: false,
    //                           }
    //                         )}
    //                     </span>
    //                   </div>
    //                   <button
    //                     className="bg-pink-500 text-white text-xs font-medium rounded-md px-2 py-1 transition-all duration-100 hover:bg-pink-600 cursor-pointer"
    //                     onClick={() => {
    //                       setHtml(item.html);
    //                     }}
    //                   >
    //                     Select
    //                   </button>
    //                 </li>
    //               ))}
    //             </ul>
    //           </div>
    //         </div>
    //       </div>
  );
}
