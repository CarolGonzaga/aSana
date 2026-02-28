import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full rounded-2xl border p-6 text-center">
        <h1 className="text-xl font-semibold">Página não encontrada</h1>
        <p className="text-sm opacity-80 mt-2">
          Esse caminho não existe no app.
        </p>
        <Link
          to="/"
          className="inline-flex mt-5 px-4 py-2 rounded-xl border"
        >
          Voltar para Home
        </Link>
      </div>
    </div>
  );
}