<template>
  <label :class="id ?? 'check'">
    <p>{{ texto }}</p>
    <input type="checkbox" v-model="model" :value="value ?? 'checkbox'"/>
    <span class="caixa"></span>
  </label>
</template>

<script setup lang="ts">

const model = defineModel<Boolean | String[]>();

defineProps({
  texto: { type: String, required: false, default: "" },
  value: String,
  id: String
});
</script>

<style lang="scss" scoped>
  @reference "../../assets/tailwind.css";
.check {
  @apply flex items-center justify-between
         px-4 py-3
         border border-zinc-600
         text-white
         cursor-pointer
         select-none;
         

  font-family: var(--fonte-principal);

  input {
    @apply sr-only;

    &:checked + .caixa {
      @apply bg-green-500 border-green-500;

      &::after {
        @apply opacity-100;
      }
    }
  }
}

.caixa {
  @apply w-5 h-5
         border-2 border-zinc-400
         relative
         flex-shrink-0;

  &::after {
    content: "";
    @apply absolute w-[5px] h-[10px]
           border-white border-r-2 border-b-2
           rotate-45 opacity-0;
    top: 2px;
    left: 6px;
  }
}

</style>