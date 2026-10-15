import { createFileRoute } from '@tanstack/react-router';
import { useOperations } from '@/components/visionscan-context';
import { PageHeading } from '@/components/visionscan-ui';
import { pageHead } from '@/lib/visionscan';
export const Route=createFileRoute('/perfil')({head:()=>pageHead('Meu perfil','Identificação do colaborador e matrícula completa no VisionScan.'),component:Profile});
function Profile(){const {user}=useOperations();return <><PageHeading title="Meu perfil" eyebrow="Colaborador"/><div className="profile-grid"><div><span>Nome completo</span><strong>{user.name}</strong></div><div><span>Matrícula completa</span><strong>{user.matricula}</strong></div><div><span>Cargo</span><strong>{user.role==='motorista'?'Motorista':'Conferente'}</strong></div></div></>;}