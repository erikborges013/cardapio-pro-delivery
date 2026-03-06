<template>
  <Teleport to="body">
    <Transition name="slide-fade">
      <div v-if="carrinhoStore.modalAberto" class="fixed inset-0 z-50 flex justify-end">
        
        <div 
          class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
          @click="carrinhoStore.alternarModalCarrinho()"
        ></div>

        <aside class="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
          
          <div class="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span class="text-2xl">🛒</span> Seu Pedido
            </h2>
            <button 
              @click="carrinhoStore.alternarModalCarrinho()"
              class="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition"
            >
              ✕
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-5 space-y-6 bg-gray-50/50">
            
            <div v-if="carrinhoStore.itens.length === 0" class="flex flex-col items-center justify-center h-64 text-center text-gray-400">
              <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-4xl">
                🍔
              </div>
              <p class="text-lg font-medium text-gray-600">Sua sacola está vazia</p>
              <button 
                @click="carrinhoStore.alternarModalCarrinho()" 
                class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition"
              >
                Voltar ao Cardápio
              </button>
            </div>

            <div v-else class="space-y-4">
              <div 
                v-for="item in carrinhoStore.itens" 
                :key="item.id" 
                class="flex gap-3 bg-white border border-gray-100 p-3 rounded-xl shadow-sm"
              >
                <div class="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                   <img :src="item.imagemURL || defaultImage" class="w-full h-full object-cover" />
                </div>

                <div class="flex-1">
                  <div class="flex justify-between items-start mb-1">
                    <h3 class="font-semibold text-gray-800 line-clamp-1">{{ item.nome }}</h3>
                    <button @click="carrinhoStore.removerItem(item.idProdutoCarrinho)" class="text-gray-400 hover:text-red-500 text-xs">
                      Remover
                    </button>
                  </div>
                  
                  <p class="text-xs text-gray-500 mb-2 line-clamp-1">{{ item.ingredientes }}</p>
                  <div v-for="adicional in item.adicionais" class="flex justify-between">
                    <p class="text-xs text-gray-900 mb-2 line-clamp-1">{{ adicional.nome }}</p>
                    <p class="text-xs text-gray-900 mb-2 line-clamp-1">{{ adicional.quantidade }}</p>
                  </div>
                  <p v-if="item.observacao" class="text-xs text-orange-600 italic mb-2">Obs: {{ item.observacao }}</p>

                  <div class="flex justify-between items-end">
                    <span class="font-bold text-gray-900">{{ converterEmReais((item.preco * item.quantidade) + (item.valorTotalAdicionais * item.quantidade)) }}</span>
                    <div class="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1 border border-gray-200">
                      <button @click="carrinhoStore.decrementarQuantidade(item.idProdutoCarrinho)" class="text-red-500 font-bold px-1 hover:scale-110 transition">-</button>
                      <span class="text-sm font-semibold w-4 text-center text-gray-500">{{ item.quantidade }}</span>
                      <button @click="carrinhoStore.incrementarQuantidade(item.idProdutoCarrinho)" class="text-green-600 font-bold px-1 hover:scale-110 transition">+</button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="border-t border-gray-200 pt-6 space-y-6">
                
                <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                   <h3 class="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm uppercase">👤 Seus Dados</h3>
                   <input v-model="form.nome" type="text" placeholder="Seu Nome Completo" class="input-padrao" />
                </div>

                <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                   <h3 class="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm uppercase">📍 Entrega</h3>
                   
                   <div class="mb-3">
                      <label class="text-xs text-gray-500 font-medium ml-1">Selecione sua região/bairro:</label>
                      <select v-model="taxaSelecionada" class="input-padrao mt-1 cursor-pointer">
                          <option :value="null" disabled>Selecione...</option>
                          <option v-for="taxa in taxasStore.taxas" :key="taxa.id" :value="taxa">
                              {{ taxa.nome }} - {{ converterEmReais(taxa.taxa) }}
                          </option>
                      </select>
                      <p v-if="taxasStore.taxas.length === 0" class="text-xs text-yellow-600 mt-1">
                          Nenhuma taxa cadastrada. O valor será a combinar.
                      </p>
                   </div>

                   <div class="grid grid-cols-4 gap-3">
                      <input v-model="form.rua" type="text" placeholder="Rua / Avenida" class="input-padrao col-span-3" />
                      <input v-model="form.numero" type="text" placeholder="Nº" class="input-padrao col-span-1" />
                      <input v-model="form.complemento" type="text" placeholder="Complemento / Ponto de Ref." class="input-padrao col-span-4" />
                      <input v-model="form.whatsapp" type="text" placeholder="WhatsApp" class="input-padrao col-span-4">
                    </div>
                </div>

                <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                   <h3 class="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm uppercase">💳 Pagamento</h3>
                   
                   <div v-if="pagamentosStore.formasDePagamento && pagamentosStore.formasDePagamento.length > 0">
                       <div class="grid grid-cols-2 gap-2">
                          <button 
                            v-for="pagamento in pagamentosStore.formasDePagamento" 
                            :key="pagamento"
                            @click="form.pagamento = pagamento"
                            class="btn-pagamento"
                            :class="form.pagamento === pagamento ? 'active' : ''"
                          >
                            {{ pagamento }}
                          </button>
                       </div>
                   </div>
                   <p v-else class="text-sm text-gray-500">Nenhuma forma de pagamento cadastrada. Combine pelo WhatsApp.</p>
                   
                   <div v-if="form.pagamento === 'Dinheiro'" class="mt-3 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                      <label class="text-xs text-gray-700 font-medium">Precisa de troco para quanto?</label>
                      <input v-model="form.troco" type="text" placeholder="Ex: 50,00" class="input-padrao mt-1 bg-white" />
                   </div>
                </div>

              </div>
            </div>
          </div>

          <div v-if="carrinhoStore.itens.length > 0" class="p-5 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
            <div class="space-y-2 mb-4 text-sm text-gray-600">
              <div class="flex justify-between">
                <span>Subtotal</span>
                <span>{{ converterEmReais(carrinhoStore.totalDoPedido) }}</span>
              </div>
              <div class="flex justify-between text-blue-600 font-medium">
                <span>Entrega</span>
                <span v-if="taxaSelecionada">{{ converterEmReais(taxaSelecionada.taxa) }}</span>
                <span v-else>A calcular</span>
              </div>
              <div class="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-dashed mt-2">
                <span>Total</span>
                <span>{{ converterEmReais(totalComEntrega) }}</span>
              </div>
            </div>

            <button 
              @click="finalizarPedido"
              :disabled="!formValido"
              class="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img :src="logoWhatsapp" class="w-5 h-5 filter brightness-0 invert" alt="WhatsApp">
              {{ formValido ? 'Enviar Pedido no WhatsApp' : 'Preencha os dados' }}
            </button>
          </div>

        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from 'vue';
