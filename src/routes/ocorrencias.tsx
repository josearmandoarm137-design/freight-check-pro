import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useOperations } from '@/components/visionscan-context';
import { PageHeading,FilterFields } from '@/components/visionscan-ui';
import { OccurrenceTable } from '@/components/visionscan-records';
import { emptyFilters,filterRecords,pageHead } from '@/lib/visionscan';
export const Route=createFileRoute('/ocorrencias')({validateSearch:(s:Record<string,unknown>)=>({status:typeof s.status==='string'?s.status:'todos',tipo:typeof s.tipo==='string'?s.tipo:'todos'}),head:()=>pageHead('Ocorrências','Lista de avarias e retornos, acompanhamento e conferência.'),component:Occurrences});
function Occurrences(){const {status,tipo}=Route.useSearch();const {records,user}=useOperations();const [filters,setFilters]=useState({...emptyFilters,status,kind:tipo});const filtered=filterRecords(records,filters);return <><PageHeading title={user.role==='conferente'?'Ocorrências':'Minhas ocorrências'} eyebrow="Registros"/><FilterFields value={filters} onChange={setFilters}/><div className="section-heading"><h2>{filtered.length} ocorrências</h2></div><OccurrenceTable records={filtered}/></>;}