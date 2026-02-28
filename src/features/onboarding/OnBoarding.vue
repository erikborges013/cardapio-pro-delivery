<template>
    <BasePreload v-if="carregando" />
    <section v-else class="flex flex-col w-full items-center min-h-full overflow-hidden">
        <component :is="listaDePassos[passoAtual]" v-model="dados" v-model:taxaDeEntrega="dadosTaxaEntrega"
            v-model:opcoesDePagamento="formasDePagamento" :nomeTaxa="dadosTaxaEntrega.nome"
            :valorTaxa="dadosTaxaEntrega.taxa" />

        <div class="container-progresso absolute bottom-25"
            :class="{ hidden: passoAtual === listaDePassos.length - 1 }">
            <div class="barra-sucesso" :style="{ width: progresso + '%' }"></div>
        </div>
        <section class="flex justify-center px-10 py-6 w-full absolute bottom-0"
            :class="{ hidden: passoAtual === listaDePassos.length - 1 }">
            <baseButtonGenerico v-if="passoAtual > 0 && passoAtual < 13" :botaoEstaAtivo="false"
                :texto="passoAtual === 0 ? 'Criar Cardápio' : 'Voltar'" :status="true" @click="botaoVoltar" />
            <baseButtonGenerico :botaoEstaAtivo="false" :texto="passoAtual === 0 ? 'Criar Cardápio' : 'Seguir'"
                :status="true" @click="botaoSeguir" />
        </section>
    </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import BaseButtonGenerico from '../../components/ui/BaseButtonGenerico.vue';
import { TDadosParaManipulacao } from '../../interfaces/IInformacoesDoCardapio';
import PassoInicial from './PassoInicial.vue';
import PassoLogo from './PassoLogo.vue';
import PassoNome from './PassoNome.vue';
import PassoEndereco from './PassoEndereco.vue';
import PassoWhatsapp from './PassoWhatsapp.vue';
import PassoTempoEstimado from './PassoTempoEstimado.vue';
import PassoHorarioFuncionamento from './PassoHorarioFuncionamento.vue';
import PassoDiasDeFuncionamento from './PassoDiasDeFuncionamento.vue';
import PassoPedidoMinimo from './PassoPedidoMinimo.vue';
import PassoFormasDePagamento from './PassoFormasDePagamento.vue';
import ITaxasDeEntrega from '../../interfaces/ITaxasDeEntrega';
import PassoCadastreUmaTaxaDeEntrega from './PassoCadastreUmaTaxaDeEntrega.vue';
import PassoFinal from './PassoFinal.vue';
import { useIndexDB } from '../../composables/useOnboarding';
import useInformacoesDoCardapio from '../../composables/useInformacoesDoCardapio';
import { useAuthStore } from '../../stores/authStore';
import { useFormasDePagamento } from '../../composables/useFormasDePagamento';
import useTaxasDeEntrega from '../../composables/useTaxasDeEntrega';
import BasePreload from '../../components/ui/BasePreload.vue';
const usuario = useAuthStore();
const passoAtual = ref(0);
const progresso = computed(() => (passoAtual.value / totalPassos) * 100);
const formasDePagamento = ref<string[]>([]);
const carregando = ref(false);
const { abrirBanco, salvarInformacoesDoCardapioNoIndexDB, carregarDadosDoIndexDB, salvarFormasDePagamentoNoIndexdDB, salvarTaxaDeEntregaNoIndexdDB } = useIndexDB();
type dadosIndexdDB = {
    id: string;
    imagem: File;
    informacoesDoCardapio: TDadosParaManipulacao;
}

type formasDePagamentoIndexdDB = {
    id: string;
    formasDePagamento: string[];
}

type taxaDeEntregaIndexdDB = {
    id: string;
    taxaDeEntrega: ITaxasDeEntrega;
}

