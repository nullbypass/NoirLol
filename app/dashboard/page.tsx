import { redirect } from 'next/navigation'; import { currentUser } from '@/lib/auth'; import { db } from '@/lib/db'; import DashboardClient from '@/components/DashboardClient';
export const dynamic='force-dynamic';
export default async function Dashboard(){
 const user=await currentUser(); if(!user)redirect('/login');
 const full=await db.user.findUnique({where:{id:user.id},include:{profile:true,links:{orderBy:{position:'asc'}},aliases:true,hosted:{orderBy:{createdAt:'desc'},take:50},_count:{select:{views:true,clicks:true}}}});
 if(!full)redirect('/login');
 const uniqueRows=await db.profileView.groupBy({by:['ipHash'],where:{userId:user.id},_count:{ipHash:true}});
 const topLinks=await db.linkClick.groupBy({by:['linkId'],where:{userId:user.id},_count:{linkId:true},orderBy:{_count:{linkId:'desc'}},take:10});
 const linkMap=new Map(full.links.map(l=>[l.id,l.label]));
 const analytics={uniqueViews:uniqueRows.length,topLinks:topLinks.map(x=>({label:linkMap.get(x.linkId)||'Enlace',clicks:x._count.linkId}))};
 return <DashboardClient data={JSON.parse(JSON.stringify({...full,analytics}))}/>
}
