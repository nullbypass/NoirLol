import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { storeBuffer } from '@/lib/storage';
import crypto from 'crypto';
export async function POST(req:Request){
 const u=await currentUser();if(!u)return NextResponse.json({error:'No autorizado'},{status:401});
 const form=await req.formData();const file=form.get('file');
 if(!(file instanceof File))return NextResponse.json({error:'Archivo requerido'},{status:400});
 if(!file.type.startsWith('image/')&&!file.type.startsWith('video/'))return NextResponse.json({error:'Solo imágenes o videos'},{status:415});
 if(file.size>60*1024*1024)return NextResponse.json({error:'Máximo 60 MB'},{status:413});
 const extension=(file.name.split('.').pop()||'bin').replace(/[^a-z0-9]/gi,'').slice(0,8)||'bin';
 const slug=crypto.randomBytes(5).toString('hex');
 const stored=await storeBuffer({buffer:Buffer.from(await file.arrayBuffer()),userId:u.id,folder:'host',extension,contentType:file.type});
 const asset=await db.hostedAsset.create({data:{userId:u.id,slug,type:file.type.startsWith('video/')?'VIDEO':'IMAGE',url:stored.url,title:String(form.get('title')||'').slice(0,120),mimeType:file.type,size:file.size}});
 return NextResponse.json(asset);
}
