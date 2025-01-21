import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue';
import CreateReportView from '@/views/CreateReportView.vue';
import ListReportView from '@/views/ListReportView.vue';
import EditProfileView from '@/views/EditProfileView.vue';
import EditReportView from '@/views/EditReportView.vue';
import CreateUserView from '@/views/CreateUserView.vue';
import ListUserView from '@/views/ListUserView.vue';
import ChangePasswordView from '@/views/ChangePasswordView.vue';
import CreateClientView from '@/views/CreateClientView.vue';
import ListClientView from '@/views/ListClientView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/', name: 'login', component: LoginView},
    {path: '/dashboard', name: 'dashboard', component: DashboardView},
    {path: '/report/create', name: 'report/create', component: CreateReportView},
    {path: '/reports', name: 'reports', component: ListReportView},
    {path: '/profile/edit/:id', name: 'profile/edit/', component: EditProfileView},
    {path: '/report/edit/:id', name: 'report/edit/', component: EditReportView},
    {path: '/user/create', name: 'user/create', component: CreateUserView},
    {path: '/users', name: 'users', component: ListUserView},
    {path: '/profile/change_password/:id', name: 'profile/change_password/', component: ChangePasswordView},
    {path: '/client/create', name: 'client/create', component: CreateClientView},
    {path: '/clients', name: 'clients', component: ListClientView},
  ]
})

router.beforeEach((to, from, next) => {

  const token = localStorage.getItem('token');
  // Si no se requiere autenticación (por ejemplo, en la ruta de login), continúa
  if (to.path === '/' || to.name === 'login') {
    next();
  } else {
    // Si se requiere autenticación y no hay token, redirigir al login
    if (!token) {
      next({ name: 'login' }); // Redirigir a la ruta de login si no hay token
    } else {
      // Si hay token, permitir la navegación
      next();
    }
  }
});

export default router
