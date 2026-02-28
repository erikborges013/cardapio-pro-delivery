<template>
    <div class="produto-nao-encontrado">
        <h3>{{ texto }}</h3>
        <video autoplay loop muted playsinline width="100">
            <source :src="iconeFantasma" type="video/webm">
        </video>
    </div>
</template>

<script setup lang="ts">
import iconeFantasma from "../../../assets/Ghost.webm";

const props = defineProps({
    texto: { type: String, required: true }
});
</script>

<style scoped>
.produto-nao-encontrado {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 100px;
}
</style>