const notfoundRouteConfig = [
    {
      path: "/404",
      component: () =>
        import(
          /* webpackChunkName: "NotFoundLayout" */ "../layouts/NotFoundLayout.vue"
        ),
      children: [
        {
          path: "",
          name: "notfound",
          component: () =>
            import(
              /* webpackChunkName: "NotFoundView" */ "../views/NotFoundView.vue"
            ),
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: { name: "notfound" },
    },
  ];
  
  export default notfoundRouteConfig;
  