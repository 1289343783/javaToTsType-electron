import { createRouter, createWebHashHistory } from "vue-router";
import { MainRouter as routes } from "./modules/MainRouter";


const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
});
export { routes };
export default router;
