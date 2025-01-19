<template>
    <LayoutView>
      <div class="card-container">
        <div class="card" v-for="(modulo, index) in modulos" :key="index">
          <div class="card-header">
            <img :src="`/${modulo.icon}`" :alt=modulo.icon>
            <h5 class="card-title">{{modulo.name}}</h5>
          </div>
          <div class="card-body">
            <p class="card-text">{{ modulo.description }}</p>
          </div>
          <div class="card-footer">
            <button class="primary-button login-button" @click="go_action(modulo.action)">Ir</button>
          </div>
        </div>
      </div>
  </LayoutView>
</template>

<script setup>
import { useRouter } from "vue-router";
import LayoutView from '../views/Layouts/LayoutView.vue';

// const user_id = localStorage.getItem('user_id');
const token = localStorage.getItem('token');
const modulos = JSON.parse(localStorage.getItem('permissions'));

// Accede al enrutador
const router = useRouter();

const go_action = async (action) => {
  router.push(`${action}`);
}

</script>

<style scoped>

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body,
html {
  height: 100%;
  font-size: 62.5%;
  font-family: "DM Sans", serif;
}

.card-container {
  width: 100%;
  display: flex;
}

.card {
  flex: 100%;
  max-width: 200px;
  margin: 10px;
  border: 3px solid black;
  display: flex;
  flex-direction: column;
}

.card .card-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 4px;
}

.card .card-header img {
  width: 5.0rem
}

.card .card-header h5 {
  font-size: 1.2rem;
}

.card .card-body {
  padding-left: 5px;
  flex-grow: 1;
  flex-shrink: 1;
}

.card .card-footer {
  background-color: rgba(240, 240, 240, 0.932);
  padding: 10px;
  display: flex;
  justify-content: center;
}

.primary-button {
    background-color: #2a475f;
    border-radius: 8px;
    border: none;
    color: white;
    width: 80%;
    cursor: pointer;
    font-size: 1.0rem;
    font-weight: bold;
    height: 30px;
}
</style>
