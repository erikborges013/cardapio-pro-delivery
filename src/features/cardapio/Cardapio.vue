<template>
    <div class="min-h-screen bg-gray-50 pb-20">

        <div v-if="!contaAtiva && !loading"
            class="fixed inset-0 z-50 bg-gray-100 flex flex-col items-center justify-center p-6 text-center">
            <div class="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <span class="text-4xl">🚫</span>
            </div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Cardápio Indisponível</h2>
            <p class="text-gray-600 max-w-md">
                Este cardápio está temporariamente desativado. Por favor, peça para o estabelecimento verificar o painel
                administrativo ou a assinatura.
            </p>
        </div>

        <div v-else>
            <header class="bg-white shadow-sm sticky top-0 z-10">
                <div class="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                            <img :src="informacoesCardapio.informacoesDoEstabelecimento?.imagemUrl || defaultImage"
                                alt="Logo" class="w-full h-full object-cover" />
                        </div>
                        <h1 class="text-xl font-bold text-gray-800">
                            {{ informacoesCardapio.informacoesDoEstabelecimento?.nomeDoEstabelecimento ||
                                'Carregando...' }}
                        </h1>
                    </div>

                    <nav class="hidden md:flex gap-4 text-sm text-gray-600">
                        <button class="hover:text-primary transition">Horários</button>
                        <button class="hover:text-primary transition">Endereço</button>
                    </nav>
                </div>

                <div class="border-t border-gray-100 py-3">
                    <div class="container mx-auto px-4">
                        <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                            <button @click="categoriaSelecionada = null" class="filtro-item"
                                :class="{ 'ativo': categoriaSelecionada === null }">
                                Todos
                            </button>
                            <button v-for="categoria in categoriasStore.categorias" :key="categoria.id"
                                @click="categoriaSelecionada = categoria.id" class="filtro-item whitespace-nowrap"
                                :class="{ 'ativo': categoriaSelecionada === categoria.id }">
                                {{ categoria.dados.nome }}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main class="container mx-auto px-4 py-6 space-y-8">
                <div v-if="loading" class="text-center py-10">
                    <p class="text-gray-500">Carregando cardápio...</p>
                </div>

                <div v-else-if="produtosAgrupados.length === 0" class="text-center py-10">
                    <p class="text-gray-500">Nenhum produto encontrado.</p>
                </div>

                <section v-else v-for="grupo in produtosAgrupados" :key="grupo.categoriaId">
                    <h2 class="text-2xl font-bold text-gray-800 mb-4 capitalize border-l-4 border-blue-600 pl-3">
                        {{ grupo.nomeCategoria }}
                    </h2>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div v-for="produto in grupo.produtos" :key="produto.id"
                            class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex gap-4 hover:shadow-md transition cursor-pointer"
                            @click="abrirModalProduto(produto)">
                            <div class="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                <img :src="produto.imagemURL || defaultImage" :alt="produto.nome"
                                    class="w-full h-full object-cover" />
                            </div>

                            <div class="flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 class="font-semibold text-gray-800 line-clamp-1">{{ produto.nome }}</h3>
                                    <p class="text-sm text-gray-500 line-clamp-2 mt-1">{{ produto.ingredientes }}</p>
                                </div>
                                <div class="flex justify-between items-center mt-2">
                                    <span class="font-bold text-green-600">
                                        {{ formatarPreco(produto.preco) }}
                                    </span>
                                    <button class="text-blue-600 text-sm font-medium hover:underline">
                                        Adicionar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <button v-if="carrinhoStore.quantidadeTotalDeItens > 0" @click="carrinhoStore.alternarModalCarrinho()"
                class="fixed bottom-6 right-6 bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition z-40 flex items-center gap-2 animate-bounce-short">
                <span
                    class="bg-white text-red-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {{ carrinhoStore.quantidadeTotalDeItens }}
                </span>
                <span>Ver Carrinho</span>
            </button>

            <Transition name="fade">
                <div v-if="produtoParaModal"
                    class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">

                    <div class="absolute inset-0 bg-black/50" @click="fecharModal"></div>

                    <div
                        class="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden relative z-10 max-h-[90vh] flex flex-col">

                        <button @click="fecharModal"
                            class="absolute top-4 right-4 bg-white/80 rounded-full p-2 hover:bg-white z-20 shadow-sm text-gray-600">
                            ✕
                        </button>

                        <div class="overflow-y-auto flex-1 bg-white">

                            <div class="h-48 w-full bg-gray-200">
                                <img :src="produtoParaModal.imagemURL || defaultImage"
                                    class="w-full h-full object-cover" />
                            </div>

                            <div class="p-6">
                                <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ produtoParaModal.nome }}</h2>
                                <p class="text-gray-600 text-sm mb-4">{{ produtoParaModal.ingredientes }}</p>

                                <p class="text-2xl font-bold text-green-600 mb-6">
                                    {{ formatarPreco(produtoParaModal.preco) }}
                                </p>

                                <div v-if="produtoParaModal.adicionais && produtoParaModal.adicionais.length > 0"
                                    class="border-t border-gray-100 pt-4 mb-4">
                                    <h3 class="font-bold text-gray-800 mb-3 text-sm uppercase">Adicionais</h3>
                                    <div class="space-y-3">
                                        <div v-for="adicional in produtoParaModal.adicionais" :key="adicional.nome"
                                            class="flex items-center justify-between">
                                            <div class="flex items-center gap-3">
                                                <div class="flex items-center gap-4 border rounded-lg p-1">
                                                    <button @click="quantidadeAdicional(adicional) > 0 ? diminuirQuantidadeDeAdicional(adicional) : null"
                                                        class="w-8 h-8 flex items-center justify-center text-xl text-red-500 font-bold hover:bg-red-50 rounded"
                                                        :class="{ 'opacity-50 cursor-not-allowed': quantidadeAdicional(adicional) === 0 }">
                                                        -
                                                    </button>
                                                    <span class="font-semibold w-6 text-center text-gray-700">{{
                                                        quantidadeAdicional(adicional) }}</span>
                                                    <button @click="aumentarQuantidadeDeAdicional(adicional)"
                                                        class="w-8 h-8 flex items-center justify-center text-xl text-green-500 font-bold hover:bg-green-50 rounded">
                                                        +
                                                    </button>
                                                </div>
                                                <span class="text-gray-700 text-sm">{{ adicional.nome }}</span>
                                            </div>
                                            <span class="font-semibold text-gray-900 text-xs">
                                                + {{ formatarPreco(adicional.preco) }}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex justify-between items-center mb-6 border-t pt-4">
                                    <span class="text-gray-700 font-medium">Quantidade</span>
                                    <div class="flex items-center gap-4 border rounded-lg p-1">
                                        <button @click="quantidadeSelecionada > 1 ? quantidadeSelecionada-- : null"
                                            class="w-8 h-8 flex items-center justify-center text-xl text-red-500 font-bold hover:bg-red-50 rounded"
                                            :class="{ 'opacity-50 cursor-not-allowed': quantidadeSelecionada <= 1 }">
                                            -
                                        </button>
                                        <span class="font-semibold w-6 text-center text-gray-700">{{
                                            quantidadeSelecionada }}</span>
                                        <button @click="quantidadeSelecionada++"
                                            class="w-8 h-8 flex items-center justify-center text-xl text-green-500 font-bold hover:bg-green-50 rounded">
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div class="mb-4">
                                    <label class="text-sm text-gray-600 block mb-1">Alguma observação?</label>
                                    <textarea v-model="observacaoProduto"
                                        class="w-full border border-gray-300 rounded-lg p-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Ex: Sem cebola, capricha no molho..." rows="2"></textarea>
                                </div>
                            </div>
                        </div>

                        <div
                            class="p-4 bg-white border-t border-gray-100 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                            <button @click="adicionarAoCarrinho"
                                class="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 flex justify-between px-6">
                                <span>Adicionar</span>
                                <span>{{ formatarPreco((produtoParaModal.preco * quantidadeSelecionada) + (calcularAdicionais() * quantidadeSelecionada)) }}</span>
                            </button>
                        </div>

                    </div>
                </div>
            </Transition>
            <CarrinhoLateral />

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, reactive, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
// Stores
import { useCategoriaStore } from '../../stores/listaDeCategoriasStore';
import { listaDeProdutos } from '../../stores/listaDeProdutosStore';
import { useCarrinhoStore } from '../../stores/carrinhoStore';
import { informacoesDoCardapioStore } from '../../stores/informacoesDoCardapioStore';
import { useTaxasDeEntregaStore } from '../../stores/taxasDeEntregaStore';
import { formasDePagamentoStore } from '../../stores/formasDePagamentoStore';
// Interfaces e Utils
import { IProduto } from '../../interfaces/Iproduto';
import { converterEmReais } from '../../utils/converterEmReais';
// Components e Serviços
import CarrinhoLateral from './CarrinhoLateral.vue';
import { validarAcessoCardapioPublico } from '../../servicos/validacaoCardapioPublico';
import BaseInputCheckBox from '../../components/ui/BaseInputCheckBox.vue';
import IAdicionais from '../../interfaces/IAdicionais';
import { useAdicionaisStore } from '../../stores/listaDeAdicionaisStore';
import defaultImage from "../../../assets/vetor-sem-imagem.jpg";

