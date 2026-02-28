<template>
    <section class="section_options-config">
        <img class="icone-voltar" @click="voltar" :src="setaVoltar" alt="setaVoltar">
        <h1 class="text-center pt-7 pb-7">Configurações</h1>
        <button class="button-option" @click="irPara('formasdepagamento')">Formas de pagamento</button>
        <button class="button-option" @click="irPara('informacoesdocardapio')">Informações do cardápio</button>
        <button class="button-option" @click="irPara('taxasdeentrega')">Taxas de entrega</button>
    </section>
</template>

<script setup lang="ts">
    import setaVoltar from "../../../assets/fechar.png";
    import { useRouter } from "vue-router";
    const router = useRouter();
    const emits = defineEmits(['fecharConfig']);
    function voltar() {
        emits('fecharConfig');
    }
    function irPara(pagina: string) {
        router.push(`/${pagina}`)
    }
</script>

<style lang="scss">
@reference "../../assets/tailwind.css";

.section_options-config {
    @apply flex flex-col fixed top-0 min-h-screen w-full z-1001 lg:w-80 lg:right-0 gap-1;

    background-image: linear-gradient(145deg, #2c2c2cf8, #3a3a3afd);
}

.button-option {
    @apply border border-white/10 p-1.5 cursor-pointer;
}

.icone-voltar {
    @apply w-8 absolute top-6 left-2 cursor-pointer

}

</style>