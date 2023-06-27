<template>
  <div class="mt-5">
    <v-img
      class="mx-auto mt-12"
      width="350"
      cover
      src="https://web.emqu.net/wp-content/uploads/2021/12/logo_web_emqu.png"
    ></v-img>

    <v-card class="mx-auto mt-10" max-width="350" elevation="5">
      <v-form @submit.prevent>
        <v-row dense class="pa-5">
          <v-col cols="12">
            <v-text-field
              v-model="credential.email"
              :rules="rules"
              label="Email"
              type="email"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="credential.password"
              :rules="rules"
              label="Contraseña"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-btn
              block
              flat
              rounded="xl"
              type="submit"
              class="mt-2"
              color="primary"
              append-icon="mdi-account-circle"
              :loading="loading"
              :disabled="loading"
              @click="auth"
              >Entrar</v-btn
            >
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import Auth from "@/services/auth";
const auth = new Auth();
import mixins from "@/mixins";

export default {
  mixins: [mixins],
  data: () => ({
    loading: false,
    credential: {
      email: "",
      password: "",
    },
    rules: [
      (value) => {
        if (value) return true;
        return "You must enter a first name.";
      },
    ],
  }),

  methods: {
    auth() {
      let _this = this;
      _this.loading = true;
      auth
        .login(this.credential)
        .then((response) => {
          if (response.success == true) {
            _this.notify(`Bienvenido ${response.data.name}.`);
            _this.goto("/");
          } else {
            _this.notify(`Bienvenido ${response.data.name}.`);
          }
        })
        .catch((error) => {
          _this.notify(error.data.message);
        })
        .finally(() => {
          _this.loading = false;
        });
    },
  },
};
</script>
