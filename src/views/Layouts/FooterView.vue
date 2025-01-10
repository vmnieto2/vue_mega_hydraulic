<template>
    <footer>
        <div>
            <span>© {{ fecha }} Megahydraulic. Todos los derechos reservados.</span>
        </div>
    </footer>
</template>

<script setup>
const fecha = new Date().getFullYear();
</script>

<style scoped>

footer{
  padding: 15px;
  text-align: center;
  background-color: #2a475f;
}

footer div span {
    color: white;
}

</style>