import { useCarrinhoStore } from '../../stores/carrinhoStore';
import { useTaxasDeEntregaStore } from '../../stores/taxasDeEntregaStore';
import { formasDePagamentoStore } from '../../stores/formasDePagamentoStore';
import { useAuthStore } from '../../stores/authStore';
import { converterEmReais } from '../../utils/converterEmReais';
import ITaxasDeEntrega from '../../interfaces/ITaxasDeEntrega';
import { informacoesDoCardapioStore } from '../../stores/informacoesDoCardapioStore';
import defaultImage from "../../../assets/vetor-sem-imagem.jpg";
import logoWhatsapp from "../../assets/logo_whatsapp_icon_181638.webp"
import converterParaNumber from '../../utils/normalizarPreco';

const carrinhoStore = useCarrinhoStore();
const taxasStore = useTaxasDeEntregaStore();
const pagamentosStore = formasDePagamentoStore();
const authStore = useAuthStore();
const informacoesCardapio = informacoesDoCardapioStore();

const taxaSelecionada = ref<ITaxasDeEntrega | null>(null);
const form = reactive({
  nome: '',
  rua: '',
  numero: '',
  complemento: '',
  whatsapp: '',
  pagamento: '',
  troco: ''
});


const totalComEntrega = computed(() => {
    const subtotal = carrinhoStore.totalDoPedido;
    const entrega = taxaSelecionada.value ? taxaSelecionada.value.taxa : 0;
    
    return converterParaNumber(subtotal) + converterParaNumber(entrega);
});

