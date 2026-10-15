import { z } from 'zod';

export type Employee = { matricula: string; name: string; role: 'motorista' | 'conferente' };
export type Product = { sku: string; name: string; price: number };
export type Occurrence = {
  id: string; number: number; kind: 'avaria' | 'retorno'; status: string; driver: string;
  product_sku: string; quantity: number; transported: number; unit_price: number;
  vehicle: string; plate: string; route: string; client: string; invoice: string;
  reason: string; description: string; notes: string; photos: string[];
  occurred_on: string; created_at: string; clerk: string | null; received: number | null;
  condition: string; divergence: string; clerk_notes: string; conference_result: string; checked_at: string | null;
};
const text = z.string().trim().min(1, 'Preencha os campos obrigatórios.').max(200);
export const registrationSchema = z.string().trim().toUpperCase().regex(/^(MOT|CONF)-\d{4}$/, 'Informe a matrícula completa.');
export const occurrenceSchema = z.object({
  kind: z.enum(['avaria','retorno']), product_sku: text,
  quantity: z.number().int().positive(), transported: z.number().int().positive(), unit_price: z.number().nonnegative().max(1000000),
  vehicle: text, plate: text, route: text, client: text, invoice: z.string().max(100), reason: text,
  description: z.string().max(3000), notes: z.string().max(3000), occurred_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  photos: z.array(z.string().max(12_000_000).regex(/^data:image\/(png|jpeg|webp);base64,/)).max(3),
}).refine(d => d.quantity <= d.transported, { message: 'A quantidade afetada não pode superar a transportada.', path: ['quantity'] });
export const conferenceSchema = z.object({id: z.string().uuid(), status: z.enum(['Em análise','Resolvida','Rejeitada']), received: z.number().int().nonnegative(), condition: z.string().max(500), divergence: z.string().max(2000), clerk_notes: z.string().max(3000), conference_result: z.enum(['Verificada','Não verificada'])});
export type Filters = { query: string; kind: string; status: string; driver: string; client: string; from: string; to: string };
export const emptyFilters: Filters = { query:'', kind:'todos', status:'todos', driver:'todos', client:'todos', from:'', to:'' };
export const money = (v: number) => v.toLocaleString('pt-BR', {style:'currency',currency:'BRL'});
export const totalValue = (r: Pick<Occurrence,'quantity'|'unit_price'>) => r.quantity * r.unit_price;
export function filterRecords(records: Occurrence[], f: Filters) {
  return records.filter(r => (!f.query || `${r.number} ${r.client} ${r.product_sku} ${r.driver} ${r.route}`.toLowerCase().includes(f.query.toLowerCase())) && (f.kind==='todos'||r.kind===f.kind) && (f.status==='todos'||r.status===f.status) && (f.driver==='todos'||r.driver===f.driver) && (f.client==='todos'||r.client===f.client) && (!f.from||r.occurred_on>=f.from) && (!f.to||r.occurred_on<=f.to));
}
export function roleCan(role: Employee['role'], action: 'register'|'conference'|'products'|'reports') {
  return action==='register' ? role==='motorista' : role==='conferente';
}
export const pageHead = (title: string, description: string) => ({meta:[{title:`${title} | VisionScan`},{name:'description',content:description},{property:'og:title',content:`${title} | VisionScan`},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]});