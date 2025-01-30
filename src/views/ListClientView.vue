<template>
    <LayoutView>
      <h1>Listado de Clientes</h1>
      <router-link :to="{name: 'client/addLinePerson/'}" class="button">Agregar Líneas o Persona</router-link>
      <div class="container-list" v-if="clientes_list">
        <table class="table table-striped table-hover" v-if="clientes_list">
          <thead>
              <tr>
                  <th>Id</th>
                  <th>Nombre</th>
                  <th>Estado</th>
                  <th>Acciones</th>
              </tr>
          </thead>
          <tbody>
              <tr v-for="cliente in clientes_list" :key="cliente.id">
                <td>{{ cliente.id }}</td>
                <td>{{ cliente.name }}</td>
                <td v-if="cliente.status == 1">ACTIVADO</td>
                <td v-else>DESACTIVADO</td>
                <td class="th-icons">
                  <router-link :to="{ name: 'client/edit/', params: { id: cliente.id } }"><img :src="gestion" alt="gestion icon"></router-link>
                  <td v-if="cliente.status == 1">
                    <img :src="desactivar" alt="desactivar icon" @click="modalConfirm(cliente)">
                  </td>
                  <td class="td-desactivado" v-else>
                    <img :src="activar" alt="activar icon" @click="modalConfirm(cliente)">
                  </td>
                </td>
              </tr>
          </tbody>
        </table>
        <div class="pagination">
          <label for="records-per-page">Registros por página:</label>
          <select 
            id="records-per-page" 
            v-model="limit" 
            @change="changePage(1)"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          <button 
            :disabled="position <= 1" 
            @click="changePage(1)"
          >
            Primera
          </button>
          
          <button 
            :disabled="position <= 1" 
            @click="changePage(position - 1)"
          >
            Anterior
          </button>
          
          <span>Página {{ position }} de {{ total_paginas }}</span>
          
          <button 
            :disabled="position >= total_paginas" 
            @click="changePage(position + 1)"
          >
            Siguiente
          </button>
          
          <button 
            :disabled="position >= total_paginas" 
            @click="changePage(total_paginas)"
          >
            Última
          </button>
        </div>
      </div>

      <!-- Modal de éxito -->
      <div class="modal fade" id="exitoModal" tabindex="-1" aria-labelledby="exitoModalLabel" aria-hidden="true" data-bs-backdrop="static" ref="exitoModal">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title" id="exitoModalLabel">Módulo Usuario</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                  {{ msg }}
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-success" data-bs-dismiss="modal">Cerrar</button>
              </div>
              </div>
          </div>
      </div>

      <!-- Modal de pregunta -->
      <div class="modal fade" id="preguntaModal" tabindex="-1" aria-labelledby="preguntaModalLabel" aria-hidden="true" data-bs-backdrop="static" ref="preguntaModal">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title" id="preguntaModalLabel">Question</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                  {{ pregunta }} {{ cliente_id }}?
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-success" @click="gestionCliente({client_id: cliente_id, status: estado == 1 ? 0 : 1})">Yes</button>
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              </div>
              </div>
          </div>
      </div>

      <!-- Modal de error -->
      <div class="modal fade" id="errorModal" tabindex="-1" aria-labelledby="errorModalLabel" aria-hidden="true" data-bs-backdrop="static" ref="errorModal">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title" id="errorModalLabel">Modal Usuario</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      {{ errorMsg }}
                  </div>
                  <div class="modal-footer" v-if="token_status===401">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="logout">Cerrar</button>
                  </div>
                  <div class="modal-footer" v-else>
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                  </div>
              </div>
          </div>
      </div>

      <!-- Modal de edición -->
      <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true" data-bs-backdrop="static" ref="editModal">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editModalLabel">Gestión Usuario</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form>
                      <div class="form-group">
                          <label for="nombre_cliente">Nombre Cliente:</label>
                          <input type="text" id="nombre_cliente" v-model="cliente_name">
                      </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" data-bs-dismiss="modal" @click="gestionCliente({client_id: cliente_id, client_name: cliente_name})">Actualizar</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                </div>
              </div>
          </div>
      </div>
  </LayoutView>
</template>

<script setup>
import apiUrl from "../../config.js";
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
import axios from 'axios';
import { Modal } from 'bootstrap';
import LayoutView from '../views/Layouts/LayoutView.vue';
import gestion from "@/assets/icons/gestion.png";
import desactivar from "@/assets/icons/desactivar.png";
import activar from "@/assets/icons/activar.png";

