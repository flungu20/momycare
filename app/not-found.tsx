import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-50">
      <div className="mx-auto max-w-md px-4 pt-16 pb-10 text-center">
        <div className="text-sm font-medium text-slate-500">MomyCare</div>
        <h1 className="mt-3 text-3xl font-semibold text-slate-800">Pagina nu există</h1>
        <p className="mt-3 text-sm text-slate-600">
          E ok — se mai întâmplă. Hai înapoi la început.
        </p>

        <div className="mt-8 grid gap-3">
          <Link
            href="/landing"
            className="rounded-2xl bg-rose-200 px-4 py-4 text-sm font-semibold text-slate-900 hover:bg-rose-300"
          >
            Mergi la Landing
          </Link>
          <Link
            href="/home"
            className="rounded-2xl bg-white px-4 py-4 text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50"
          >
            Mergi la Home
          </Link>
        </div>

        <div className="mt-10 text-xs text-slate-400">
          “Care for your child. Care for you.”
        </div>
      </div>
    </div>
  );
}
