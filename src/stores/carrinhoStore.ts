import { defineStore } from "pinia";
import { IProduto } from "../interfaces/Iproduto";
import { AdicionalSelecionado } from "../features/cardapio/Cardapio.vue";

export interface ItemCarrinho {
  nome: string,
  preco: number,
  quantidade: number,
  observacao: string,
  adicionais: AdicionalSelecionado[],
  id: string,
  imagemURL: string,
  ingredientes: string,
  idProdutoCarrinho: string,
  valorTotalAdicionais: number
}

export const useCarrinhoStore = defineStore("carrinho", {
  state: () => ({
    itens: [] as ItemCarrinho[],
    modalAberto: false,
  }),

  getters: {
    totalDoPedido: (state) => {
      return state.itens.reduce((total, item) => {
        return total + (item.preco * item.quantidade) + (item.valorTotalAdicionais * item.quantidade);
      }, 0);
    },
    quantidadeTotalDeItens: (state) => {
      return state.itens.reduce((total, item) => total + item.quantidade, 0);
    }
  },

  actions: {
    adicionarAoCarrinho(produto: IProduto, quantidade: number, observacao: string = "", listaDeAdicionais: AdicionalSelecionado[], valorTotalAdicionais: number) {
      const produtoCompleto: ItemCarrinho = {
        nome: produto.nome,
        preco: produto.preco,
        quantidade: quantidade,
        observacao: observacao,
        adicionais: listaDeAdicionais.filter(adicional => adicional.quantidade! > 0),
        id: produto.id,
        imagemURL: produto.imagemURL,
        ingredientes: produto.ingredientes,
        idProdutoCarrinho: crypto.randomUUID(),
        valorTotalAdicionais,
      }

      if (produtoCompleto) {
        this.itens.push(produtoCompleto);
      }

      this.salvarNoLocalStorage();
    },

    removerItem(produtoId: string) {
      this.itens = this.itens.filter((item) => item.idProdutoCarrinho !== produtoId);
      this.salvarNoLocalStorage();
    },

    incrementarQuantidade(produtoId: string) {
      const item = this.itens.find((it) => it.idProdutoCarrinho === produtoId);
      if (item) {
        const quantidadeAnterior = item.quantidade;
        item.quantidade++;
        this.salvarNoLocalStorage();
      }
    },

    decrementarQuantidade(produtoId: string) {
      const item = this.itens.find((it) => it.idProdutoCarrinho === produtoId);
      if (item) {
        const quantidadeAnterior = item.quantidade;
        item.quantidade--;
        if (item.quantidade <= 0) {
          this.removerItem(produtoId);
        } else {
          this.salvarNoLocalStorage();
        }
      }
    },

    limparCarrinho() {
      this.itens = [];
      this.salvarNoLocalStorage();
    },

    alternarModalCarrinho() {
      this.modalAberto = !this.modalAberto;
    },

    carregarDoLocalStorage() {
      const dados = localStorage.getItem("carrinho_snakebar");
      if (dados) {
        this.itens = JSON.parse(dados);
      }
    },

    salvarNoLocalStorage() {
      localStorage.setItem("carrinho_snakebar", JSON.stringify(this.itens));
    }
  }
});