const token = localStorage.getItem('token');
const msg = ref('');

const clientes_list = ref([]);
const cliente_name = ref('');
const cliente_id = ref('');
const total_paginas = ref(0);
const total_registros = ref(0);
const estado = ref(0);

const limit = ref(10);
const position = ref(1);

const errorMsg = ref('');
const msgList = ref('');
const pregunta = ref('');

const modalInstanceExito  = ref(null);
const modalInstancePregunta = ref(null);
const modalErrorInstance  = ref(null);
const modalInstanceEditar   = ref(null);
const token_status = ref(0);

const router = useRouter();

const get_clients = async () => {
  try {
    const response = await axios.post(
        `${apiUrl}/client/list_client`, 
        {
            limit: parseInt(limit.value),
            position: position.value
        },
        {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (response.status === 200) {
        msgList.value = response.data.message;
        clientes_list.value = response.data.data.clientes;
        total_paginas.value = response.data.data.total_pag;
        total_registros.value = response.data.data.total_registros;
        position.value = response.data.data.posicion_pag;
    }

  } catch (error) {
      console.error('Error al cargar los datos:', error);
      modalErrorInstance.value.show();
      errorMsg.value = error.response.data.message;
      if (error.response.status === 401) {
        token_status.value = error.response.status
        errorMsg.value = error.response.data.detail;
      }
  }
}
const changePage = async (newPosition) => {
  position.value = newPosition;
  await get_clients(); // Vuelve a cargar los datos con el nuevo límite y posición
};
const modalConfirm = async (data_cliente) => {
  if (data_cliente.status == 1){
    pregunta.value = "¿Seguro desea desactivar el cliente: "
  }else{
    pregunta.value = "¿Seguro desea activar el cliente: "
  }
  modalInstancePregunta.value.show();
  cliente_id.value = data_cliente.id;
  estado.value = data_cliente.status;
};
const gestionCliente = async (data_update) => {
  try {
    const response = await axios.post(
        `${apiUrl}/client/update_client`, 
        data_update,
        {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );
    modalInstanceEditar.value.hide();
    modalInstancePregunta.value.hide();
    if (response.status === 200) {
        msg.value = response.data.message;
        modalInstanceExito.value.show();
        await get_clients();
    }

  } catch (error) {
      console.error('Error al cargar los datos:', error);
      modalErrorInstance.value.show();
      errorMsg.value = error.response.data.message;
      if (error.response.status === 401) {
        token_status.value = error.response.status
        errorMsg.value = error.response.data.detail;
      }
  }
};
const modalEdit = async (param) => {
  cliente_name.value = param.name
  cliente_id.value = param.id
  modalInstanceEditar.value.show();
};
// Función para manejar el cierre de sesión
function logout() {
  localStorage.clear();
  router.push('/'); // Redirigir al login
}

// Código que se ejecuta al montar el componente
onMounted(() => {
    modalInstanceExito.value = new Modal(exitoModal);
    modalInstancePregunta.value = new Modal(preguntaModal);
    modalErrorInstance.value = new Modal(errorModal);
    modalInstanceEditar.value = new Modal(editModal);
    if (!token) {
        router.push('/'); // Redirigir al login si no hay token
    }
    // Cargar los datos para los select inputs cuando se monta el componente
    get_clients();
});
</script>

<style scoped>

body,
html {
  height: 100%;
  font-size: 62.5%;
  font-family: "DM Sans", serif;
}

.container-list {
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  margin-bottom: 20px;
}

.container-list table img {
  width: 25px;
}

.th-icons {
  display: flex;
  justify-content: space-around;
  align-items: center;
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

.button {
  text-decoration: none;
  background-color: #2a475f;
  color: white;
  border: none;
  padding: 10px 15px;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer; 
}


.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination label {
  margin-right: 10px;
  font-size: 1.2rem;
}

.pagination select {
  margin-right: 20px;
  padding: 5px;
  font-size: 1.2rem;
}

.pagination button {
  background-color: #2a475f;
  color: white;
  border: none;
  padding: 10px 15px;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  margin: 0 10px;
  font-size: 1.4rem;
}

img {
  cursor: pointer;
}
</style>
