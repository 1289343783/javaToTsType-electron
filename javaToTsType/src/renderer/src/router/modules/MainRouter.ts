const MainRouter= [
  {
    path: "/",
    name: "Root",
    redirect: "/home",
    component: () => import("@renderer/layout/Index.vue"),
    meta: {
      title: "首页"
    },
    children: [
      {
        path: "/home",
        name: "Home",
        component: () => import("@renderer/views/Home.vue"),
        meta: {
          title: "首页",
          isAuth: false
        }
      },
      {
        path: "/history",
        name: "History",
        component: () => import("@renderer/views/History.vue"),
        meta: {
          title: "历史记录",
          isAuth: false
        }
      },
      {
        path: "/code/info/:codeId",
        name: "CodeInfo",
        component: () => import("@renderer/views/CodeInfo.vue"),
        meta: {
          title: "CODE详情",
          isAuth: false
        }
      },
      {
        path: "/login",
        name: "Login",
        component: () => import("@renderer/views/Login.vue"),
        meta: {
          title: "登录"
        }
      }
    ]
  }
];
export { MainRouter };
