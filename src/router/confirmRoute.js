const confirmRoute = [
    {
      path: "/confirm",
      component: () =>
        import(
          /* webpackChunkName: "LoginLayout" */ "../layouts/LoginLayout.vue"
        ),
      children: [
        {
          path: "account/:email",
          name: "confirm.account",
          component: () =>
            import(
              /* webpackChunkName: "ForgotPassword" */ "../views/ConfirmAccount.vue"
            ),
        },
      ],
    },
  ];
  
  export default confirmRoute;
  