const formValido = computed(() => {
  const dadosBasicos = form.nome.length > 2 && 
                       form.rua.length > 1 && 
                       form.numero.length > 0 &&
                       form.whatsapp.length > 8; 
  
  const taxaOk = taxasStore.taxas.length > 0 ? taxaSelecionada.value !== null : true;
  
  const pagamentoOk = pagamentosStore.formasDePagamento && pagamentosStore.formasDePagamento.length > 0 
                      ? form.pagamento !== '' 
                      : true;

  return dadosBasicos && taxaOk && pagamentoOk;
});

onMounted(() => {
    carregarDadosAuxiliares();
});

watch(() => authStore.uid, () => {
    carregarDadosAuxiliares();
});

function carregarDadosAuxiliares() {
    const uid = authStore.uid;
    if (uid) {
        taxasStore.buscarTaxas(uid);
        pagamentosStore.puxarFormasDePagamento(uid);
        informacoesCardapio.puxarInfoDoEstabelecimento(uid);
    }
}

function finalizarPedido() {
  if (!formValido.value) return;

  const telefoneBruto = informacoesCardapio.informacoesDoEstabelecimento?.whatsApp;

  if (!telefoneBruto) {
      alert("O telefone do estabelecimento não está configurado. Tente novamente em instantes.");
      return;
  }

  const telefoneLimpo = String(telefoneBruto).replace(/\D/g, '');

  let msg = `*NOVO PEDIDO - ${informacoesCardapio.informacoesDoEstabelecimento?.nomeDoEstabelecimento}* 🍔\n\n`;

  
  msg += `👤 *Cliente:* ${form.nome}\n`;
  msg += `📍 *Endereço:* ${form.rua}, ${form.numero}\n`;
  msg += `*Whatsapp:* ${form.whatsapp}`
  if(form.complemento) msg += `   Ref: ${form.complemento}\n`;
  
  if (taxaSelecionada.value) {
      msg += `🛵 *Região de Entrega:* ${taxaSelecionada.value.nome}\n`;
  }
  msg += `\n--------------------------------\n`;

  carrinhoStore.itens.forEach(item => {
    msg += `▪️ ${item.quantidade}x ${item.nome}\n`;
    if (item.valorTotalAdicionais) {
      msg += ` *Adicionais por unidade:*\n`
      item.adicionais.forEach(adicional => {
        msg += `▪️ ${adicional.quantidade}x ${adicional.nome}\n`
      })
    }
    if(item.observacao) msg += `   _Obs: ${item.observacao}_\n`;
    msg += `   Valor: ${converterEmReais((item.preco * item.quantidade) + (item.valorTotalAdicionais * item.quantidade))}\n`;
     msg += `--------------------------------\n`;
  });

  msg += `💰 *Subtotal:* ${converterEmReais(carrinhoStore.totalDoPedido)}\n`;
  
  if (taxaSelecionada.value) {
      msg += `🚚 *Taxa de Entrega:* ${converterEmReais(taxaSelecionada.value.taxa)}\n`;
  } else {
      msg += `🚚 *Taxa de Entrega:* A combinar\n`;
  }

  msg += `💵 *TOTAL FINAL:* ${converterEmReais(totalComEntrega.value)}\n`;
  msg += `--------------------------------\n`;
  
  if (form.pagamento) {
      msg += `💳 *Pagamento:* ${form.pagamento}\n`;
      if(form.pagamento === 'Dinheiro' && form.troco) {
          msg += `🔄 *Troco para:* ${form.troco}\n`;
      }
  } else {
      msg += `💳 *Pagamento:* A combinar\n`;
  }
  
  msg += `\nAguardo confirmação!`;

  const urlWhatsApp = `https://wa.me/55${telefoneLimpo}?text=${encodeURIComponent(msg)}`;
  window.open(urlWhatsApp, '_blank');
}
</script>

<style scoped>
@reference "../../assets/tailwind.css";

.input-padrao {
  @apply w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none transition;
}

.btn-pagamento {
  @apply border border-gray-200 bg-gray-50 text-gray-600 rounded-lg py-3 text-sm font-medium hover:bg-gray-100 transition shadow-sm;
}

.btn-pagamento.active {
  @apply bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500 font-bold shadow-md shadow-blue-500/10;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active aside {
  animation: slide-in 0.3s ease-out forwards;
}

.slide-fade-leave-active aside {
  animation: slide-out 0.3s ease-in forwards;
}

@keyframes slide-in {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes slide-out {
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
}
</style>