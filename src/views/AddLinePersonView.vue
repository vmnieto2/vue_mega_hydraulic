<template>
    <LayoutView>
      <form @submit.prevent="agregarLineaPersona">
            <h2>Agregar Línes y Personas a Cliente</h2>

            <div class="form-group">
                <label for="select_cliente">Cliente:</label>
                <select id="select_cliente" v-model="cliente" @change="onClienteChange" required>
                    <option v-for="client in client_list" :key="client.id" :value="client.id">{{ client.name }}</option>
                </select>
            </div>

            <div class="form-group">
                <label for="lineas">Líneas:</label>
                <input type="text" id="lineas" v-model="nuevaLinea">
                <button type="button" @click="agregarParam(lineas, nuevaLinea)">Agregar</button>
            </div>

            <ul>
                <li v-for="(linea, index) in lineas" :key="index">
                    {{ linea }}
                    <button type="button" @click="eliminarParam(lineas, linea, index)">Eliminar</button>
                </li>
            </ul>

            <div class="form-group">
                <label for="persona">Personas:</label>
                <input type="text" id="persona" v-model="nuevaPersona">
                <button type="button" @click="agregarParam(personas, nuevaPersona)">Agregar</button>
            </div>

            <ul>
                <li v-for="(persona, index) in personas" :key="index">
                    {{ persona }}
                    <button type="button" @click="eliminarParam(personas, persona, index)">Eliminar</button>
                </li>
            </ul>


            <button type="submit">Crear</button>
            <div v-if="error" class="alert alert-danger mt-3" >
                {{ error }}
            </div>
      </form>

      <!-- Modal de éxito -->
        <div class="modal fade" id="exitoModal" tabindex="-1" aria-labelledby="exitoModalLabel" aria-hidden="true" data-bs-backdrop="static" ref="exitoModal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exitoModalLabel">Modal Cliente</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="redirect"></button>
                    </div>
                    <div class="modal-body">
                        {{ msg }}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="redirect">Cerrar</button>
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
  </LayoutView>
</template>

<script setup>
import apiUrl from "../../config.js";
import { useRouter } from "vue-router";
import { ref, onMounted } from 'vue';
import LayoutView from '../views/Layouts/LayoutView.vue';
import axios from 'axios';
import { Modal } from 'bootstrap';

const router = useRouter();

const cliente = ref(0);
const lineas = ref([]);
const nuevaLinea = ref('');
const personas = ref([]);
const client_list = ref([]);
const nuevaPersona = ref('');

const token = localStorage.getItem('token');
const modalInstance = ref(null);
const modalErrorInstance = ref(null);
const msg = ref('');
const error = ref('');
const errorMsg = ref('');
const token_status = ref(0);


const agregarLineaPersona = async () => {
    try {
        if (!token) {
            router.push('/'); // Redirigir al login si no hay token
        }

        const response = await axios.post(
            `${apiUrl}/client/add_line_person`,
            {
                client_id: cliente.value,
                lines_list: lineas.value,
                person_list: personas.value,
            },
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
        );
        if (response.status === 201) {
            msg.value = response.data.message
            modalInstance.value.show();
        }else if (response.status === 200) {
            msg.value = response.data.message
        }
    } catch (error) {
        modalErrorInstance.value.show()
        errorMsg.value = error.response.data.message;
        if (error.response.status === 401) {
          token_status.value = error.response.status
          errorMsg.value = error.response.data.detail;
        }
    }
};
const cargarDatos = async () => {
    try {
        const response = await axios.post(
            `${apiUrl}/params/get_clients`, {},
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.status === 200) {
            msg.value = response.data.message;
            client_list.value = response.data.data;
        }

    } catch (error) {
        console.error('Error al cargar los datos:', error);
        modalErrorInstance.value.show()
        errorMsg.value = error.response.data.message;
        if (error.response.status === 401) {
          token_status.value = error.response.status
          errorMsg.value = error.response.data.detail;
        }
    }
};
const agregarParam = (nuevaLista, param) => {
    if (param !== '') {
        nuevaLista.push(param);
        nuevaLinea.value = '';
        nuevaPersona.value = '';
    }
};
const eliminarParam = (nuevaLista, index) => {
    nuevaLista.splice(index, 1);
};
const redirect = () => {
    router.push('/clients');
};
// Función para manejar el cierre de sesión
function logout() {
  localStorage.clear();
  router.push('/'); // Redirigir al login
};

// Código que se ejecuta al montar el componente
onMounted(() => {
    modalInstance.value = new Modal(exitoModal);
    modalErrorInstance.value = new Modal(errorModal);
    if (!token) {
        router.push('/'); // Redirigir al login si no hay token
    }
    cargarDatos();
});

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
    margin-bottom: 10px;
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

li {
    margin-bottom: 10px;
}

hr {
    margin-top: 10px;
    margin-bottom: 20px;
}

</style>