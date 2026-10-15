import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { identificationSession,lookupEmployee,requireEmployee } from './visionscan.server';
import { registrationSchema,occurrenceSchema,conferenceSchema, type Employee, type Occurrence } from './visionscan';

export const getAccess = createServerFn({method:'GET'}).handler(async () => {
  const {supabaseAdmin} = await import('@/integrations/supabase/client.server');
  const {data,error} = await supabaseAdmin.from('vs_employees').select('matricula,name,vs_employee_roles(role)').order('matricula');
  if(error) throw new Error('Não foi possível carregar as matrículas.');
  const employees: Employee[] = (data??[]).flatMap(e => {
    const role=e.vs_employee_roles?.role;
    return role==='conferente'||role==='motorista' ? [{matricula:e.matricula,name:e.name,role}] : [];
  });
  const session=await identificationSession();
  return {employees,user:session.data.matricula ? await lookupEmployee(session.data.matricula):null};
});
export const identifyEmployee = createServerFn({method:'POST'}).inputValidator((input:unknown)=>registrationSchema.parse(input)).handler(async ({data}) => {
  const user=await lookupEmployee(data);
  if(!user) throw new Error('Matrícula não encontrada no cadastro.');
  const session=await identificationSession(); await session.update({matricula:user.matricula});return user;
});
export const leaveApp = createServerFn({method:'POST'}).handler(async()=>{const session=await identificationSession();await session.clear();return true;});
export const getOperations = createServerFn({method:'GET'}).handler(async()=>{
  const user=await requireEmployee();
  const {supabaseAdmin} = await import('@/integrations/supabase/client.server');
  let query=supabaseAdmin.from('vs_occurrences').select('*').order('created_at',{ascending:false});
  if(user.role==='motorista') query=query.eq('driver',user.matricula);
  const [{data,error},{data:products,error:pe},{data:employees,error:ee}]=await Promise.all([query,supabaseAdmin.from('vs_products').select('*').order('name'),supabaseAdmin.from('vs_employees').select('matricula,name')]);
  if(error||pe||ee) throw new Error('Não foi possível carregar os registros.');
  const records:Occurrence[]=(data??[]).map(r=>({...r,kind:r.kind==='retorno'?'retorno' as const:'avaria' as const,photos:Array.isArray(r.photos)?r.photos.filter((p):p is string=>typeof p==='string'):[]}));
  return {user,records,products:products??[],employees:employees??[]};
});
export const registerOccurrence = createServerFn({method:'POST'}).inputValidator((input:unknown)=>occurrenceSchema.parse(input)).handler(async({data})=>{
  const user=await requireEmployee('motorista');
  const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
  const {data:product}=await supabaseAdmin.from('vs_products').select('sku').eq('sku',data.product_sku).maybeSingle();
  if(!product)throw new Error('Produto não encontrado.');
  const {data:row,error}=await supabaseAdmin.from('vs_occurrences').insert({...data,driver:user.matricula}).select('id,number').single();
  if(error)throw new Error('Não foi possível salvar a ocorrência.');return row;
});
export const saveConference = createServerFn({method:'POST'}).inputValidator((input:unknown)=>conferenceSchema.parse(input)).handler(async({data})=>{
  const user=await requireEmployee('conferente');
  const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
  const {id,...fields}=data;
  const {data:row,error}=await supabaseAdmin.from('vs_occurrences').update({...fields,clerk:user.matricula,checked_at:new Date().toISOString()}).eq('id',id).select('id').single();
  if(error||!row)throw new Error('Não foi possível salvar a conferência.');return true;
});
export const updateProduct = createServerFn({method:'POST'}).inputValidator((input:unknown)=>z.object({sku:z.string().max(100),price:z.number().nonnegative().max(1000000)}).parse(input)).handler(async({data})=>{
  await requireEmployee('conferente');const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
  const {error}=await supabaseAdmin.from('vs_products').update({price:data.price}).eq('sku',data.sku);if(error)throw new Error('Não foi possível atualizar o valor.');return true;
});