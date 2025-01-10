<template>
    <LayoutView>
      <h1>Ver Reportes</h1>
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
                  <th>Tipo Equipamento</th>
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
              <td>{{ report.type_equipment_name }}</td>
              <td>{{ report.equipment_name }}</td>
              <td>{{ report.user_name }}</td>
              <td class="th-icons">
                <router-link :to="`/report/edit/${report.id}`" ><img :src="ojo" alt="eye icon"></router-link>
                <a href="#"><img :src="pdf" alt="pdf icon" @click="generar_pdf(report.id)"></a>
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
  </LayoutView>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
import axios from 'axios';
import LayoutView from '../views/Layouts/LayoutView.vue';
import ojo from "@/assets/icons/ojo.png";
import pdf from "@/assets/icons/pdf.png";

const user_id = parseInt(localStorage.getItem('user_id'));
const user_type_id = localStorage.getItem('user_type_id');
const token = localStorage.getItem('token');
const apiUrl = 'http://192.168.1.61:8000';
const apiProdUrl = ref('');
const msg = ref('');

const report_list = ref([]);
const total_paginas = ref(0);
const total_registros = ref(0);

const limit = ref(10);
const position = ref(1);
const state = ref(true);

const router = useRouter();


const get_reports = async () => {
  try {
        state.value = user_type_id == 1 ? true : false;
        const response = await axios.post(
            // `${apiProdUrl}/params/get_clients`, {},
            `${apiUrl}/reports/list_report`, 
            {
                limit: parseInt(limit.value),
                position: position.value,
                state: state.value,
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
            msg.value = response.data.message;
            report_list.value = response.data.data.reportes;
            total_paginas.value = response.data.data.total_pag;
            total_registros.value = response.data.data.total_registros;
            position.value = response.data.data.posicion_pag;
        }
    } catch (error) {
        console.error('Error al cargar los datos:', error);
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
            // `${this.apiProdUrl}/client/save_client`,
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
        error.value = error.response.data.message;
    }
};

// Código que se ejecuta al montar el componente
onMounted(() => {
    if (!token) {
        router.push('/'); // Redirigir al login si no hay token
    }
    // Cargar los datos para los select inputs cuando se monta el componente
    get_reports();
});
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
