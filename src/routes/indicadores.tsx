import { createFileRoute } from '@tanstack/react-router';
import { ReportScreen } from '@/components/visionscan-report';
import { pageHead } from '@/lib/visionscan';
export const Route=createFileRoute('/indicadores')({head:()=>pageHead('Indicadores e relatórios','Relatórios de ocorrências com filtros por período, motorista, cliente, tipo e status, exportados em PDF.'),component:Indicators});
function Indicators(){return <ReportScreen/>;}