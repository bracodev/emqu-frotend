<template>
  <v-app-bar scroll-behavior="elevate" flat color="cyan-darken-1">

    <v-app-bar-title>EmQu</v-app-bar-title>

    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
      </template>

      <v-list>
        <v-list-item rounded="xl" color="primary" @click="logout">
          <template v-slot:prepend>
            <v-icon icon="mdi-logout"></v-icon>
          </template>
          <v-list-item-title>Cerrar</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>

  <v-navigation-drawer floating permanent theme="dark">
    <v-list nav>
      <v-list-item
        prepend-avatar="https://bracodev.com/wp-content/webp-express/webp-images/uploads/2022/01/avatar-140x140.png.webp"
        title="Brayan Rincón"
        subtitle="brayan262@gmail.com"
      ></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-view-dashboard-outline"
        title="Dashboard"
        value="home"
        @click="goto('/')"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-desktop-classic"
        title="Equipos"
        value="terminals"
        @click="goto('/terminals')"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-chart-box-outline"
        title="Estadísticas"
        value="charts"
        @click="goto('/stadistics')"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import Auth from "@/services/auth";
const auth = new Auth();

import mixins from "@/mixins";

export default {
  mixins: [mixins],
  data: () => ({
    drawer: false,
  }),

  methods: {
    logout() {
      let _this = this;
      auth.logout().then(() => {
        _this.goto("/let-me-in");
      });
    },
  },
};
</script>
