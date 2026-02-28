<template>
    <section v-if="infoCardapioStore.telaPronta === false">
        <BasePreload />
    </section>
    <section v-else class="informacoes_do-cardapio">
        <section>
            <img class="icone-voltar" @click="voltar" :src="setaVoltar" alt="setaVoltar">
            <h1 class="titulo_pagina">Informações do cardápio</h1>
        </section>
        <section class="sessao_informacoes-cardapio">
            <CardapioImagemUpload :dados="dados" v-model:imagemArquivo="dados.imagem"
                v-model:imagemPreviaUrl="dados.imagemPrevia" />
            <form class="form-cadastro-informacoes" @submit.prevent="enviar">
                <p>Nome do restaurante:</p>
                <BaseInput :obrigatorio="true" :quantidade="30" :tipo="'text'"
                    :textoPlaceHolder="'Nome do estabelecimento'" v-model="dados.nomeEstabelecimento" />
                <p>Endereço do estabelecimento:</p>
                <div class="container-endereco">
                    <BaseInput :obrigatorio="true" :quantidade="30" :tipo="'text'" :textoPlaceHolder="'Cidade'"
                        v-model="dados.cidade" />
                    <BaseInput :obrigatorio="true" :quantidade="30" :tipo="'text'" :textoPlaceHolder="'Nº'"
                        v-model="dados.numeroEstabelecimento" />
                </div>
                <BaseInput :obrigatorio="true" :quantidade="30" :tipo="'text'" :textoPlaceHolder="'Bairro'"
                    v-model="dados.bairro" />
                <BaseInput :obrigatorio="true" :quantidade="30" :tipo="'text'" :textoPlaceHolder="'Rua'"
                    v-model="dados.rua" />
                <TempoEstimadoSelect v-model:dados="dados" />
                <p>Pedido mínimo:</p>
                <div class="w-30">
                    <BaseInput :obrigatorio="true" :quantidade="2" :tipo="'number'" :textoPlaceHolder="'Pedido mínimo'"
                        v-model="dados.pedidoMinimo" />
                </div>
                <p>WhatsApp:</p>
                <div class="container-whatsapp">
                    <BaseInput :obrigatorio="true" :quantidade="2" :tipo="'text'" :textoPlaceHolder="'DDD'"
                        v-model="dados.ddd" />
                    <BaseInput :obrigatorio="true" :quantidade="9" :tipo="'text'" :textoPlaceHolder="'Celular'"
                        v-model="dados.celular" />
                </div>
                <div class="containerHorarioDeFuncionamento">
                    <p>Horário de funcionamento:</p>
                    <div class="subcontainer-horario-de-funcionamento">
                        <input class="horario-funcionamento" type="time" placeholder="Horário de funcionamento"
                            id="horario-inicial-funcionamento" v-model="dados.horaInicialFuncionamento" />
                        <p>às</p>
                        <input class="horario-funcionamento" type="time" placeholder="Horário de funcionamento"
                            id="horario-final-funcionamento" v-model="dados.horaFinalFuncionamento" />
                    </div>
                </div>
                <DiasFuncionamento v-model:diasSelecionados="dados.diasSelecionados" />
                <span class="container_botao">
                    <BaseButtonGenerico :botaoEstaAtivo="carregando" :tipo="'submit'" :texto="'Salvar'"
                        :status="true" />
                </span>
            </form>
        </section>
    </section>
</template>

<script setup lang="ts">
import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseButtonGenerico from '../../../components/ui/BaseButtonGenerico.vue';
import setaVoltar from "../../../../assets/voltar.png";
import { useRouter } from 'vue-router';
import { onBeforeMount, reactive, ref, watch, watchEffect } from 'vue';
import { useAuthStore } from '../../../stores/authStore';
import { informacoesDoCardapioStore } from '../../../stores/informacoesDoCardapioStore';
import useInformacoesDoCardapio from '../../../composables/useInformacoesDoCardapio';
import BasePreload from '../../../components/ui/BasePreload.vue';
import { TDadosParaManipulacao } from '../../../interfaces/IInformacoesDoCardapio';
import CardapioImagemUpload from './CardapioImagemUpload.vue';
import TempoEstimadoSelect from './TempoEstimadoSelect.vue';
import DiasFuncionamento from './DiasFuncionamento.vue';
const router = useRouter();
const uid = useAuthStore().uid;
const infoCardapioStore = informacoesDoCardapioStore();
const useInfoCardapio = useInformacoesDoCardapio(uid!);
const { salvarNoBancoDeDados, carregando } = useInfoCardapio