const listaDePassos = [
    PassoInicial,
    PassoLogo,
    PassoNome,
    PassoEndereco,
    PassoWhatsapp,
    PassoTempoEstimado,
    PassoHorarioFuncionamento,
    PassoDiasDeFuncionamento,
    PassoPedidoMinimo,
    PassoFormasDePagamento,
    PassoCadastreUmaTaxaDeEntrega,
    PassoFinal,
];

const totalPassos = listaDePassos.length - 1;

const dados = reactive<TDadosParaManipulacao>({
    imagem: undefined as File | undefined,
    imagemPrevia: null as string | null,
    urlAntiga: "" as string,
    nomeEstabelecimento: "" as string,
    cidade: "" as string,
    numeroEstabelecimento: "" as string,
    bairro: "" as string,
    rua: "" as string,
    horaEstimadaEntrega: "" as string,
    minutosEstimadoEntrega: "" as string,
    horaEstimadaRetirada: "" as string,
    minutosEstimadoRetirada: "" as string,
    pedidoMinimo: 0 as number,
    ddd: "" as string,
    celular: "" as string,
    horaFinalFuncionamento: "" as string,
    horaInicialFuncionamento: "" as string,
    diasSelecionados: [] as string[],
});

const dadosTaxaEntrega = reactive({
    nome: "",
    taxa: 0,
});

function botaoVoltar() {
    if (passoAtual.value > 0) {
        passoAtual.value--
    }
}

async function botaoSeguir() {
    if (!dados.imagem && passoAtual.value === 1) {
        alert("Selecione uma imagem");
        return;
    }

    if (!dados.nomeEstabelecimento && passoAtual.value === 2) {
        alert("Digite o nome do seu estabelecimento");
        return;
    }

    if ((!dados.cidade || !dados.bairro || !dados.rua || !dados.numeroEstabelecimento) && passoAtual.value === 3) {
        alert("Preencha todos os campos do endereço corretamente");
        return;
    }

    if (dados.celular.length < 9 && passoAtual.value === 4) {
        alert("Preencha o whatsapp corretamente");
        return;
    }

    if ((!dados.horaEstimadaEntrega || !dados.horaEstimadaRetirada || !dados.minutosEstimadoEntrega || !dados.minutosEstimadoRetirada) && passoAtual.value === 5) {
        alert("Selecione todos os tempos estimados!");
        return;
    }

    if (dados.horaInicialFuncionamento === dados.horaFinalFuncionamento && passoAtual.value === 6) {
        alert("Os horários não podem ser iguais");
        return;
    }

    if (dados.diasSelecionados.length === 0 && passoAtual.value === 7) {
        alert("Selecione os dias de funcionamento");
        return;
    }


    if (!dados.pedidoMinimo && dados.pedidoMinimo !== 0 && passoAtual.value === 8) {
        alert("Preencha o campo de pedido mínimo corretamente");
        return;
    }

    if (formasDePagamento.value.length === 0 && passoAtual.value === 9) {
        alert("Selecione pelo menos uma forma de pagamento.");
        return;
    }

    if ((!dadosTaxaEntrega.nome || dadosTaxaEntrega.taxa < 0) && passoAtual.value === 10) {
        alert("Por favor, preencha os dados corretamente");
        return;
    }

    await enviarParaOIndexDb();
    passoAtual.value++;
    if (passoAtual.value === listaDePassos.length - 1) {
        carregando.value = true;
        await cadastrarDados();
    }
}

async function cadastrarDados(): Promise<void> {
    try {
        const uid = usuario.uid;
        if (!uid) throw new Error("Usuário não autenticado");
        const { salvarNoBancoDeDados } = useInformacoesDoCardapio(uid);
        const { enviarParaBancoDeDados } = useFormasDePagamento(uid);
        const { cadastrar } = useTaxasDeEntrega(uid);
        await Promise.all([
            salvarNoBancoDeDados(dados),
            enviarParaBancoDeDados(formasDePagamento.value),
            cadastrar(dadosTaxaEntrega),
        ]);
        carregando.value = false
        console.log("dados cadastrados com sucesso no firebase");
    } catch (error) {
        console.log("Erro ao cadastrar dados", error);
        carregando.value = false;
    }
}

