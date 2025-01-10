<template>
  <div class="main-container">
    <div class="form-container">
      <div class="form-header">
        <img :src="logo" alt="logo" class="logo" />
        <h1 class="title">Mega login</h1>
      </div>
      <form @submit.prevent="login" class="form">
        <label class="label" for="document">Documento</label>
        <input
          type="number"
          class="input input-password"
          v-model="document"
          id="document"
          placeholder="11111111"
          required
        />

        <label class="label" for="password">Password</label>
        <input
          type="password"
          v-model="password"
          class="input input-password"
          id="password"
          placeholder="Password"
          required
        />

        <button class="primary-button login-button" type="submit">
          Log In
        </button>
        <div v-if="error" class="alert alert-danger mt-3">
          {{ error }}
        </div>
        <p class="mt-5 mb-3 text-body-secondary">&copy; 2023–{{ fecha }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import logo from "@/assets/icons/logo.jpg";

// Variables reactivas
const document = ref("");
const password = ref("");
const error = ref("");
const fecha = new Date().getFullYear();
const apiUrl = "http://192.168.1.61:8000";
const apiProdUrl = "";
const permissions = [];
const router = useRouter();

// Función de inicio de sesión
const login = async () => {
  try {
    const response = await axios.post(
      // `${apiProdUrl}/login`,
      `${apiUrl}/login`,
      {
        document: document.value.toString(),
        password: password.value,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (response.status === 200) {
      const token = response.data.data.token;
      const first_name = response.data.data.first_name;
      const last_name = response.data.data.last_name;
      const user_type_id = response.data.data.user_type_id;
      const user_id = response.data.data.id;
      const permissions = JSON.stringify(response.data.data.permission);
      const photo = response.data.data.photo;

      localStorage.setItem("token", token);
      localStorage.setItem("first_name", first_name);
      localStorage.setItem("last_name", last_name);
      localStorage.setItem("user_type_id", user_type_id);
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("permissions", permissions);
      localStorage.setItem("photo", photo);

      router.push("/dashboard");
    }
  } catch (err) {
    error.value = err.response?.data?.message || "Error al iniciar sesión";
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 62.5%;
  font-family: "DM Sans", serif;
}

body,
html {
  height: 100%;
}

.main-container {
  width: 100%;
  height: 100vh; /* Altura completa de la pantalla */
  display: flex;
  justify-content: center;
  align-items: center; /* Centra verticalmente */
  padding: 16px; /* Espaciado para pantallas pequeñas */
  background-color: #f0f4f8; /* Color de fondo suave */
}

.form-header {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.form-container {
  width: 100%;
  max-width: 400px; /* Ancho máximo para pantallas grandes */
  padding: 24px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Sombra ligera */
}

.logo {
  width: 200px; /* Ajustar tamaño de logo */
  margin-bottom: 24px;
  justify-self: center;
}

.title {
  font-size: 2rem;
  margin-bottom: 16px;
  text-align: center;
}

.form {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 1.0rem;
  font-weight: bold;
  margin-bottom: 4px;
}

.input {
  background-color: #f7f7f7;
  border: 1px solid #d1d5db; /* Borde suave */
  border-radius: 8px;
  height: 40px;
  font-size: 1.0rem;
  padding: 8px;
  margin-bottom: 16px;
}

.primary-button {
  background-color: #2a475f;
  border-radius: 8px;
  border: none;
  color: white;
  width: 100%;
  cursor: pointer;
  font-size: 1.0rem;
  font-weight: bold;
  height: 48px;
  transition: background-color 0.3s ease;
}

.primary-button:hover {
  background-color: #1c3342;
}

.login-button {
  margin-top: 16px;
}

.alert {
  font-size: 1.0rem;
  color: red;
}

@media (max-width: 768px) {
  .form-container {
    padding: 16px;
  }

  .title {
    font-size: 1.8rem;
  }

  .input {
    font-size: 1.4rem;
  }

  .primary-button {
    font-size: 1.4rem;
    height: 44px;
  }
}
</style>