onBeforeMount(() => {
    if (!uid) {
        console.log("Uid não encontrado!");
        return;
    }
    infoCardapioStore.puxarInfoDoEstabelecimento(uid);
})

const dados = reactive<TDadosParaManipulacao>({
    imagem: undefined as File | undefined,
    imagemPrevia: null as any,
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

async function enviar() {
    const resposta = await salvarNoBancoDeDados(dados);
    if (resposta) {
        alert("informações cadastradas com sucesso");
        router.push("/admin");
    } else {
        alert("Erro ao tentar cadastrar as informações");
    }
}

watch(
    () => infoCardapioStore.informacoesDoEstabelecimento,
    (novoValor) => {
        if (novoValor) {
            dados.imagemPrevia = novoValor.imagemUrl;
            dados.urlAntiga = novoValor.imagemUrl;
            dados.nomeEstabelecimento = novoValor.nomeDoEstabelecimento;
            dados.cidade = novoValor.endereco.cidade;
            dados.numeroEstabelecimento = novoValor.endereco.numero;
            dados.bairro = novoValor.endereco.bairro;
            dados.rua = novoValor.endereco.rua;
            dados.horaEstimadaEntrega = novoValor.tempoDeEntrega.split(':')[0];
            dados.minutosEstimadoEntrega = novoValor.tempoDeEntrega.split(':')[1];
            dados.horaEstimadaRetirada = novoValor.tempoDeRetirada.split(':')[0];
            dados.minutosEstimadoRetirada = novoValor.tempoDeRetirada.split(':')[1];
            dados.pedidoMinimo = novoValor.pedidoMinimo;
            dados.ddd = novoValor.whatsApp.slice(0, 2);
            dados.celular = novoValor.whatsApp.slice(2);
            dados.horaInicialFuncionamento = novoValor.horaInicialFuncionamento;
            dados.horaFinalFuncionamento = novoValor.horaFinalFuncionamento;
            dados.diasSelecionados = novoValor.diasDeFuncionamento
            console.log(novoValor);
        }
    },
    { immediate: true }
);
function voltar() {
    router.push("/admin");
}
</script>

<style lang="scss" scoped>
@reference "../../../assets/tailwind.css";

.informacoes_do-cardapio {
    @apply flex flex-col items-center w-full min-h-screen pb-10 bg-transparent;
}

.informacoes_do-cardapio > section:first-of-type {
    @apply relative w-full flex items-center justify-center py-6 mb-2;
    @apply lg:w-7/12 lg:max-w-2xl; 
}

.icone-voltar {
    
    @apply w-8 h-8 absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer;
    @apply hover:scale-110 transition-transform duration-200;
}

.titulo_pagina {
    @apply text-center text-2xl font-bold md:text-3xl;
}


.sessao_informacoes-cardapio {
    @apply w-full px-4;
    @apply md:w-8/12 lg:w-7/12 lg:max-w-2xl; 
}

.form-cadastro-informacoes {
    @apply flex flex-col gap-3 w-full; 

    
    p {
        @apply text-sm font-medium ml-1 mt-2 mb-1 opacity-90;
    }
}


.container-endereco {
    @apply grid grid-cols-[3fr_1fr] gap-3; 
}

.container-whatsapp {
    @apply grid grid-cols-[2fr_5fr] gap-3; 
}

.containerHorarioDeFuncionamento {
    @apply grid grid-cols-[50fr_50fr] justify-start items-center gap-3 w-full mb-4;
    
   .subcontainer-horario-de-funcionamento {
    @apply flex flex-col justify-center items-center
   }
}

.horario-funcionamento {
    @apply flex-1 min-w-[120px]; 
    @apply bg-transparent text-white p-2 rounded-md;
    @apply border border-white/40;
    @apply focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-all;
    
    &::-webkit-calendar-picker-indicator {
        filter: invert(1);
        cursor: pointer;
    }
}

.container_botao {
    @apply flex justify-center py-6 w-full;
}
</style>