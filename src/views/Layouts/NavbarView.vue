<template>
    <header>
      <div class="profile-container">
        <img :src="foto" alt="foto perfil">
        <h1>Bienvenido, {{ primer_nombre }} {{ primer_apellido }}</h1>
      </div>
    </header>

    <nav>
      <router-link :to="`/dashboard`">Menú Principal</router-link>
      <router-link :to="{ name: 'profile/edit/', params: { id: usuario } }">Editar Perfil</router-link>
      <router-link :to="{ name: 'profile/change_password/', params: { id: usuario } }">Cambiar Contraseña</router-link>
      <a href="#" @click="logout">Salir</a>
    </nav>

    
</template>

<script setup>
import apiUrl from "../../../config.js";
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// Variables reactivas para los datos
const primer_nombre = ref('');
const primer_apellido = ref('');
const foto = ref('');
const usuario = localStorage.getItem('user_id').toString();

// Acceder al enrutador
const router = useRouter();

// Función para manejar el cierre de sesión
function logout() {
  localStorage.clear();
  router.push('/'); // Redirigir al login
}

// Código que se ejecuta al montar el componente
onMounted(() => {
  const token = localStorage.getItem('token');
  const first_name = localStorage.getItem('first_name');
  const last_name = localStorage.getItem('last_name');
  const photo = localStorage.getItem('photo');

  if (!token) {
    router.push('/'); // Redirigir al login si no hay token
  }

  // Asignar valores desde localStorage
  primer_nombre.value = first_name || '';
  primer_apellido.value = last_name || '';
  foto.value = `${apiUrl}/${photo}`;
});
</script>

<style scoped>
*{
  box-sizing: border-box;
}
body {
  margin: 0;
  padding: 0;
}
header {
  padding: 25px;
  background-color: #2a475f;
}
.profile-container {
  display: flex;
  align-items: center;
}
header img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

header h1 {
  color: white;
  margin-left: 25%;
  text-align: center;
}

nav {
  display: flex;
  flex-direction: row;
  background-color: #333;
}

nav a{
  color: white;
  padding: 14px 20px;
  text-decoration: none;
}
nav a:hover{
  background-color: gray;
}

</style>