export type AdicionalSelecionado = IAdicionais & {
    quantidade?: number
    precoUnitario?: number
}
const route = useRoute();

// Instância das Stores
const categoriasStore = useCategoriaStore();
const produtosStore = listaDeProdutos();
const carrinhoStore = useCarrinhoStore();
const informacoesCardapio = informacoesDoCardapioStore();
const taxasStore = useTaxasDeEntregaStore();
const pagamentosStore = formasDePagamentoStore();
const adicionaisStore = useAdicionaisStore();

// Estado Local
const categoriaSelecionada = ref<string | null>(null);
const produtoParaModal = ref<IProduto | null>(null);
const loading = ref(true);
const quantidadeSelecionada = ref(1);
const observacaoProduto = ref("");
const contaAtiva = ref(true);
const listaDeAdicionais = reactive<AdicionalSelecionado[]>([

]);

function quantidadeAdicional(adicional: AdicionalSelecionado): number {
    const adicionalEncontrado = listaDeAdicionais.find(a => a.nome === adicional.nome);
    if (adicionalEncontrado) {
        return adicionalEncontrado?.quantidade || 0;
    }
    return adicional.quantidade || 0;
}

function aumentarQuantidadeDeAdicional(adicional: AdicionalSelecionado): void {
    const adicionalEscolhido = listaDeAdicionais.find(a => a.nome === adicional.nome);
    if (!adicionalEscolhido) return;
    adicionalEscolhido.quantidade = (adicionalEscolhido.quantidade || 0) + 1;
    calcularAdicionais();
}

