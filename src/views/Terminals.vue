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

        <v-btn
          color="cyan-accent-4"
          icon="mdi-plus"
          size="small"
          @click="create"
        ></v-btn>

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
          <template v-slot:item.enabled="{ item }">
            <v-chip
              :color="item.columns.enabled ? 'green-darken-3' : 'red-darken-4'"
            >
              {{ item.columns.enabled ? "Activo" : "Inactivo" }}
            </v-chip>
          </template>

          <template v-slot:item.updated_at="{ item }">
            {{ formatDate(item.columns.updated_at) }}
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon
              color="green-lighten-3"
              size="small"
              class="me-2"
              @click="ping(item.raw)"
            >
              mdi-gesture-tap
            </v-icon>

            <v-icon
              color="deep-purple-darken-3"
              size="small"
              class="me-2"
              @click="stadistics(item.raw)"
            >
              mdi-chart-box-outline
            </v-icon>

            <v-icon
              color="cyan-lighten-3"
              size="small"
              class="me-2"
              @click="edit(item.raw)"
            >
              mdi-pencil
            </v-icon>
            <v-icon color="red-accent-3" size="small" @click="destroy(item.raw)"
              >mdi-delete</v-icon
            >
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-card>

  <v-dialog v-model="dialog" persistent width="500px">
    <v-card>
      <v-card-title class="text-h6">
        <v-icon v-bind="props" class="mr-2">{{ info.icon }}</v-icon>
        {{ info.title }}
      </v-card-title>
      <v-form
        @submit.prevent="store"
        ref="form"
        fast-fail
        v-model="valid"
        lazy-validation
      >
        <v-divider></v-divider>
        <v-card-text>
          <v-row dense>
            <v-col cols="6">
              <v-text-field
                label="Nombre *"
                v-model="record.name"
                :rules="[rules.required]"
                maxlength="50"
                required
                counter
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="IPv4 *"
                v-model="record.ipv4"
                :rules="[rules.required, rules.ipv4]"
                placeholder="123.123.123.123"
                maxlength="17"
                required
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="record.description"
                label="Descripción"
                maxlength="300"
                rows="4"
                counter
              ></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-switch
                :label="record.enabled ? 'Activo' : 'Inactivo'"
                v-model="record.enabled"
                color="primary"
              ></v-switch>
            </v-col>
          </v-row>
          <div v-if="edited">
            <strong>Creado por:</strong> {{ record.user.name }} <br />
            <strong>Creación:</strong> {{ formatDate(record.created_at) }}<br />
            <strong>Actualizado:</strong> {{ formatDate(record.updated_at)
            }}<br />
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            color="red-accent-4"
            variant="text"
            @click="dialog = false"
            :loading="saving"
          >
            <v-icon icon="mdi-cancel" class="mr-2"></v-icon>
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" type="submit" :loading="saving">
            Guardar
            <v-icon icon="mdi-check-circle-outline" end></v-icon>
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>

  <x-dialog-ping
    v-model:value.sync="pingShowDialog"
    v-model:record="pingTerminal"
    v-model:info="info"
    v-on:visible-change="pingShowDialog = false"
  />
</template>

<script>
import Terminal from "@/services/Terminal";
const model = new Terminal();
import mixins from "@/mixins";
import moment from "moment";
import printJS from "print-js";
import DialogPingVue from "@/components/DialogPing.vue";