async function enviarParaOIndexDb(): Promise<void> {
    try {
        await abrirBanco();
        await salvarInformacoesDoCardapioNoIndexDB("informacoes-cardapio", dados);
        if (formasDePagamento.value.length > 0) await salvarFormasDePagamentoNoIndexdDB("formas-de-pagamento", formasDePagamento.value);
        if (dadosTaxaEntrega.nome) await salvarTaxaDeEntregaNoIndexdDB("taxa-de-entrega", dadosTaxaEntrega);
    } catch (erro) {
        console.log("Erro ao salvar dados no indexDb", erro);
    }
}

onMounted(async () => {
    try {
        await abrirBanco();
        const informacoesSalvas: dadosIndexdDB = await carregarDadosDoIndexDB("informacoes-cardapio");
        const formasDePagamentoSalvas: formasDePagamentoIndexdDB = await carregarDadosDoIndexDB("formas-de-pagamento");
        const taxaDeEntregaSalva: taxaDeEntregaIndexdDB = await carregarDadosDoIndexDB("taxa-de-entrega");
        if (!informacoesSalvas) {
            console.log("Nenhum dado encontrado no indexDb");
            return;
        }
        dados.imagem = informacoesSalvas.imagem;
        if (dados.imagemPrevia) {
            URL.revokeObjectURL(dados.imagemPrevia);
        }
        if (dados.imagem) {
            dados.imagemPrevia = URL.createObjectURL(dados.imagem);
        }
        dados.nomeEstabelecimento = informacoesSalvas.informacoesDoCardapio.nomeEstabelecimento;
        dados.cidade = informacoesSalvas.informacoesDoCardapio.cidade || "";
        dados.rua = informacoesSalvas.informacoesDoCardapio.rua || "";
        dados.bairro = informacoesSalvas.informacoesDoCardapio.bairro || "";
        dados.numeroEstabelecimento = informacoesSalvas.informacoesDoCardapio.numeroEstabelecimento || "";
        dados.ddd = informacoesSalvas.informacoesDoCardapio.ddd;
        dados.celular = informacoesSalvas.informacoesDoCardapio.celular || "";
        dados.horaEstimadaEntrega = informacoesSalvas.informacoesDoCardapio.horaEstimadaEntrega;
        dados.minutosEstimadoEntrega = informacoesSalvas.informacoesDoCardapio.minutosEstimadoEntrega;
        dados.horaEstimadaRetirada = informacoesSalvas.informacoesDoCardapio.horaEstimadaRetirada;
        dados.minutosEstimadoRetirada = informacoesSalvas.informacoesDoCardapio.minutosEstimadoRetirada;
        dados.horaInicialFuncionamento = informacoesSalvas.informacoesDoCardapio.horaInicialFuncionamento;
        dados.horaFinalFuncionamento = informacoesSalvas.informacoesDoCardapio.horaFinalFuncionamento;
        dados.diasSelecionados = informacoesSalvas.informacoesDoCardapio.diasSelecionados || [];
        dados.pedidoMinimo = informacoesSalvas.informacoesDoCardapio.pedidoMinimo || 0;
        formasDePagamento.value = formasDePagamentoSalvas?.formasDePagamento || [];
        dadosTaxaEntrega.nome = taxaDeEntregaSalva.taxaDeEntrega.nome || "";
        dadosTaxaEntrega.taxa = taxaDeEntregaSalva.taxaDeEntrega.taxa || 0;
    } catch (erro) {
        console.log("Erro ao exibir os dados", erro);
    }
});
</script>

<style lang="scss" scoped>
@reference "../../assets/tailwind.css";

.container-progresso {
    @apply w-[80%] bg-white/10 rounded-full h-2.5 mb-8 overflow-hidden;
}

.barra-sucesso {
    @apply h-full rounded-full transition-all duration-500 ease-out;
    background: linear-gradient(90deg, #facc15 0%, #ca8a04 100%);
    box-shadow: 0 0 12px rgba(255, 235, 59, 0.6);
}
</style>