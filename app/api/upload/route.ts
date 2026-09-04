import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { storeBuffer } from '@/lib/storage';
const ok=new Set(['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','audio/mpeg','audio/ogg','audio/wav','font/woff','font/woff2','application/font-woff']);
const ext:Record<string,string>={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif','video/mp4':'mp4','video/webm':'webm','audio/mpeg':'mp3','audio/ogg':'ogg','audio/wav':'wav','font/woff':'woff','font/woff2':'woff2','application/font-woff':'woff'};
export async function POST(req:Request){
 const u=await currentUser(); if(!u)return NextResponse.json({error:'No autorizado'},{status:401});
 const form=await req.formData(); const file=form.get('file');
 if(!(file instanceof File))return NextResponse.json({error:'Archivo requerido'},{status:400});
 if(!ok.has(file.type))return NextResponse.json({error:'Formato no permitido'},{status:415});
 if(file.size>60*1024*1024)return NextResponse.json({error:'Máximo 60 MB'},{status:413});
 const stored=await storeBuffer({buffer:Buffer.from(await file.arrayBuffer()),userId:u.id,extension:ext[file.type]||'bin',contentType:file.type});
 return NextResponse.json({url:stored.url,mime:file.type,size:file.size});
}
