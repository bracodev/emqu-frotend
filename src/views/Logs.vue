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

  <v-card elevation="2" class="pa-2 mb-4">
    <v-row>
      <v-col cols="1">
        <v-btn
          color="cyan-accent-4"
          variant="plain"
          icon="mdi-chevron-left"
          @click="goBack()"
        ></v-btn>
      </v-col>
      <v-col cols="11">
        <h6 class="text-h6">{{ record.name }}</h6>
        <span class="text-subtitle-1">{{ record.ipv4 }}</span
        ><br />
        <span>{{ record.description }}</span>
      </v-col>
    </v-row>
  </v-card>

  <v-card elevation="2" class="pa-2">
    <v-toolbar>
      <template v-slot:prepend>
        <v-icon v-bind="props" class="mr-2">{{ info.icon }}</v-icon>
        {{ info.title }}
      </template>

      <template v-if="$vuetify.display.smAndUp">
        <v-divider
          class="mx-3 align-self-center"
          length="24"
          thickness="2"
          vertical
        ></v-divider>

        <v-text-field
          v-model="search"
          append-inner-icon="mdi-magnify"
          label="Filtrar"
          density="compact"
          single-line
          hide-details
        ></v-text-field>
        <v-btn
          color="cyan-accent-4"
          variant="plain"
          icon="mdi-reload"
          @click="loadData"
        ></v-btn>
        <v-btn
          color="cyan-accent-4"
          variant="plain"
          icon="mdi-printer-outline"
          @click="print"
        ></v-btn>
      </template>
    </v-toolbar>

    <v-row>
      <v-col cols="12">
        <v-data-table
          density="compact"
          v-model:items-per-page="itemsPerPage"
          :headers="headers"
          :items="data"
          :loading="loading"
          loading-text="Cargando datos..."
          :search="search"
          class="elevation-0"
          item-value="name"
        >
          <template v-slot:item.created_at="{ item }">
            {{ formatDate(item.columns.created_at) }}
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon
              color="cyan-lighten-3"
              size="small"
              class="me-2"
              @click="viewLogs(item.raw)"
            >
              mdi-card-search-outline
            </v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-card>

  <v-dialog v-model="dialog" width="600px">
    <v-card>
      <v-card-title class="text-h6">
        <v-icon v-bind="props" class="mr-2">{{ info.icon }}</v-icon>
        {{ info.title }}
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-card color="grey-darken-4" class="pa-2" v-if="record != null">
          <span v-for="(item, i) in record.logs" :key="i">
            {{ item }} <br />
          </span>
        </v-card>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="dialog = false">
          Aceptar
          <v-icon icon="mdi-check-circle-outline" end></v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Terminal from "@/services/TerminalLogs";
const model = new Terminal();
import mixins from "@/mixins";
import printJS from "print-js";

export default {
  mixins: [mixins],

  data: () => ({
    info: {
      title: "Logs de Pings",
      icon: "mdi-desktop-classic",
    },

    record: {
      name: "",
      ipv4: "",
      description: "",
      enabled: true,
    },

    itemsPerPage: 10,

    dialog: false,

    headers: [
      {
        title: "Fecha",
        align: "start",
        key: "created_at",
        width: "200px",
      },
      { title: "Transmitidos", key: "transmitted" },
      { title: "Recibidos", key: "received", align: "center" },
      { title: "Perdidos", key: "loss", align: "center" },
      { title: "Tiempo", key: "time", align: "center" },
      { title: "Acciones", key: "actions", align: "center", width: "50px" },
    ],

    search: "",

    loading: true,

    breadcrumbs: [
      {
        title: "Dashboard",
        disabled: false,
        to: { name: "Home" },
      },
      {
        title: "Equipos",
        disabled: false,
        to: { name: "Terminals" },
      },

      {
        title: "",
        disabled: false,
        to: { name: "Terminals" },
      },
      {
        title: "Logs de Pings",
        disabled: true,
        to: { name: "Logs" },
      },
    ],

    terminal_id: null,
  }),

  mounted() {
    if (this.$route.query) {
      this.record = this.$route.query;
      this.breadcrumbs[2].title = this.record.name;
      this.loadData();
    }
  },

  methods: {
    loadData() {
      this.loading = true;
      this.data = [];

      model.logs(this.record.id).then((response) => {
        this.data = response.data;
        this.loading = false;
      });
    },

    viewLogs(item) {
      Object.assign(this.record, item);
      this.dialog = true;
      this.edited = true;
    },

    print() {
      const data = JSON.parse(JSON.stringify(this.data));

      data.map((v) => {
        v.enabled = v.enabled ? "Activo" : "Inactivo";
        v.created_at = this.formatDate(v.created_at);
        v.updated_at = this.formatDate(v.updated_at);
      });

      printJS({
        documentTitle: this.info.title,
        header: `<h1>${this.info.title}</h1><h2>${this.record.name} (${this.record.ipv4})</h2><p>${this.record.description}</p><br/>`,
        printable: data,
        properties: [
          { field: "created_at", displayName: "Fecha" },
          { field: "transmitted", displayName: "Transmitidos" },
          { field: "received", displayName: "Recibidos" },
          { field: "loss", displayName: "Perdidos" },
          { field: "time", displayName: "Tiempo" },
        ],
        type: "json",
      });
    },
  },
};
</script>
