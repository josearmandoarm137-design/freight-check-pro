import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useOperations } from '@/components/visionscan-context';
import { PageHeading,FilterFields } from '@/components/visionscan-ui';
import { OccurrenceTable } from '@/components/visionscan-records';
import { emptyFilters,filterRecords,pageHead } from '@/lib/visionscan';
export const Route=createFileRoute('/ocorrencias')({validateSearch:(s:Record<string,unknown>):{status?:string|undefined;tipo?:string|undefined}=>({status:typeof s['status']==='string'?s['status']:undefined,tipo:typeof s['tipo']==='string'?s['tipo']:undefined}),head:()=>pageHead('Ocorrências','Lista de avarias e retornos, acompanhamento e conferência.'),component:Occurrences});
function Occurrences(){const {status,tipo}=Route.useSearch();const {records,user}=useOperations();const [filters,setFilters]=useState({...emptyFilters,status:status||'todos',kind:tipo||'todos'});const filtered=filterRecords(records,filters);return <><PageHeading title={user.role==='conferente'?'Ocorrências':'Minhas ocorrências'} eyebrow="Registros"/><FilterFields value={filters} onChange={setFilters}/><div className="section-heading"><h2>{filtered.length} ocorrências</h2></div><OccurrenceTable records={filtered}/></>;}