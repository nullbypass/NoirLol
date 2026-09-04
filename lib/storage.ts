import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

type Stored = { url: string; key: string };

function r2Enabled() {
  return Boolean(process.env.S3_ENDPOINT && process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY && process.env.S3_PUBLIC_URL);
}

function cleanBase(v: string) { return v.replace(/\/+$/, ''); }

export async function storeBuffer(opts:{buffer:Buffer,userId:string,folder?:string,extension:string,contentType:string}):Promise<Stored>{
  const token=crypto.randomBytes(16).toString('hex');
  const folder=opts.folder?.replace(/^\/+|\/+$/g,'');
  const key=[opts.userId,folder,`${token}.${opts.extension}`].filter(Boolean).join('/');
  if(r2Enabled()){
    const client=new S3Client({
      region:process.env.S3_REGION||'auto',
      endpoint:process.env.S3_ENDPOINT,
      credentials:{accessKeyId:process.env.S3_ACCESS_KEY_ID!,secretAccessKey:process.env.S3_SECRET_ACCESS_KEY!},
    });
    await client.send(new PutObjectCommand({Bucket:process.env.S3_BUCKET!,Key:key,Body:opts.buffer,ContentType:opts.contentType}));
    return {key,url:`${cleanBase(process.env.S3_PUBLIC_URL!)}/${key}`};
  }
  const root=process.env.UPLOAD_DIR||path.join(process.cwd(),'public','uploads');
  const target=path.join(root,key);
  await fs.mkdir(path.dirname(target),{recursive:true});
  await fs.writeFile(target,opts.buffer);
  return {key,url:`/uploads/${key}`};
}
