<template>
    <LayoutView>
        <form @submit.prevent="editReport">
            <h2>Formulario de Edición de Reporte</h2>
            <div class="form-group">
                <label for="txt_fecha_actividad">Fecha Actividad:</label>
                <input type="date" id="txt_fecha_actividad" v-model="fecha_actividad">
            </div>
            <div class="form-group">
                <label for="select_cliente">Cliente:</label>
                <select id="select_cliente" v-model="cliente_seleccionado" @change="onClienteChange" required>
                    <option v-for="client in client_list" :key="client.id" :value="client.id">{{ client.name }}</option>
                </select>
            </div>
            <div class="form-group">
                <label for="select_linea">Línea:</label>
                <select id="select_linea" v-model="linea_seleccionada" required>
                    <option v-for="line in line_list" :key="line.id" :value="line.id">{{ line.name }}</option>
                </select>
            </div>
            <div class="form-group">
                <label for="select_persona">Persona que recibe:</label>
                <select id="select_persona" v-model="persona_seleccionada" required>
                    <option v-for="person in person_list" :key="person.id" :value="person.id">{{ person.name }}</option>
                </select>
            </div>
            <div class="form-group">
                <label for="txt_om">OM:</label>
                <input type="text" id="txt_om" v-model="om">
            </div>

            <div class="form-group">
                <label for="txt_solped">Solped:</label>
                <input type="text" id="txt_solped" v-model="solped">
            </div>

            <div class="form-group">
                <label for="txt_orden">Orden de compra:</label>
                <input type="text" id="txt_orden" v-model="orden_compra">
            </div>

            <div class="form-group">
                <label for="txt_posicion">Posición:</label>
                <input type="text" id="txt_posicion" v-model="posicion">
            </div>

            <hr>

            <div class="form-group">
                <label>Tipo de servicios:</label>
            </div>
            <div class="form-group checkbox-container">
                <div v-for="option in servicios_list" :key="option.id" class="form-check">
                    <input 
                        type="checkbox" 
                        class="form-check-input" 
                        :id="'service-' + option.id" 
                        :value="option.id" 
                        v-model="servicios_seleccionados" 
                    />
                    <label :for="'service-' + option.id" class="form-check-label">
                        {{ option.name }}
                    </label>
                </div>
            </div>

            <hr>

            <div class="form-group">
                <label for="txt_nombre_equipo">Nombre de equipo intervenido:</label>
                <input type="text" id="txt_nombre_equipo" v-model="nombre_equipo">
            </div>

            <div class="form-group">
                <label for="txt_descripcion_servicio">Descripción del servicio:</label>
                <textarea id="txt_descripcion_servicio" v-model="descripcion_servicio"></textarea>
            </div>

            <div class="form-group">
                <label for="txt_informacion">Información:</label>
                <textarea id="txt_informacion" v-model="informacion"></textarea>
            </div>

            <div class="form-group">
                <label for="select_tipo_equipo">Tipo Equipo Intervenido:</label>
                <select id="select_tipo_equipo" v-model="tipo_equipo" @change="onChangeTasks" required>
                    <option v-for="equip in equipos_list" :key="equip.id" :value="equip.id">{{ equip.name }}</option>
                </select>
            </div>

            <div class="form-group table-responsive">
                <table class="table table-striped" v-if="tasks_list.length" border="1" cellspacing="0" cellpadding="5">
                    <thead class="table-dark">
                        <tr>
                            <th>Tarea</th>
                            <th>SI</th>
                            <th>NO</th>
                            <th>Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="task in tasks_list" :key="task.id">
                            <td>{{ task.name }}</td>
                            <td>
                                <input
                                    type="radio"
                                    :id="'positive_' + task.id"
                                    v-model="task.positive"
                                    :value="1"
                                />
                            </td>
                            <td>
                                <input
                                    type="radio"
                                    :id="'negative_' + task.id"
                                    v-model="task.positive"
                                    :value="0"
                                />
                            </td>
                            <td>
                                <textarea v-model="task.description" rows="2" cols="25"></textarea>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <hr>

            <!-- Input dinámico para agregar imágenes -->
            <div class="form-group mt-3">
                <h4>Imágenes</h4>
                <div v-for="(image, index) in imagenes" :key="index" class="mb-2">
                    <div v-if="image.img">
                        <!-- Miniatura de la imagen -->
                        <img
                            :src="image.img.startsWith('data:') ? image.img : `${apiUrl}/${image.img}`"
                            alt="Vista previa"
                            class="img-thumbnail"
                            style="max-width: 150px; max-height: 100px; cursor: pointer;"
                            @click="enlargeImage(image.img.startsWith('data:') ? image.img : `${apiUrl}/${image.img}`)"
                        />
                    </div>
                    <input
                        type="file"
                        @change="handleImageChange($event, index)"
                        class="form-control"
                        accept="image/*"
                    />
                    <textarea
                        v-model="image.description"
                        placeholder="Descripción de la imagen"
                        class="form-control mt-2"
                    ></textarea>
                    <button type="button" class="btn btn-danger mt-2" @click="removeImageInput(index)">
                        Eliminar
                    </button>
                </div>
                <button type="button" class="btn btn-primary mt-3" @click="addImageInput">
                    Agregar imagen
                </button>
            </div>

            <hr>
            
            <button type="submit">Actualizar</button>
            <div v-if="error" class="alert alert-danger mt-3" >
                {{ error }}
            </div>
        </form>

        <!-- Modal de éxito -->
        <div class="modal fade" id="exitoModal" tabindex="-1" aria-labelledby="exitoModalLabel" aria-hidden="true" data-bs-backdrop="static" ref="exitoModal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exitoModalLabel">Modal Reporte</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        {{ msg }}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-success" data-bs-dismiss="modal" @click="generar_pdf()">Generar PDF</button>
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
import { useRouter } from 'vue-router';
import axios from 'axios';
import LayoutView from '../views/Layouts/LayoutView.vue';
import { Modal } from 'bootstrap';

