<template>
    <LayoutView>
      <form @submit.prevent="crearUsuario">
            <h2>Crear Usuario</h2>

            <div class="form-group">
                <label for="select_tipo_documento">Tipo Documento:</label>
                <select id="select_tipo_documento" v-model="tipo_documento" required>
                    <option v-for="tipo_doc in tipo_documento_list" :key="tipo_doc.id" :value="tipo_doc.id">{{ tipo_doc.description }}</option>
                </select>
            </div>
            <div class="form-group">
                <label for="documento">Documento:</label>
                <input type="text" id="documento" v-model="documento">
            </div>
            <div class="form-group">
                <label for="primer_nombre">Primer Nombre:</label>
                <input type="text" id="primer_nombre" v-model="primer_nombre">
            </div>
            <div class="form-group">
                <label for="segundo_nombre">Segundo Nombre:</label>
                <input type="text" id="segundo_nombre" v-model="segundo_nombre">
            </div>
            <div class="form-group">
                <label for="primer_apellido">Primer Apellido:</label>
                <input type="text" id="primer_apellido" v-model="primer_apellido">
            </div>
            <div class="form-group">
                <label for="segundo_apellido">Segundo Apellido:</label>
                <input type="text" id="segundo_apellido" v-model="segundo_apellido">
            </div>
            <div class="form-group">
                <label for="correo">Correo Eléctronico:</label>
                <input type="email" id="correo" v-model="correo">
            </div>
            <div class="form-group">
                <label for="select_tipo_usuario">Tipo Usuario:</label>
                <select id="select_tipo_usuario" v-model="tipo_usuario" required>
                    <option v-for="tipo_us in tipo_usuario_list" :key="tipo_us.id" :value="tipo_us.id">{{ tipo_us.name }}</option>
                </select>
            </div>

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
                        <h5 class="modal-title" id="exitoModalLabel">Modal Usuario</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>{{ msg }}</p>
                        <p>Su nueva contraseña es: ({{ clave }})
                            recuerde cambiarla una vez ingrese.
                        </p>
                        
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
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
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
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
import LayoutView from '../views/Layouts/LayoutView.vue';
import axios from 'axios';
import { Modal } from 'bootstrap';


const tipo_documento = ref(0);
const tipo_documento_list = ref([]);
const tipo_usuario = ref(0);
const tipo_usuario_list = ref([]);
const documento = ref('');
const primer_nombre = ref('');
const segundo_nombre = ref('');
const primer_apellido = ref('');
const segundo_apellido = ref('');
const correo = ref('');
const clave = ref('');
const token = localStorage.getItem('token');
const modalInstance = ref(null);
const modalErrorInstance = ref(null);
const msg = ref('');
const error = ref('');
const errorMsg = ref('');


const crearUsuario = async () => {
    try {
        if (!token) {
            router.push('/'); // Redirigir al login si no hay token
        }

        const response = await axios.post(
            `${apiUrl}/user/create_user`,
            {
                type_document: tipo_documento.value,
                document: documento.value,
                first_name: primer_nombre.value,
                second_name: segundo_nombre.value,
                last_name: primer_apellido.value,
                second_last_name: segundo_apellido.value,
                email: correo.value,
                user_type_id: tipo_usuario.value
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
            clave.value = response.data.data
            modalInstance.value.show();                    
        }else if (response.status === 200) {
            msg.value = response.data.message
        }
    } catch (error) {
        modalErrorInstance.value.show()
        errorMsg.value = error.response.data.message;
    }
}
const cargarDatos = async () => {
    try {
        if (!token) {
            router.push('/'); // Redirigir al login si no hay token
        }
        const response = await axios.post(
            `${apiUrl}/params/get_type_document`, {},
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.status === 200) {
            msg.value = response.data.message;
            tipo_documento_list.value = response.data.data;
        }

        const responseTipoUsuario = await axios.post(
            `${apiUrl}/params/get_type_user`, {},
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (responseTipoUsuario.status === 200) {
            msg.value = responseTipoUsuario.data.message;
            tipo_usuario_list.value = responseTipoUsuario.data.data;
        }
    } catch (error) {
        console.error('Error al cargar los datos:', error);
        modalErrorInstance.value.show()
        errorMsg.value = error.response.data.message;
    }
};

// Código que se ejecuta al montar el componente
onMounted(() => {

    modalInstance.value = new Modal(exitoModal);
    modalErrorInstance.value = new Modal(errorModal);
    if (!token) {
        router.push('/'); // Redirigir al login si no hay token
    }
    // Cargar los datos para los select inputs cuando se monta el componente
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