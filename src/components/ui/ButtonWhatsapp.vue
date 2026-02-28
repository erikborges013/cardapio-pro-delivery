<template>
    <a href="https://wa.me/+5513982326140" target="_blank"
  rel="noopener" class="whatsapp-icon"><img :src="logoWhatsapp" alt="logo-whatsapp"></a>
</template>

<script setup lang="ts">
    import logoWhatsapp from "../../assets/logo_whatsapp_icon_181638.webp";
</script>

<style lang="scss" scoped>
    @reference "../../assets/tailwind.css";
  .whatsapp-icon {
    @apply w-18 fixed z-1000 bottom-5 right-5 cursor-pointer;
  }

</style>