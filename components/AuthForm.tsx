'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
export default function AuthForm({mode}:{mode:'login'|'register'}){
 const r=useRouter(); const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
 async function submit(e:React.FormEvent<HTMLFormElement>){ e.preventDefault(); setLoading(true); setError(''); const f=new FormData(e.currentTarget); const body=Object.fromEntries(f.entries()); const res=await fetch(`/api/auth/${mode}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}); const j=await res.json(); setLoading(false); if(!res.ok){setError(j.error||'No se pudo completar');return;} r.push('/dashboard'); r.refresh(); }
 return <main className="authShell"><form className="authCard" onSubmit={submit}><h1>{mode==='login'?'Iniciar sesión':'Crear cuenta'}</h1>
 {mode==='register'&&<label>Usuario<input name="username" required minLength={2} maxLength={32} autoComplete="username"/></label>}
 <label>Correo<input name="email" type="email" required autoComplete="email"/></label><label>Contraseña<input name="password" type="password" required minLength={8} autoComplete={mode==='login'?'current-password':'new-password'}/></label>
 {error&&<div className="error">{error}</div>}<button className="btn primary full" disabled={loading}>{loading?'Procesando…':mode==='login'?'Entrar':'Crear cuenta'}</button>
 <p className="muted">{mode==='login'?<>¿No tienes cuenta? <Link href="/register">Regístrate</Link></>:<>¿Ya tienes cuenta? <Link href="/login">Entra</Link></>}</p></form></main>
}
