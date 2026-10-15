import { describe,it,expect } from 'vitest';
import { registrationSchema,roleCan,totalValue,filterRecords,emptyFilters,type Occurrence } from '@/lib/visionscan';
describe('VisionScan rules',()=>{
 it('accepts full supplied driver registrations',()=>{expect(registrationSchema.parse('MOT-1001')).toBe('MOT-1001');expect(registrationSchema.safeParse('1001').success).toBe(false);});
 it('accepts full supplied clerk registrations',()=>{expect(registrationSchema.parse('CONF-2001')).toBe('CONF-2001');expect(registrationSchema.safeParse('2001').success).toBe(false);});
 it('drivers register while clerks conference',()=>{expect(roleCan('motorista','register')).toBe(true);expect(roleCan('motorista','conference')).toBe(false);expect(roleCan('conferente','conference')).toBe(true);expect(roleCan('conferente','register')).toBe(false);});
 it('detailed losses use quantities multiplied by unit values',()=>{expect(totalValue({quantity:3,unit_price:55})).toBe(165);});
 it('report filters narrow by dates, driver, client, type and status',()=>{const row={id:'one',number:1,kind:'avaria',status:'Pendente',driver:'MOT-1001',client:'Mercantil Central',occurred_on:'2026-10-15',product_sku:'SKU-IND-004',route:'Iguatu',quantity:3,unit_price:55} as Occurrence;const other={...row,id:'two',driver:'MOT-1002',occurred_on:'2026-10-14'};expect(filterRecords([row,other],{...emptyFilters,driver:'MOT-1001',client:'Mercantil Central',kind:'avaria',status:'Pendente',from:'2026-10-15',to:'2026-10-15'}).map(r=>r.id)).toEqual(['one']);expect(filterRecords([row],{...emptyFilters,kind:'retorno'})).toEqual([]);});
});