import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { money,totalValue,type Occurrence,type Filters,type Product } from './visionscan';

export async function buildReport(records:Occurrence[], filters:Filters, products:Product[], employees:{matricula:string;name:string}[], losses=false) {
 const doc=await PDFDocument.create();const font=await doc.embedFont(StandardFonts.Helvetica);const bold=await doc.embedFont(StandardFonts.HelveticaBold);
 const ink=rgb(.10,.18,.26), muted=rgb(.40,.46,.51), brand=rgb(.04,.35,.64);
 let page=doc.addPage([595,842]),y=786;
 const safe=(s:string)=>s.replace(/[→]/g,' - ').replace(/[^\x20-\x7E\u00A0-\u00FF]/g,'');
 const line=(s:string,size=10,strong=false)=>{page.drawText(safe(s),{x:42,y,size,font:strong?bold:font,color:strong?ink:muted});y-=size+8;};
 const header=()=>{line('VisionScan',22,true);line(losses?'Relatório detalhado de perdas':'Relatório de ocorrências',15,true);line(`Emissão: ${new Date().toLocaleString('pt-BR')}   |   Página ${doc.getPageCount()}`,9);y-=10;};
 const wrap=(text:string,width:number,size=9)=>{const result:string[]=[];let current='';for(const word of safe(text).split(' ')){let rest=word;while(font.widthOfTextAtSize(rest,size)>width){const count=Math.max(1,Math.floor(width/(size*.6)));if(current){result.push(current);current='';}result.push(rest.slice(0,count));rest=rest.slice(count);}if(font.widthOfTextAtSize(`${current} ${rest}`.trim(),size)>width){result.push(current);current=rest;}else current=`${current} ${rest}`.trim();}if(current)result.push(current);return result;};
 header();line(`Período: ${filters.from||'Início'} a ${filters.to||'Hoje'}`);line(`Tipo: ${filters.kind}   |   Status: ${filters.status}`);line(`Motorista: ${filters.driver}   |   Cliente: ${filters.client}`);if(filters.query)for(const s of wrap(`Pesquisa: ${filters.query}`,505))line(s);
 y-=8;line(`${records.length} ocorrências   |   Valor total: ${money(records.reduce((s,r)=>s+totalValue(r),0))}`,12,true);y-=12;
 for(const r of records){const product=products.find(p=>p.sku===r.product_sku)?.name||r.product_sku;const name=employees.find(e=>e.matricula===r.driver)?.name||r.driver;
 const details=[`#${String(r.number).padStart(5,'0')}  -  ${r.kind==='avaria'?'Avaria':'Retorno'}  -  ${r.status}`,`${r.occurred_on} | ${name} (${r.driver})`,`Cliente: ${r.client} | Rota: ${r.route}`,`Produto: ${product} | SKU: ${r.product_sku}`,`Quantidade: ${r.quantity} | Unitário: ${money(r.unit_price)} | Total: ${money(totalValue(r))}`,`Veículo: ${r.vehicle} | Placa: ${r.plate} | NF: ${r.invoice||'-'}`,`Motivo: ${r.reason}`,`Descrição: ${r.description||'-'}`,`Conferente: ${r.clerk||'-'} | Resultado: ${r.conference_result||'Pendente'}`,`Recebido: ${r.received??'-'} | Condição: ${r.condition||'-'}`,`Divergências: ${r.divergence||'-'}`,`Observações do conferente: ${r.clerk_notes||'-'}`];
 let first=true;for(const detail of details){for(const s of wrap(detail,505)){if(y<65){page=doc.addPage([595,842]);y=786;header();}page.drawText(s,{x:42,y,size:9,font:first?bold:font,color:first?brand:ink});y-=15;first=false;}}y-=16;}
 if(!records.length)line('Nenhuma ocorrência encontrada para os filtros selecionados.');
 return new Blob([new Uint8Array(await doc.save())],{type:'application/pdf'});
}
export async function deliverReport(blob:Blob,filename:string){const file=new File([blob],filename,{type:blob.type});if(matchMedia('(pointer: coarse)').matches&&navigator.canShare?.({files:[file]})){try{await navigator.share({files:[file],title:filename});return;}catch(e){if((e as DOMException).name==='AbortError')return;}}const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
