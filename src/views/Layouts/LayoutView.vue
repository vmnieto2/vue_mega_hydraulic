<template>
  <div id="main-data">
    <Navbar />
    <div class="main-content container mt-4">
      <slot></slot> <!-- Aquí se renderizará el contenido dinámico de cada página -->
    </div>
    <Footer />
  </div>
</template>
  
<script setup>
  import Navbar from './NavbarView.vue';
  import Footer from './FooterView.vue';
</script>

<style scoped>

html, body {
  height: 100%;
  margin: 0;
}

#main-data {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1; /* Este es el contenido dinámico que empuja el footer hacia abajo */
}

</style>
  