export default function converterParaNumber(valor: any): number  {
    const valorTransformado = Number(String(valor).replace(",", "."))
    return valorTransformado;
}