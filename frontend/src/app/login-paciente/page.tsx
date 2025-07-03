"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../services/loginService";
import axios from "axios";

export default function LoginPaciente() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await login({ email, password });
      const userRol = data.user?.type?.name;

      if (userRol.toLowerCase() !== "patient") {
        setError("Solo los usuarios con rol de paciente pueden ingresar aquí");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("access_token", data.access_token);

      router.push("/paciente");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Credenciales inválidas.");
      } else {
        setError("Error al conectar con el servidor. Intente más tarde.");
      }
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <button
        onClick={() => router.push("/")}
        className="absolute top-4 left-4 flex items-center gap-2 text-green-600 hover:text-green-800 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Volver al inicio
      </button>

      {/*caja inicio de sesion*/}
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md z-10">
        <h1 className="text-2xl font-bold text-center mb-4">Iniciar sesión</h1>
        <p className="text-center mb-6">
          Accedé para gestionar tus turnos y ver tus consultas
        </p>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded border border-gray-300 text-base"
          />
          <input
            type="password"
            placeholder="Contraseña"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded border border-gray-300 text-base"
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Ingresando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
