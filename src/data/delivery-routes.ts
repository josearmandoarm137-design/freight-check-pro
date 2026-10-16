// Rotas de entrega fictícias (dados de demonstração, não são clientes reais).
// Fonte única: telas de login e página /rotas leem daqui.
export type DeliveryCompany = { number: number; name: string; city: string; products: string };
export type DeliveryRoute = { id: number; region: string; companies: DeliveryCompany[] };

const CITY = 'Iguatu–CE';
const c = (number: number, name: string, products: string): DeliveryCompany => ({ number, name, city: CITY, products });

export const deliveryRoutes: DeliveryRoute[] = [
  { id: 1, region: 'Centro', companies: [c(1,'Mercadinho São José','Refrigerantes e água'),c(2,'Lanchonete Sabor & Cia','Sucos e refrigerantes'),c(3,'Restaurante Bom Prato','Água e refrigerantes'),c(4,'Pizzaria Forno & Sabor','Refrigerantes'),c(5,'Café e Padaria Central','Água e sucos')] },
  { id: 2, region: 'Cocobó', companies: [c(6,'Padaria Pão Quente','Água e refrigerantes'),c(7,'Depósito do Bairro','Refrigerantes e água'),c(8,'Bar Esquina do Futebol','Refrigerantes e cervejas'),c(9,'Mercantil Bom Preço','Água e refrigerantes')] },
  { id: 3, region: 'Areias', companies: [c(10,'Bar do Naldo','Refrigerantes e cervejas'),c(11,'Mercearia Ponto Certo','Água e refrigerantes'),c(12,'Churrascaria Boi na Brasa','Refrigerantes e água'),c(13,'Espetinho Sabor da Brasa','Água e refrigerantes')] },
  { id: 4, region: 'Prado', companies: [c(14,'Espetinho do Parque','Refrigerantes e água'),c(15,'Mercantil União','Refrigerantes e sucos'),c(16,'Restaurante Sabor Nordestino','Água e refrigerantes')] },
  { id: 5, region: 'Vila Neuma', companies: [c(17,'Lanchonete Estação','Sucos e refrigerantes'),c(18,'Mercadinho da Vila','Água e refrigerantes'),c(19,'Lanchonete Avenida','Refrigerantes e água')] },
  { id: 6, region: 'Planalto', companies: [c(20,'Restaurante Tempero Caseiro','Água e refrigerantes'),c(21,'Mercearia Central do Planalto','Refrigerantes e água'),c(22,'Mercadinho Dois Irmãos','Sucos e refrigerantes')] },
  { id: 7, region: 'Outros bairros e arredores', companies: [c(23,'Bar e Restaurante Recanto','Água e refrigerantes'),c(24,'Hotel Portal de Iguatu','Água e sucos'),c(25,'Clube de Eventos Estrela','Refrigerantes, água e cervejas')] },
];

export type RouteFilters = { query: string; route: string; city: string };

/** Aplica pesquisa por empresa, filtro de rota e de cidade; remove rotas sem resultado. */
export function filterRoutes(routes: DeliveryRoute[], f: RouteFilters): DeliveryRoute[] {
  const q = f.query.trim().toLowerCase();
  return routes
    .filter(r => f.route === 'todas' || String(r.id) === f.route)
    .map(r => ({ ...r, companies: r.companies.filter(co => (!q || co.name.toLowerCase().includes(q)) && (f.city === 'todas' || co.city === f.city)) }))
    .filter(r => r.companies.length > 0);
}

export const deliveryCities = [...new Set(deliveryRoutes.flatMap(r => r.companies.map(c => c.city)))];
