const passwordRouteConfig = [
    {
      path: "/password",
      component: () =>
        import(
          /* webpackChunkName: "LoginLayout" */ "../layouts/LoginLayout.vue"
        ),
      children: [
        {
          path: "forgot",
          name: "forgot-password",
          component: () =>
            import(
              /* webpackChunkName: "ForgotPassword" */ "../views/ForgotPassword.vue"
            ),
        },
        {
          path: "change/:email",
          name: "change-password",
          component: () =>
            import(
              /* webpackChunkName: "ForgotPassword" */ "../views/ChangePassword.vue"
            ),
        },
      ],
    },
  ];
  export default passwordRouteConfig;
  