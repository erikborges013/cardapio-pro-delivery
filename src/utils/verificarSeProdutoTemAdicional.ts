import useProduto from "../composables/useProduto";
import { listaDeProdutos } from "../stores/listaDeProdutosStore";
import converterParaNumber from "./normalizarPreco";

export async function verificarSeProdutosTemAdicional(uid: string, id: string): Promise<boolean> {
    try {
        const produtosStore = listaDeProdutos();
        await produtosStore.buscarProdutos();
        const { editar } = useProduto();
        const produtos = produtosStore.produtos.filter(produto =>
            produto.adicionais.some(adicional => adicional.id === id)
        );
        if (produtos.length > 0) {

            if (!confirm(`Ao excluir, ele será removido de ${produtos.length} produtos. Continuar?`)) {
                return false;
            }
            await Promise.all(
                produtos.map(produto => {
                    const dados = {
                        nome: produto.nome,
                        ingredientes: produto.ingredientes,
                        peso: produto.peso,
                        categoriaId: produto.categoriaId,
                        preco: converterParaNumber(produto.preco),
                        adicionais: produto.adicionais.filter(adicional => adicional.id !== id),
                    }
                    return editar(uid, produto.id, dados);
                }
                )
            );
        }
        return true;
    } catch (error) {
        console.error("Erro ao atualizar os adicionais nos produtos.");
        return false;
    }
}