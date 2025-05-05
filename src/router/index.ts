import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/StreamingResponse.vue'),
      // meta: { requiresAuth: true },
    },
  ],
});

// // ログイン判定
// router.beforeEach(async (to, from, next) => {
//   const { data: { session } } = await supabase.auth.getSession();

//   const isAuthenticated = !!session;
//   const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

//   // 🔐 認証が必要 → 未ログインならログインページへ
//   if (requiresAuth && !isAuthenticated) {
//     return next('/login');
//   }

//   // 通常通り遷移
//   next();
// });

export default router
