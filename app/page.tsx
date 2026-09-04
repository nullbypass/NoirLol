import Link from 'next/link';
import { currentUser } from '@/lib/auth';
export default async function Home(){
  const user = await currentUser();
  return <main className="landing">
    <section className="landingCard">
      <div className="eyebrow">PERFILES PERSONALIZABLES</div>
      <h1>Una página. Tu identidad.</h1>
      <p>Crea y administra tu perfil, enlaces, medios, efectos y estadísticas desde un solo lugar.</p>
      <div className="row gap">
        <Link className="btn primary" href={user?'/dashboard':'/register'}>{user?'Abrir panel':'Crear cuenta'}</Link>
        {!user && <Link className="btn" href="/login">Iniciar sesión</Link>}
      </div>
    </section>
  </main>
}
