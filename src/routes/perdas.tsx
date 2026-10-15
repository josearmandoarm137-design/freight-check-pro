import { createFileRoute } from '@tanstack/react-router';
import { ReportScreen } from '@/components/visionscan-report';
import { pageHead } from '@/lib/visionscan';
export const Route=createFileRoute('/perdas')({head:()=>pageHead('Relatório de perdas','Detalhamento de valores por produto, motorista e ocorrência com exportação em PDF.'),component:Losses});
function Losses(){return <ReportScreen losses/>;}