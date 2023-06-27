<template>
  <v-dialog v-model="show" width="600px">
    <v-card :loading="loadingPing">
      <template v-slot:loader="{ isActive }">
        <v-progress-linear
          :active="isActive"
          height="6"
          color="primary"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-card-title class="text-h6">
        <v-icon v-bind="props" class="mr-2">{{ info.icon }}</v-icon>
        {{ info.title }}
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <strong>Haciendo ping a {{ record.ipv4 }}</strong
        ><br /><br />
        <v-card color="grey-darken-4" class="pa-2" v-if="pingResult != null">
          <span v-for="(item, i) in pingResult.logs" :key="i">
            {{ item }} <br />
          </span>
        </v-card>
        <v-card class="pa-2" elevation="0" v-if="pingResult != null">
          <strong v-if="pingResult.transmitted">Transmitidos:</strong>
          {{ pingResult.transmitted }} paquetes<br />
          <strong v-if="pingResult.received">Recibidos:</strong>
          {{ pingResult.received }} paquetes<br />
          <strong v-if="pingResult.loss">Perdidos: </strong
          >{{ pingResult.loss }} perdidos<br />
          <strong v-if="pingResult.time">Tiempo:</strong> {{ pingResult.time }}
        </v-card>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          variant="text"
          @click="show = false"
        >
          Aceptar
          <v-icon icon="mdi-check-circle-outline" end></v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Terminal from "@/services/Terminal";
const model = new Terminal();

export default {
  props: {
    info: { type: Object },
    value: { type: Boolean },
    record: { type: Object },
  },

  computed: {
    show: {
      get: function () {
        if (this.value) {
          this.ping();
        }
        return this.value
      },
      set: function (value) {
        this.$emit("visible-change", value);
      },
    },
  },

  data: () => ({
    loadingPing: false,
    pingResult: null,
  }),

  methods: {
    ping() {
      this.loadingPing = true;
      this.pingResult = null;

      model.ping(this.record.id).then((response) => {
        this.loadingPing = false;
        this.pingResult = response.data;
      });
    },
  },
};
</script>
