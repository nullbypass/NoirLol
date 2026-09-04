'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Eye, MapPin, Volume2, VolumeX, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
export default function ProfileView({user,viewCount}:{user:any,viewCount:number}){
 const p=user.profile; const [muted,setMuted]=useState(false); const audio=useRef<HTMLAudioElement>(null); const [tab,setTab]=useState(0); const [typed,setTyped]=useState('');
 const typeTexts:string[]=Array.isArray(p.typewriterTexts)?p.typewriterTexts:[];
 useEffect(()=>{if(!p.audioUrl||!audio.current)return;audio.current.volume=Math.max(0,Math.min(1,p.volume));audio.current.play().catch(()=>{});},[p.audioUrl,p.volume]);
 useEffect(()=>{if(!p.typewriterEnabled||!typeTexts.length)return;let i=0,j=0,del=false,t:any; const step=()=>{const s=typeTexts[i]||'';setTyped(s.slice(0,j));if(!del&&j<s.length)j++;else if(!del){del=true;t=setTimeout(step,900);return}else if(j>0)j--;else{del=false;i=(i+1)%typeTexts.length}t=setTimeout(step,del?p.typewriterDeleteSpeed:p.typewriterSpeed)};step();return()=>clearTimeout(t)},[p.typewriterEnabled,JSON.stringify(typeTexts),p.typewriterSpeed,p.typewriterDeleteSpeed]);
 const style=useMemo(()=>({
  '--accent':p.accentColor,'--bg':p.backgroundColor,'--text':p.textColor,'--icons':p.iconColor,'--secondary':p.secondaryColor,'--opacity':String(p.profileOpacity),'--blur':`${p.profileBlur}px`,'--border':p.borderColor,'--borderw':`${p.borderWidth}px`,'--radius':`${p.borderRadius}px`,'--glow':p.glowEnabled?`0 0 ${p.glowStrength}px ${p.glowColor}55`:'none','--font':p.fontFamily
 } as React.CSSProperties),[p]);
 const bgStyle:any={backgroundColor:p.backgroundColor}; if(p.backgroundType==='image'&&p.backgroundUrl)bgStyle.backgroundImage=`linear-gradient(#0005,#0005),url(${p.backgroundUrl})`;
 return <main className={`profileScene fx-bg-${p.backgroundEffect}`} style={{...style,...bgStyle}}>
  {p.backgroundType==='video'&&p.backgroundUrl&&<video className="bgVideo" src={p.backgroundUrl} autoPlay muted loop playsInline/>}
  {p.fontUrl&&<style>{`@font-face{font-family:'UserFont';src:url('${p.fontUrl}')} .profileScene{--font:'UserFont'}`}</style>}
  {p.customCss&&<style>{p.customCss}</style>}
  <div className={`profileCard layout-${String(p.layout).toLowerCase()} anim-${p.profileAnimation} ${p.gradientEnabled?'gradient':''}`}>
   {p.bannerUrl&&<img className="profileBanner" style={{borderRadius:p.bannerRadius}} src={p.bannerUrl} alt=""/>}
   <div className="identity">
    {p.avatarUrl&&<img className="avatar" style={{borderRadius:`${p.avatarRadius}%`}} src={p.avatarUrl} alt=""/>}
    <div><h1 className={`username userfx-${p.usernameEffect}`}>{p.displayName||user.username}</h1>{p.location&&<div className="location"><MapPin size={14}/>{p.location}</div>}</div>
   </div>
   <p className="bio">{p.typewriterEnabled&&typeTexts.length?typed:p.bio}</p>
   {p.layout==='MODERN'&&Array.isArray(p.widgets)&&p.widgets.length>0&&<div className="tabSwitch"><button onClick={()=>setTab(Math.max(0,tab-1))}><ChevronLeft/></button><span>{tab===0?'Enlaces':'Widgets'}</span><button onClick={()=>setTab(Math.min(1,tab+1))}><ChevronRight/></button></div>}
   {(tab===0||p.layout!=='MODERN')&&<div className={`links ${p.monochromeIcons?'mono':''}`}>{user.links.filter((x:any)=>x.visible).map((x:any)=><a key={x.id} href={`/api/click?id=${x.id}`} target="_blank" rel="noopener noreferrer"><span>{x.label}</span><ExternalLink size={16}/></a>)}</div>}
   {p.layout==='MODERN'&&tab===1&&<div className="widgets">{(p.widgets||[]).map((w:any,i:number)=><a key={i} href={w.url} target="_blank" rel="noopener noreferrer"><strong>{w.title||w.type||'Widget'}</strong>{w.subtitle&&<span>{w.subtitle}</span>}</a>)}</div>}
   {!p.hideViews&&<div className="views"><Eye size={14}/>{viewCount.toLocaleString()}</div>}
  </div>
  {p.audioUrl&&<><audio ref={audio} src={p.audioUrl} loop muted={muted}/>{p.volumeControl&&<button className="volumeBtn" onClick={()=>setMuted(v=>!v)}>{muted?<VolumeX/>:<Volume2/>}</button>}</>}
  {p.cursorUrl&&<style>{`.profileScene,.profileScene *{cursor:url('${p.cursorUrl}'),auto!important}`}</style>}
 </main>
}
