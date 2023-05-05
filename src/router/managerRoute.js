import Sidebar from "../components/manager/SidebarManager.vue";

const managerRouteConfig = [
  {
    path: "/manager",
    redirect: { name: "dashboard" },
    component: () =>
      import(
        /* webpackChunkName: "DefaultLayout" */ "../layouts/DefaultLayout.vue"
      ),
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        components: {
          default: () =>
            import(
              /* webpackChunkName: "Dashboard" */ "../pages/manager/Dashboard.vue"
            ),
          sidebar: Sidebar,
        },
        meta: {
          auth: true, // * Kiểm tra xem người dùng có đăng nhập chưa
        },
      },
      {
        path: "category",
        children: [
          {
            path: "",
            name: "category",
            components: {
              default: () =>
                import(
                  /* webpackChunkName: "Category" */ "../pages/manager/Category/Category.vue"
                ),
              sidebar: Sidebar,
            },
            meta: {
              auth: true,
            },
          },
          {
            path: "add",
            name: "add-category",
            components: {
              default: () =>
                import(
                  /* webpackChunkName: "AddCategory" */ "../pages/manager/Category/CategoryAddEdit.vue"
                ),
              sidebar: Sidebar,
            },
            meta: {
              auth: true,
            },
          },
          {
            path: "add/children/:parentId",
            name: "add-children-category",
            components: {
              default: () =>
                import(
                  /* webpackChunkName: "AddCategory" */ "../pages/manager/Category/CategoryAddEdit.vue"
                ),
              sidebar: Sidebar,
            },
            meta: {
              auth: true,
            },
          },
          {
            path: "update/:categoryId",
            name: "update-category",
            components: {
              default: () =>
                import(
                  /* webpackChunkName: "UpdateCategory" */ "../pages/manager/Category/CategoryAddEdit.vue"
                ),
              sidebar: Sidebar,
            },
            meta: {
              auth: true,
            },
          },
        ],
      },
      {
        path: "post",
        children: [
          {
            path: "",
            name: "post",
            components: {
              default: () =>
                import(
                  /* webpackChunkName: "Post" */ "../pages/manager/Post/Post.vue"
                ),
              sidebar: Sidebar,
            },
            meta: {
              auth: true,
            },
          },
          {
            path: "add",
            name: "add-post",
            components: {
              default: () =>
                import(
                  /* webpackChunkName: "Post Add" */ "../pages/manager/Post/PostAddEdit.vue"
                ),
              sidebar: Sidebar,
            },
            meta: {
              auth: true,
            },
          },
          {
            path: "update/:id",
            name: "update-post",
            components: {
              default: () =>
                import(
                  /* webpackChunkName: "Post Update" */ "../pages/manager/Post/PostAddEdit.vue"
                ),
              sidebar: Sidebar,
            },
            meta: {
              auth: true,
            },
          },
        ],
      },
    ],
  },
];

export default managerRouteConfig;