function diminuirQuantidadeDeAdicional(adicional: AdicionalSelecionado): void {
    const adicionalEscolhido = listaDeAdicionais.find(a => a.nome === adicional.nome);
    if (!adicionalEscolhido) return;
    adicionalEscolhido.quantidade = (adicionalEscolhido.quantidade || 0) - 1;
    calcularAdicionais();
}

function calcularAdicionais() {
    let total = listaDeAdicionais.reduce((total, atual) => total + (atual.quantidade! * atual.precoUnitario!), 0);
    
    return total;
}

// Computed: Agrupa produtos
const produtosAgrupados = computed(() => {
    let produtos = produtosStore.produtos;

    if (categoriaSelecionada.value) {
        produtos = produtos.filter(p => p.categoriaId === categoriaSelecionada.value);
    }

    const grupos: Array<{ categoriaId: string; nomeCategoria: string; produtos: IProduto[] }> = [];

    // Mapear categorias para garantir ordem e nomes
    categoriasStore.categorias.forEach(cat => {
        if (categoriaSelecionada.value && categoriaSelecionada.value !== cat.id) return;

        const produtosDaCategoria = produtos.filter(p => p.categoriaId === cat.id);

        if (produtosDaCategoria.length > 0) {
            grupos.push({
                categoriaId: cat.id,
                nomeCategoria: cat.dados.nome,
                produtos: produtosDaCategoria
            });
        }
    });

    return grupos;
});

// Ações
function abrirModalProduto(produto: IProduto) {
    produtoParaModal.value = produto;
    quantidadeSelecionada.value = 1;
    observacaoProduto.value = "";
}

function adicionarAoCarrinho() {
    const totalAdicionais = calcularAdicionais();
    if (produtoParaModal.value) {
        carrinhoStore.adicionarAoCarrinho(
            produtoParaModal.value,
            quantidadeSelecionada.value,
            observacaoProduto.value,
            listaDeAdicionais,
            totalAdicionais,
        );
        fecharModal();
    }
    carrinhoStore.carregarDoLocalStorage();
}

function formatarPreco(valor: number) {
    return converterEmReais(valor);
}

function fecharModal() {
    listaDeAdicionais.forEach(adicional => {
        if (adicional.quantidade && adicional.quantidade > 0) {
            adicional.quantidade = 0;
        }
    })
    produtoParaModal.value = null;
}

// Ciclo de Vida
onMounted(async () => {
    try {
        const uidDaRota = route.params.uid as string;

        if (uidDaRota) {
            // 1. Validação de Acesso (Teste Grátis ou Assinatura)
            const temAcesso = await validarAcessoCardapioPublico(uidDaRota);


            // Lógica corrigida: Se NÃO tem acesso, bloqueia
            if (!temAcesso) {
                contaAtiva.value = false;
                loading.value = false;
                return; // Para aqui e não carrega o resto
            }

            // 2. Se tem acesso, carrega os dados
            await Promise.all([
                categoriasStore.puxarCategorias(uidDaRota),
                produtosStore.buscarProdutos(uidDaRota),
                carrinhoStore.carregarDoLocalStorage(),
                informacoesCardapio.puxarInfoDoEstabelecimento(uidDaRota),
                taxasStore.buscarTaxas(uidDaRota),
                pagamentosStore.puxarFormasDePagamento(uidDaRota),
                adicionaisStore.puxarAdicionais(uidDaRota),
            ]);
            listaDeAdicionais.length = 0;
            watch(
                () => adicionaisStore.listaAdicionais,
                (novosAdicionais) => {
                    if (!novosAdicionais.length) return;
                    listaDeAdicionais.length = 0;
                    novosAdicionais.forEach(adicional => {
                        listaDeAdicionais.push({ ...adicional, quantidade: 0, precoUnitario: adicional.preco });
                    });
                },
                { immediate: true }
            );
        } else {
            console.warn("UID não encontrado. URL inválida.");
        }
    } catch (error) {
        console.error("Erro ao carregar cardápio:", error);
    } finally {
        loading.value = false;
    }
});
</script>

<style lang="scss" scoped>
@reference "../../assets/tailwind.css";

.filtro-item {
    @apply px-4 py-2 border border-gray-200 rounded-full bg-gray-50 text-gray-600 font-medium transition cursor-pointer select-none text-sm;

    &:hover {
        @apply bg-gray-100;
    }

    &.ativo {
        @apply bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20;
    }
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>