import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Printer, Search, MapPin, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deliveryRoutes, deliveryCities, filterRoutes } from '@/data/delivery-routes';
import { pageHead } from '@/lib/visionscan';

type Search = { q?: string; rota?: string; cidade?: string };

export const Route = createFileRoute('/rotas')({
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === 'string' ? s.q : undefined,
    rota: typeof s.rota === 'string' || typeof s.rota === 'number' ? String(s.rota) : undefined,
    cidade: typeof s.cidade === 'string' ? s.cidade : undefined,
  }),
  head: () => pageHead('Rotas de entrega', 'Sete rotas de distribuição de bebidas em Iguatu-CE com 25 empresas de demonstração.'),
  component: RoutesPage,
});

function RoutesPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: '/rotas' });
  const filters = { query: search.q ?? '', route: search.rota ?? 'todas', city: search.cidade ?? 'todas' };
  // Atualiza a URL para que filtros possam ser compartilhados e mantidos ao recarregar.
  const set = (patch: Search) => navigate({ search: prev => ({ ...prev, ...patch }), replace: true });
  const visible = filterRoutes(deliveryRoutes, filters);
  const total = visible.reduce((s, r) => s + r.companies.length, 0);

  return (
    <div className="routes-page">
      <div className="page-heading">
        <div><p className="eyebrow">Distribuição · Demonstração</p><h1>Rotas de Entrega</h1><p>{total} empresas em {visible.length} rotas. Dados fictícios.</p></div>
        <div className="flex gap-2 no-print">
          <Button variant="outline" asChild><Link to="/"><ArrowLeft />Tela inicial</Link></Button>
          <Button onClick={() => window.print()}><Printer />Imprimir</Button>
        </div>
      </div>
      <div className="filters no-print">
        <label className="field search-field"><span className="flex items-center gap-1"><Search size={12} />Pesquisar empresa</span>
          <input className="control" value={filters.query} onChange={e => set({ q: e.target.value || undefined })} placeholder="Nome da empresa" /></label>
        <label className="field"><span>Rota</span>
          <select className="control" value={filters.route} onChange={e => set({ rota: e.target.value === 'todas' ? undefined : e.target.value })}>
            <option value="todas">Todas as rotas</option>
            {deliveryRoutes.map(r => <option key={r.id} value={r.id}>Rota {r.id} — {r.region}</option>)}
          </select></label>
        <label className="field"><span>Cidade de entrega</span>
          <select className="control" value={filters.city} onChange={e => set({ cidade: e.target.value === 'todas' ? undefined : e.target.value })}>
            <option value="todas">Todas as cidades</option>
            {deliveryCities.map(c => <option key={c}>{c}</option>)}
          </select></label>
        <Button variant="outline" size="lg" onClick={() => navigate({ search: {}, replace: true })}>Limpar</Button>
      </div>
      {visible.length === 0 && <div className="empty"><strong>Nenhuma empresa encontrada</strong><p>Ajuste a pesquisa ou os filtros.</p></div>}
      {visible.map(r => (
        <section key={r.id} className="section route-section">
          <div className="section-heading">
            <div><h2><MapPin size={16} className="inline mr-1" />Rota {r.id} — {r.region}</h2><p>{r.companies.length} empresas</p></div>
            {filters.route !== String(r.id) && <Button variant="ghost" className="no-print" onClick={() => set({ rota: String(r.id) })}><Eye />Ver detalhes</Button>}
          </div>
          <div className="table-wrap">
            <table className="routes-table">
              <thead><tr><th>Nº</th><th>Empresa</th><th>Cidade de entrega</th><th>Produtos</th></tr></thead>
              <tbody>{r.companies.map(c => <tr key={c.number}><td>{c.number}</td><td>{c.name}</td><td>{c.city}</td><td>{c.products}</td></tr>)}</tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
