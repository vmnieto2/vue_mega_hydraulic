<template>
    <LayoutView>
      <h1>Ver Reportes</h1>

      <!-- Acordeón de filtros -->
      <div class="accordion" id="filterAccordion">
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingFilters">
            <button 
              class="accordion-button collapsed" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#collapseFilters" 
              aria-expanded="false" 
              aria-controls="collapseFilters"
              @click="get_clients"
            >
              Filtros
            </button>
          </h2>
          <div 
            id="collapseFilters" 
            class="accordion-collapse collapse" 
            aria-labelledby="headingFilters" 
            data-bs-parent="#filterAccordion"
          >
            <div class="accordion-body">
              <div class="filter-container">
                <div class="form-group">
                  <label for="filterOM">OM</label>
                  <input v-model="filters.om" type="text" id="filterOM" class="form-control">
                </div>
                <div class="form-group">
                  <label for="filterSolped">Solped</label>
                  <input v-model="filters.solped" type="text" id="filterSolped" class="form-control">
                </div>
                <div class="form-group">
                  <label for="filterBuyOrder">Orde de Compra</label>
                  <input v-model="filters.buy_order" type="text" id="filterBuyOrder" class="form-control">
                </div>
                <div class="form-group">
                  <label for="filterClient">Cliente:</label>
                  <select class="form-control" id="filterClient" v-model="filters.client_id">
                      <option v-for="client in client_list" :key="client.id" :value="client.id">{{ client.name }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="filterStartDate">Fecha inicio</label>
                  <input v-model="filters.start_date" type="date" id="filterStartDate" class="form-control">
                </div>
                <div class="form-group">
                  <label for="filterEndDate">Fecha fin</label>
                  <input v-model="filters.end_date" type="date" id="filterEndDate" class="form-control">
                </div>
                <button class="btn-acordeon btn-color-apply" @click="applyFilters">Aplicar Filtros</button>
                <button class="btn-acordeon btn-color-clean" @click="limpiarFiltros">Limpiar Filtros</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container-list" v-if="report_list">
        <table class="table table-striped table-hover" v-if="report_list">
          <thead>
              <tr>
                  <th>Consecutivo</th>
                  <th>Fecha Actividad</th>
                  <th>Cliente</th>
                  <th>Línea</th>
                  <th>Recibe</th>
                  <th>OM</th>
                  <th>Solped</th>
                  <th>Orden de Compra</th>
                  <th>Posición</th>
                  <th>Nombre de equipo</th>
                  <th>Usuario</th>
                  <th>Actions</th>
              </tr>
          </thead>
          <tbody>
              <tr v-for="report in report_list" :key="report.id">
              <td>{{ report.id }}</td>
              <td>{{ report.activity_date }}</td>
              <td>{{ report.client_name }}</td>
              <td>{{ report.client_line }}</td>
              <td>{{ report.person_receive_name }}</td>
              <td>{{ report.om }}</td>
              <td>{{ report.solped }}</td>
              <td>{{ report.buy_order }}</td>
              <td>{{ report.position }}</td>
              <td>{{ report.equipment_name }}</td>
              <td>{{ report.user_name }}</td>
              <td class="th-icons">
                <router-link :to="`/report/edit/${report.id}`" ><img :src="ojo" alt="eye icon"></router-link>
                <a href="#"><img :src="pdf" alt="pdf icon" @click="generar_pdf(report.id)"></a>
                <td v-if="user_type_id == 1">
                  <img class="icon_deactivate" :src="desactivar" alt="desactivar icon" @click="modalConfirm(report.id)">
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
                  {{ pregunta }} {{ report_id }}?
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-success" @click="cambiarEstado">Yes</button>
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
                  <div class="modal-footer" v-else-if="token_status===403">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="redirigir_dashboard">Cerrar</button>
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
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
import axios from 'axios';
import LayoutView from '../views/Layouts/LayoutView.vue';
import ojo from "@/assets/icons/ojo.png";
import pdf from "@/assets/icons/pdf.png";
import desactivar from "@/assets/icons/desactivar.png";
import { Modal } from 'bootstrap';

const filters = ref({
  om: '',
  solped: '',
  buy_order: '',
  client_id: '',
  start_date: '',
  end_date: ''
});

const modalInstanceExito  = ref(null);
const modalErrorInstance = ref(null);
const modalInstancePregunta = ref(null);
const user_id = parseInt(localStorage.getItem('user_id'));
const user_type_id = localStorage.getItem('user_type_id');
const token = localStorage.getItem('token');
const msg = ref('');

const report_id = ref(0);
const report_list = ref([]);
const client_list = ref([]);
const total_paginas = ref(0);
const total_registros = ref(0);

const limit = ref(10);
const position = ref(1);
const state = ref(true);

const errorMsg = ref('');
const token_status = ref(0);
const pregunta = ref('');

const router = useRouter();


const get_reports = async () => {
  try {
        state.value = user_type_id == 1 ? true : false;
        const response = await axios.post(
            `${apiUrl}/reports/list_report`, 
            {
                limit: parseInt(limit.value),
                position: position.value,
                state: state.value,
                filters: filters.value,
                user_id: user_id
            },
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.status === 200) {
            report_list.value = response.data.data.reportes;
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
        }else if (error.response.status === 403) {
          token_status.value = error.response.status
          errorMsg.value = error.response.data.detail;
        }
    }
}
const changePage = async (newPosition) => {
  position.value = newPosition;
  await get_reports(); // Vuelve a cargar los datos con el nuevo límite y posición
};
const generar_pdf = async (report_id) => {
    try {
        if (!token) {
            router.push('/'); // Redirigir al login si no hay token
        }
        const response = await axios.post(
            `${apiUrl}/reports/generate_report`,
            {
                report_id: report_id,
                flag: true,
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
            link.setAttribute("download", `reporte_${report_id}.pdf`);  // Definir el nombre del archivo
            document.body.appendChild(link);
            link.click();  // Ejecutar el click para descargar el archivo
            document.body.removeChild(link);  // Limpiar el DOM
        }
    } catch (error) {
        console.error('Error al generar pdf:', error);
        modalErrorInstance.value.show();
        errorMsg.value = error.response.data.message;
        if (error.response.status === 401) {
          token_status.value = error.response.status
          errorMsg.value = "El token ha expirado.";
        } else if (error.response.status === 403) {
          token_status.value = error.response.status
          errorMsg.value = error.response.data.detail;
        }
    }
};
const applyFilters = async () => {
  if (position.value === 0){
    position.value = 1;
  }
  await get_reports();
};
const limpiarFiltros = async () => {
  filters.value.om = "";
  filters.value.solped = "";
  filters.value.buy_order = "";
  filters.value.client_id = "";
  filters.value.start_date = "";
  filters.value.end_date = "";
  position.value = 1;
  await get_reports();
};
const get_clients = async () => {
  try {
    const responseList = await axios.post(
        `${apiUrl}/params/get_clients`, {},
        {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (responseList.status === 200) {
        msg.value = responseList.data.message;
        client_list.value = responseList.data.data;
    }

  } catch (error) {
      console.error('Error al generar pdf:', error);
      modalErrorInstance.value.show();
      errorMsg.value = error.response.data.message;
      if (error.response.status === 401) {
        token_status.value = error.response.status
        errorMsg.value = error.response.data.detail;
      } else if (error.response.status === 403) {
        token_status.value = error.response.status
        errorMsg.value = error.response.data.detail;
      }
  }
};
// Función para manejar el cierre de sesión
function logout() {
  localStorage.clear();
  router.push('/'); // Redirigir al login
};
function redirigir_dashboard() {
  router.push('/dashboard'); // Redirigir al dashboard
}
const modalConfirm = async (id_reporte) => {
  pregunta.value = "¿Seguro desea eliminar el reporte: "
  modalInstancePregunta.value.show();
  report_id.value = id_reporte;
};
const cambiarEstado = async () => {
  try {
      const response = await axios.post(
          `${apiUrl}/reports/change_status_report`, 
          {
            report_id: report_id.value
          },
          {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
          }
      );
      modalInstancePregunta.value.hide();
      if (response.status === 200) {
          msg.value = response.data.message;
          modalInstanceExito.value.show();
          await get_reports();
      }
  } catch (error) {
      console.error('Error al cargar los datos:', error);
      modalErrorInstance.value.show();
      errorMsg.value = error.response.data.message;
      if (error.response.status === 401) {
        token_status.value = error.response.status
        errorMsg.value = error.response.data.detail;
      } else if (error.response.status === 403) {
        token_status.value = error.response.status
        errorMsg.value = error.response.data.detail;
      }
  }
}

// Código que se ejecuta al montar el componente
onMounted(() => {
    modalInstanceExito.value = new Modal(exitoModal);
    modalErrorInstance.value = new Modal(errorModal);
    modalInstancePregunta.value = new Modal(preguntaModal);
    if (!token) {
        router.push('/'); // Redirigir al login si no hay token
    }
    // Cargar los datos para los select inputs cuando se monta el componente
    get_reports();
});
</script>

<style scoped>

body,
html {
  height: 100%;
  font-size: 62.5%;
  font-family: "DM Sans", serif;
}

.accordion {
  margin-top: 20px;
}

.filter-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  padding: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 5px;
}

.btn-acordeon {
  color: white;
  border: none;
  padding: 10px 15px;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-color-apply {
  background-color: green;
}

.btn-color-clean {
  background-color: gray;
}

.container-list {
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
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

.icon_deactivate{
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
</style>
