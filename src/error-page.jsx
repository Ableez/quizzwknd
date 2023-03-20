import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
      <div className=" border h-screen w-screen align-middle justify-center">
        <h1 className="text-7xl my-6 font-extrabold text-lime-300">Ooops!</h1>
        <p className="font-bold">sorry something went wrong</p>
        <p>
          <code className="bg-slate-200 text-slate-800 p-1 w-6 rounded-xl">{error.statusText} { error.message}</code>
        </p>
      </div>
  );
}
