export function converterEmReais(preco: number) {
  const valorEmReais = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(preco);
  return valorEmReais;
}