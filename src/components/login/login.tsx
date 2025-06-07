import { useLocalStorage } from "react-use";
import { defaultHTML } from "./../../../utils/consts";

function Login({
  html,
  children,
}: {
  html?: string;
  children?: React.ReactNode;
}) {
  const [, setStorage] = useLocalStorage("html_content");

  const handleClick = async () => {
    if (html !== defaultHTML) {
      setStorage(html);
    }
    const request = await fetch("/api/login");
    const res = await request.json();
    if (res?.redirectUrl) {
      window.open(res.redirectUrl, "_blank");
    }
  };

  return (
    <>
      <header className="flex items-center text-sm px-4 py-3 border-b gap-2 bg-neutral-950 border-neutral-800 font-semibold text-neutral-200">
        <span className="text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5 flex items-center justify-start gap-1.5">
          REQUIRED
        </span>
        Login with Hugging Face
      </header>
      <main className="px-4 py-4 space-y-3">
        {children}
        <button onClick={handleClick} className="cursor-pointer">
          <img
            src="https://huggingface.co/datasets/huggingface/badges/resolve/main/sign-in-with-huggingface-lg.svg"
            alt="Sign in with Hugging Face"
            className="mx-auto"
          />
        </button>
      </main>
    </>
  );
}

export default Login;
