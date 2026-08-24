import { auth } from "@/auth";
import { loginWithGitHub } from "@/app/actions/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="logo auth-logo"><b>F</b><strong>Finova</strong></div>
        <small>TUS FINANZAS, EN UN SOLO LUGAR</small>
        <h1>Bienvenido a Finova</h1>
        <p>Inicia sesión para acceder a tus movimientos de forma privada desde cualquier dispositivo.</p>
        <form action={loginWithGitHub}>
          <button className="primary auth-button" type="submit">Continuar con GitHub</button>
        </form>
        <em>Finova solo solicita tu identidad básica. Cada usuario accede únicamente a sus propios datos.</em>
      </section>
    </main>
  );
}
