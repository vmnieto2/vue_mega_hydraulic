<template>
    <LayoutView>
      <form @submit.prevent="">
            <h2>Editar Perfil</h2>
            <div class="form-group">
                <label for="select_cliente">Tipo Documento:</label>
                <select id="select_cliente" v-model="cliente" required>
                    <option v-for="client in client_list" :key="client.id" :value="client.id">{{ client.name }}</option>
                </select>
            </div>

            <div class="form-group">
                <label for="txt_om">Documento:</label>
                <input type="text" id="txt_om" v-model="om">
            </div>
            <div class="form-group">
                <label for="txt_om">Primer Nombre:</label>
                <input type="text" id="txt_om" v-model="om">
            </div>
            <div class="form-group">
                <label for="txt_om">Segundo Nombre:</label>
                <input type="text" id="txt_om" v-model="om">
            </div>
            <div class="form-group">
                <label for="txt_om">Primer Apellido:</label>
                <input type="text" id="txt_om" v-model="om">
            </div>
            <div class="form-group">
                <label for="txt_om">Segundo Apellido:</label>
                <input type="text" id="txt_om" v-model="om">
            </div>
            <div class="form-group">
                <label for="txt_om">Correo Eléctronico:</label>
                <input type="email" id="txt_om" v-model="om">
            </div>
      </form>
  </LayoutView>
</template>

<script setup>
import { useRouter } from "vue-router";
import LayoutView from '../views/Layouts/LayoutView.vue';

</script>

<style scoped>

body,
html {
  height: 100%;
  font-size: 62.5%;
  font-family: "DM Sans", serif;
}

form {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-sizing: border-box;
    margin-bottom: 20px;
}

form h2 {
    margin-bottom: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
}

label {
    margin-bottom: 1px;
}

input, textarea, select {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

button {
    background-color: #2a475f;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.input {
    background-color: #F7F7F7;
    border: none;
    border-radius: 8px;
    height: 30px;
    font-size: 16px;
    padding: 6px;
    margin-bottom: 12px;
}

.checkbox-container {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap; /* Permite que los elementos se ajusten en varias filas si es necesario */
    gap: 5px; /* Espacio entre los checkboxes */
    width: 85%; /* Asegura que el contenedor ocupe todo el ancho */
    justify-content: space-between; /* Distribuye los elementos */
    margin-left: 25px;
}

.form-check {
    display: flex;
    align-items: center;
    width: calc(50% - 10px); /* Ajusta el ancho de cada checkbox (50% menos el espacio del gap) */
    box-sizing: border-box;
}

@media (max-width: 768px) {
    .form-check {
        width: 100%; /* En pantallas pequeñas, cada checkbox ocupará todo el ancho disponible */
    }
}

.form-check-input {
    margin-right: 8px; /* Espacio entre el checkbox y el texto */
}

.form-check-label {
    flex: 1;
    overflow: hidden; /* Evita que el texto se desborde */
    text-overflow: ellipsis;
    white-space: nowrap;
}

hr {
    margin-top: 10px;
    margin-bottom: 20px;
}

</style>