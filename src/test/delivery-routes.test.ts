import { describe, it, expect } from 'vitest';
import { deliveryRoutes, filterRoutes } from '@/data/delivery-routes';
const all = deliveryRoutes.flatMap(r => r.companies);
describe('rotas de entrega', () => {
  it('tem 7 rotas', () => expect(deliveryRoutes).toHaveLength(7));
  it('tem 25 empresas numeradas 1..25 sem duplicação', () => expect(all.map(c => c.number)).toEqual(Array.from({ length: 25 }, (_, i) => i + 1)));
  it('pesquisa por empresa', () => expect(filterRoutes(deliveryRoutes, { query: 'naldo', route: 'todas', city: 'todas' }).flatMap(r => r.companies).map(c => c.number)).toEqual([10]));
  it('filtra por rota', () => expect(filterRoutes(deliveryRoutes, { query: '', route: '4', city: 'todas' })[0]?.companies).toHaveLength(3));
});