export default {
  mixins: [mixins],

  components: {
    "x-dialog-ping": DialogPingVue,
  },

  data: () => ({
    info: {
      title: "Equipos",
      icon: "mdi-desktop-classic",
    },
    record: {
      name: "",
      ipv4: "",
      description: "",
      enabled: true,
    },

    pingTerminal: null,
    pingShowDialog: false,

    data: [],

    saving: false,

    valid: false,

    rules: {
      required: (value) => !!value || "Este campo es requerido",
      ipv4: (value) => {
        if (
          /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
            value
          )
        ) {
          return true;
        }
        return "Ingrese una IPv4 válida";
      },
    },

    itemsPerPage: 10,

    dialog: false,

    headers: [
      {
        title: "Nombre",
        align: "start",
        key: "name",
      },
      { title: "IPv4", key: "ipv4", align: "end" },
      { title: "Activo", key: "enabled", align: "center", width: "100px" },
      {
        title: "Actualizado",
        key: "updated_at",
        align: "center",
        width: "200px",
      },
      { title: "Acciones", key: "actions", align: "center", width: "160px" },
    ],

    search: "",

    loading: true,

    edited: false,

    breadcrumbs: [
      {
        title: "Dashboard",
        disabled: false,
        href: "/",
      },
      {
        title: "Equipos",
        disabled: true,
        href: "/terminals",
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

      model.all().then((response) => {
        this.data = response.data;
        this.loading = false;
      });
    },

    create() {
      Object.assign(this.record, {
        name: "",
        ipv4: "",
        description: "",
        enabled: true,
      });
      this.dialog = true;
      this.edited = false;
    },

    edit(item) {
      Object.assign(this.record, item);
      console.log(item);
      this.dialog = true;
      this.edited = true;
    },

    async validate() {
      return await this.$refs.form.validate();
    },

    async store(e) {
      e.preventDefault();

      const { valid } = await this.$refs.form.validate();

      if (valid) {
        this.saving = true;
        if (this.edited == false) {
          model
            .store(this.record)
            .then((response) => {
              if (response.success == true) {
                this.notify(response.message);
                this.dialog = false;
                this.loadData()
                //this.record.updated_at = moment();
                //this.record.created_at = moment();
                //this.record.id = response.data.id
                //this.data.push(this.record);
              } else {
                this.notify(response.message, "error");
              }
            })
            .catch((error) => {
              let _this = this;
              if (error.status === 422 && error.data.errors) {
                for (const [key, item] of Object.entries(error.data.errors)) {
                  item.map((i) => {
                    console.log(i);
                    _this.notify(i, "error");
                  });
                  // if( _this.$refs[key] ) _this.$refs[key].focus();
                }
              } else {
                if (error.data) {
                  _this.notify(error.data.message, "error");
                } else {
                  console.error(error);
                }
              }
            })
            .finally(() => {
              this.saving = false;
            });
        } else {
          model.update(this.record).then((response) => {
            if (response.success == true) {
              this.notify(response.message);
              this.dialog = false;
              this.saving = false;
              this.loadData()
              // const ix = this.data.findIndex((v) => v.id === this.record.id);
              // this.data[ix] = this.record;
            } else {
              this.notify(response.message, "error");
            }
          });
        }
      }
    },

    destroy(item) {
      const _this = this;
      return new Promise((resolve, reject) => {
        this.$swal
          .fire({
            title: "Eliminar equipo",
            text: "¿Confirma que desea eliminar este equipo?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, borrarlo",
          })
          .then((v) => {
            if (v.value) {
              _this
                .destroyCallback(item);
            }
          });
      });
    },

    destroyCallback(item) {
      model
        .destroy(item.id)
        .then((response) => {
          this.notify(response.message);
          this.dialog = false;
          this.saving = false;
          this.loadData();
        })
        .catch((error) => {
          let _this = this;
          if (error.status === 422 && error.data.errors) {
            for (const [key, item] of Object.entries(error.data.errors)) {
              item.map((i) => {
                _this.notify(i, "error");
              });
            }
          } else {
            if (error.data) {
              _this.notify(error.data.message, "error");
            } else {
              console.error(error);
            }
          }
        });
    },

    ping(item) {
      this.pingShowDialog = true;
      this.pingTerminal = item;
    },

    stadistics(item) {
      this.goto(`/terminals/${item.id}/logs`, item, item);
    },

    export() {},

    print() {
      const data = JSON.parse(JSON.stringify(this.data));

      data.map((v) => {
        v.enabled = v.enabled ? "Activo" : "Inactivo";
        v.created_at = this.formatDate(v.created_at);
        v.updated_at = this.formatDate(v.updated_at);
      });

      printJS({
        documentTitle: this.info.title,
        header: `<h1>${this.info.title}</h1>`,
        printable: data,
        properties: [
          { field: "name", displayName: "Nombre" },
          { field: "ipv4", displayName: "IPv4" },
          { field: "enabled", displayName: "Activo" },
          { field: "created_at", displayName: "Creado" },
          { field: "updated_at", displayName: "Actualizado" },
        ],
        type: "json",
      });
    },
  },
};
</script>
@/services/Terminal
