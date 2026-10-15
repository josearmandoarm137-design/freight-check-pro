import { useSession, setResponseHeader } from '@tanstack/react-start/server';
import { supabaseAdmin } from '@/integrations/supabase/client.server';
import type { Employee } from './visionscan';

export async function identificationSession() {
  const password = process.env['VISIONSCAN_SESSION_SECRET'];
  if (!password) throw new Error('Identificação temporariamente indisponível.');
  setResponseHeader('Cache-Control','no-store');
  return useSession<{matricula?:string}>({password,name:'visionscan-identification',maxAge:60*60*8,cookie:{httpOnly:true,sameSite:'lax',secure:process.env['NODE_ENV']==='production',path:'/'}});
}
export async function lookupEmployee(matricula: string): Promise<Employee | null> {
  const {data: employee,error} = await supabaseAdmin.from('vs_employees').select('matricula,name').eq('matricula',matricula).maybeSingle();
  if (error) throw new Error('Não foi possível consultar os colaboradores.');
  if (!employee) return null;
  const {data: role,error: roleError} = await supabaseAdmin.from('vs_employee_roles').select('role').eq('matricula',matricula).maybeSingle();
  if (roleError || !role || (role.role!=='motorista' && role.role!=='conferente')) return null;
  return {...employee,role:role.role};
}
// Matrícula selection is explicitly NOT credential authentication; this directory is fictitious.
export async function requireEmployee(requiredRole?: Employee['role']) {
  const session = await identificationSession();
  const employee = session.data.matricula ? await lookupEmployee(session.data.matricula) : null;
  if (!employee) throw new Error('Selecione sua matrícula para continuar.');
  if (requiredRole && employee.role!==requiredRole) throw new Error('Ação indisponível para este perfil.');
  return employee;
}