// Variables reactivas para los datos
const client_list = ref([]);
const line_list = ref([]);
const person_list = ref([]);
const servicios_list = ref([]);
const servicios_seleccionados = ref([]);
const equipos_list = ref([]);
const tasks_list = ref([]);
const tasks = ref([]);
const imagenes = ref([]);
const data_report = ref({});
const fecha_actividad = ref('');
const fecha_actividad_formateada = ref('');
const cliente_seleccionado = ref(null);
const linea_seleccionada = ref(null);
const persona_seleccionada = ref(null);
const om = ref('');
const solped = ref('');
const orden_compra = ref('');
const posicion = ref('');
const tipo_equipo = ref('');
const nombre_equipo = ref('');
const descripcion_servicio = ref('');
const informacion = ref('');
const user_id = localStorage.getItem('user_id');
const token = localStorage.getItem('token');
const modalInstance = ref(null);
const report_id = ref('');
const msg = ref('');
const error = ref('');

// Acceder al enrutador
const router = useRouter();

const editReport = async () => {
    try {
        if (!token) {
            router.push('/'); // Redirigir al login si no hay token
        }

        const [year, month, day] = fecha_actividad.value.split("-");

        fecha_actividad_formateada.value = `${day}-${month}-${year}`

        tasks.value = tasks_list.value.map((task) => ({
            task_id: task.id,
            positive: task.positive,
            negative: task.positive === 1 ? 0 : 1,
            description: task.description,
        }));

        const response = await axios.post(
            `${apiUrl}/reports/edit_report`,
            {
                report_id: report_id.value,
                activity_date: fecha_actividad_formateada.value,
                client_id: cliente_seleccionado.value,
                client_line_id: linea_seleccionada.value,
                person_receives: persona_seleccionada.value,
                om: om.value,
                solped: solped.value,
                buy_order: orden_compra.value,
                position: posicion.value,
                information: informacion.value,                
                type_service: servicios_seleccionados.value,
                equipment_type_id: tipo_equipo.value,
                equipment_name: nombre_equipo.value,
                service_description: descripcion_servicio.value,
                task_list: tasks.value,
                files: imagenes.value,
                user_id: user_id,
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
            report_id.value = response.data.data
            modalInstance.value.show();                    
        }else if (response.status === 200) {
            error.value = response.data.message
        }
    } catch (error) {
        console.error('Error al editar reporte:', error);
        error.value = error.response.data.message;
    }
};
const generar_pdf = async () => {
    try {
        if (!token) {
            router.push('/'); // Redirigir al login si no hay token
        }
        const response = await axios.post(
            `${apiUrl}/reports/generate_report`,
            {
                report_id: report_id.value,
                flag: true
            },
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`
                },
                responseType: "blob",  // Indicar que esperamos un archivo binario
            }
        );
        if (response.status === 200) {
            // Crear una URL para el blob
            const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
            // Crear un enlace temporal para descargar el archivo
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `reporte_${report_id.value}.pdf`);  // Definir el nombre del archivo
            document.body.appendChild(link);
            link.click();  // Ejecutar el click para descargar el archivo
            document.body.removeChild(link);  // Limpiar el DOM
        }
    } catch (error) {
        console.error('Error al generar pdf:', error);
        error.value = error.response.data.message;
    }
};
const cargarDatos = async () => {
    try {
        const response_report = await axios.post(
            `${apiUrl}/reports/generate_report`,
            {
                report_id: report_id.value,
                flag: false
            },
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`
                },
            }
        );
        
        if (response_report.status === 200) {
            msg.value = response_report.data.message;
            data_report.value = response_report.data.data;
            fecha_actividad.value = data_report.value.activity_date;
            om.value = data_report.value.om;
            solped.value = data_report.value.solped;
            orden_compra.value = data_report.value.buy_order;
            posicion.value = data_report.value.position;
            cliente_seleccionado.value = data_report.value.client_id;
            linea_seleccionada.value = data_report.value.client_line_id;
            persona_seleccionada.value = data_report.value.person_receive_id;
            servicios_seleccionados.value = data_report.value.type_service.map((servicio)=>servicio.id);
            nombre_equipo.value = data_report.value.equipment_name;
            descripcion_servicio.value = data_report.value.service_description;
            informacion.value = data_report.value.information;
            tipo_equipo.value = data_report.value.equipment_type_id;
            tasks_list.value = data_report.value.tasks;
            imagenes.value = data_report.value.files.map(file => ({
                img: file.path,
                description: file.description,
            }));
        }

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

        const responseServices = await axios.post(
            `${apiUrl}/params/get_type_service`, {},
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
        );
        if (responseServices.status === 200) {
            msg.value = responseServices.data.message;
            servicios_list.value = responseServices.data.data;
        }

        const responseEquipments = await axios.post(
            `${apiUrl}/params/get_type_equipments`, {},
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
        );
        if (responseEquipments.status === 200) {
            msg.value = responseEquipments.data.message;
            equipos_list.value = responseEquipments.data.data;
        }

        onClienteChange();

    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }

};
const onClienteChange = async () => {
    try {
        // Carga de líneas asociadas al cliente seleccionado
        const responseLineas = await axios.post(
            `${apiUrl}/params/get_lines_by_client`, 
            { client: cliente_seleccionado.value },
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        line_list.value = responseLineas.data.data || [];

        // Carga de personas asociadas al cliente seleccionado
        const responsePersonas = await axios.post(
            `${apiUrl}/params/get_users_by_client`, 
            { client: cliente_seleccionado.value },
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        person_list.value = responsePersonas.data.data || [];

    } catch (error) {
        console.error('Error al cargar datos dinámicos:', error);
    }
};
const onChangeTasks = async () => {
    try {
        const response = await axios.post(
            `${apiUrl}/params/get_tasks_by_equipment`, 
            { equipment: tipo_equipo.value },
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        tasks_list.value = response.data.data.map(task => ({
            ...task, // Conservamos los campos originales
            positive: 1, // Por defecto, el radio "Sí" está seleccionado
            description: "", // Por defecto, la descripción es vacía
        }));

    } catch (error) {
        console.error('Error al cargar datos dinámicos:', error);
    }
};
const addImageInput = async () => {
    // Agregamos un elemento vacío a la lista de imágenes
    imagenes.value.push({ img: "", description: "" });
};
const removeImageInput = async (index) => {
    // Eliminamos una imagen de la lista
    imagenes.value.splice(index, 1);
};
const handleImageChange = async (event, index) => {
    const file = event.target.files[0]; // Obtenemos el archivo cargado
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            // Actualizamos directamente el valor en el índice correspondiente
            imagenes.value[index] = {
                img: reader.result, // Base64 de la imagen
                description: imagenes.value[index]?.description || "" // Mantener la descripción
            };
        };
        reader.readAsDataURL(file);
    }
};
const enlargeImage = async (path) => {
    window.open(path, "_blank");
};
// Código que se ejecuta al montar el componente
onMounted(() => {
    report_id.value = router.currentRoute.value.params.id;
    modalInstance.value = new Modal(exitoModal);
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

.img-thumbnail {
  border: 2px solid #ddd;
  border-radius: 4px;
  padding: 5px;
  margin-right: 10px;
}

hr {
    margin-top: 10px;
    margin-bottom: 20px;
}

</style>