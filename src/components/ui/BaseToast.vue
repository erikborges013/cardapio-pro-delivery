<template>
  <div v-if="exibir" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">

    <Transition name="pop" appear>
      <div class="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-100">

        <div class="p-8 text-center">
          <h3 class="text-xl font-bold text-gray-900 mb-2">
            {{ titulo }}
          </h3>

          <p class="text-gray-600 mb-8 text-sm leading-relaxed">
            {{ mensagem }}
          </p>

          <div class="flex flex-col gap-2">
            <button @click="$emit('confirmar')" :disabled="botaoDesabilitado"
              :class="['cursor-pointer w-full py-3 rounded-xl font-bold text-white transition-all transform active:scale-95 shadow-md', cores[tipo].botaoPrincipal]">
              {{ textoConfirmar }}
            </button>

            <button v-if="mostrarCancelar" @click="$emit('cancelar')"
              class="w-full py-3 text-gray-400 font-medium hover:text-gray-600 transition-colors text-sm cursor-pointer">
              {{ textoCancelar }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { markRaw } from 'vue';

type TipoAlerta = 'sucesso' | 'erro' | 'aviso' | 'pergunta';

interface Props {
  exibir: boolean;
  tipo?: TipoAlerta;
  titulo: string;
  mensagem: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  mostrarCancelar?: boolean;
  botaoDesabilitado?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  tipo: 'aviso',
  textoConfirmar: 'Entendido',
  textoCancelar: 'Cancelar',
  mostrarCancelar: true,
  botaoDesabilitado: false,
});

defineEmits(['confirmar', 'cancelar']);

const cores = {
  sucesso: {
    bgIcone: 'bg-green-100',
    textoIcone: 'text-green-600',
    botaoPrincipal: 'bg-green-600 hover:bg-green-700'
  },
  erro: {
    bgIcone: 'bg-red-100',
    textoIcone: 'text-red-600',
    botaoPrincipal: 'bg-red-600 hover:bg-red-700'
  },
  aviso: {
    bgIcone: 'bg-orange-100',
    textoIcone: 'text-orange-600',
    botaoPrincipal: 'bg-orange-600 hover:bg-orange-700'
  },
  pergunta: {
    bgIcone: 'bg-blue-100',
    textoIcone: 'text-blue-600',
    botaoPrincipal: 'bg-blue-600 hover:bg-blue-700'
  }
};


</script>

<style scoped>
.pop-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.pop-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
</style>