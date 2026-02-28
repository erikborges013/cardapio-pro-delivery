<template>
    <div class="container-img-cardapio">
        <label for="addImagem">
            <img :src="imagemPreviaUrl ?? imagemPadrao" alt="adicionar imagem" class="add-imagem"
                id="previa-imagem" />
        </label>
        <input type="file" @change="exibirImagem" id="addImagem" alt="Imagem de perfil" class="hidden" />
    </div>
</template>

<script setup lang="ts">
import { comprimirImagem } from '../../../utils/comprimirImagem';
import imagemPadrao from "/assets/adicionarImagem.png";

const imagemArquivo = defineModel<File | undefined>('imagemArquivo', { required: true });
const imagemPreviaUrl = defineModel<any>('imagemPreviaUrl', { required: true });
    console.log(imagemPreviaUrl.value);

const exibirImagem = async (evento: Event) => {
    const input = evento.target as HTMLInputElement;
    if (!input.files?.length) return;
    const imagemComprimida = await comprimirImagem(input.files![0])
    if (imagemPreviaUrl.value && imagemPreviaUrl.value.startsWith('blob:')) {
        URL.revokeObjectURL(imagemPreviaUrl.value);
    }
    imagemPreviaUrl.value = URL.createObjectURL(imagemComprimida);
    imagemArquivo.value = imagemComprimida;
}
</script>

<style lang="scss" scoped>
@reference "../../../assets/tailwind.css";

.container-img-cardapio {
    @apply flex justify-center pb-7;
}

.add-imagem {
    @apply w-32 h-32 object-cover rounded-2xl cursor-pointer;
}
</style>