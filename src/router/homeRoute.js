import Sidebar from "../components/Sidebar.vue";

const homeRouteConfig = [
  {
    path: "/",
    component: () =>
      import(
        /* webpackChunkName: "DefaultLayout" */ "../layouts/DefaultLayout.vue"
      ),
    children: [
      {
        path: "",
        name: "home",
        components: {
          default: () =>
            import(/* webpackChunkName: "HomView" */ "../views/HomeView.vue"),
          sidebar: Sidebar,
        },
      },
      {
        path: "category/:slug",
        name: "category.slug",
        components: {
          default: () =>
            import(
              /* webpackChunkName: "CategorySlug" */ "../views/CategorySlug.vue"
            ),
          sidebar: Sidebar,
        },
      },
      {
        path: "post/:slug",
        name: "post.slug",
        components: {
          default: () =>
            import(/* webpackChunkName: "PostSlug" */ "../views/PostSlug.vue"),
          sidebar: Sidebar,
        },
      },
      {
        path: "login",
        children: [
          {
            path: "",
            name: "login",
            component: () =>
              import(
                /* webpackChunkName: "FormLogin" */ "../components/FormLogin.vue"
              ),
            meta: {
              auth: true,
            },
          },
        ],
      },
      {
        path: "register",
        children: [
          {
            path: "",
            name: "register",
            component: () =>
              import(
                /* webpackChunkName: "Register" */ "../components/Register.vue"
              ),
          },
        ],
      },
    ],
  },
];

export default homeRouteConfig;
