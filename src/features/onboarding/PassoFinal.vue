<template>
    <section class="flex flex-col gap-4 pt-60 md:pt-30 w-[90%] items-center">
        <h1 class="text-center">Parabéns!!!</h1>
        <h2 class="text-center">Seu cardápio já está no ar e funcionando</h2>
        <LinkCardapio />
        <section class="flex justify-center px-10 py-6 w-full absolute bottom-0">
            <baseButtonGenerico :botaoEstaAtivo="false" :texto="'Ir para o painel administrativo'" :status="true"
                @click="irParaPainelAdm" />
        </section>
    </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import BaseButtonGenerico from '../../components/ui/BaseButtonGenerico.vue';
import LinkCardapio from '../painelAdministrativo/LinkCardapio.vue';
const router = useRouter();

function irParaPainelAdm() {
    router.push('/admin');
}
</script>