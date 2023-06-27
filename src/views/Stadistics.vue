<template>
  <div>
    <v-breadcrumbs :items="breadcrumbs">
      <template v-slot:prepend>
        <v-img
          :width="24"
          aspect-ratio="16/9"
          cover
          src="https://web.emqu.net/wp-content/uploads/2021/12/favicon.png"
        ></v-img>
      </template>
    </v-breadcrumbs>
  </div>

  <v-row class="mt-2">
    <v-col cols="12" v-if="loading != true">
      <v-btn size="x-large" block rounded="xl" color="primary" @click="pingAll">
        Ejeutar nueva prueba
        <v-icon class="ml-2"> mdi-gesture-tap </v-icon>
      </v-btn>
    </v-col>
    <v-col v-else>
      <h4>Cargando datos, por favor espere...</h4>
    </v-col>
  </v-row>

  <v-row v-if="stats != null">
    <v-col cols="12">
      <v-card elevation="2" class="pa-2">
        <strong>Total de terminales: </strong>{{ stats.terminals }}<br />
        <strong>En línea: </strong>{{ stats.online }}<br />
        <strong>Fuera de línea: </strong>{{ stats.offline }}<br />
        <strong>Tiempo: </strong>{{ stats.time }} segundos<br />
      </v-card>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="4" v-for="(item, i) in data" :key="i">
      <v-card
        @click="goto(`/terminals/${item.id}/logs`, item, item)"
        :loading="item.enabled && loading"
        elevation="2"
        class="pa-2"
        :color="
          item.status == true
            ? 'green-darken-2'
            : item.status == false
            ? 'red-darken-3'
            : ''
        "
        :prepend-icon="
          item.status == true
            ? 'mdi-check-circle-outline'
            : item.status == false
            ? 'mdi-alert'
            : info.icon
        "
      >
        <template v-slot:loader="{ isActive }">
          <v-progress-linear
            :active="isActive"
            height="6"
            color="primary"
            indeterminate
          ></v-progress-linear>
        </template>

        <template v-slot:title>
          {{ item.name }}
        </template>
        <v-card-text>
          <strong>IPv4: </strong>{{ item.ipv4 }}<br />
          <div v-if="item.time">
            <strong>Latencia: </strong>{{ item.time }}<br />
            <strong>Transmitidos: </strong>{{ item.transmitted }}<br />
            <strong>Recibidos: </strong>{{ item.received }}<br />
            <strong>Perdidos: </strong>{{ item.loss }}<br />
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import Terminal from "@/services/Terminal";
const model = new Terminal();
import mixins from "@/mixins";

export default {
  mixins: [mixins],
  data: () => ({
    info: {
      title: "Equipos",
      icon: "mdi-desktop-classic",
    },

    record: {
      name: "",
      ipv4: "",
      description: "",
      status: null,
    },

    data: [],
    stats: null,
    logs: null,

    saving: false,

    rules: {
      required: (value) => !!value || "Este campo es requerido",
    },

    itemsPerPage: 10,
    dialog: true,
    headers: [
      {
        title: "Nombre",
        align: "start",
        sortable: false,
        key: "name",
      },
      { title: "IPv4", key: "ipv4", align: "end" },
      { title: "Acciones", key: "actions", align: "center" },
    ],
    search: "",

    loading: true,

    breadcrumbs: [
      {
        title: "Dashboard",
        disabled: false,
        href: "/",
      },
      {
        title: "Equipos",
        disabled: false,
        href: "/terminals",
      },
      {
        title: "Estadísticas",
        disabled: true,
        href: "/stadistics",
      },
    ],
  }),

  mounted() {
    this.loadData();
  },

  methods: {
    async loadData() {
      this.loading = true;
      this.data = [];

      await model.all().then((response) => {
        this.data = response.data.filter(v => v.enabled === true );
        this.loading = false;
      });
    },

    async pingAll() {
      let _this = this;
      this.loading = true;
      await model.pingAll().then((response) => {
        this.loading = false;
        this.logs = response.data.logs;
        this.logs.map((logValue) => {
          _this.data.find((dataValue) => {
            if (dataValue.id == logValue.terminal_id) {
              dataValue.status = logValue.status;
              dataValue.time = logValue.time;
              dataValue.transmitted = logValue.transmitted;
              dataValue.received = logValue.received;
              dataValue.loss = logValue.loss;
            }
          });
        });
        this.stats = response.data.stats;
      });
    },
  },
};
</script>
@/services/Terminal
