import { POSITION, TYPE, useToast } from "vue-toastification";

import moment from "moment";

const MIXINS = {
  methods: {
    l(...args) {
      console.log(...args);
    },

    formatDate(value, format = "DD/MM/YYYY, h:mm a") {
      return moment(value).format(format);
    },

    notify(message, type = TYPE.DEFAULT, timeout = 5000) {
      const options = {
        type: type,
        position: POSITION.TOP_RIGHT,
        timeout: timeout,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 1,
        showCloseButtonOnHover: true,
        hideProgressBar: false,
        closeButton: "button",
        icon: true,
        rtl: false,
      };
      const toast = useToast();
      toast(message, options);
    },

    goto(url, params = {}, query = {}) {
      this.$router.push({ path: url, query: query, params: params });
    },

    goBack() {
      this.$router.go(-1);
    },

    openWindow() {
      window.open(this.url, "_blank");
    },

    slug(text) {
      if (text == "") return "";
      var slug = "";
      // Change to lower case
      var titleLower = text.toLowerCase();
      // Letter "e"
      slug = titleLower.replace(/e|é|è|ẽ|ẻ|ẹ|ê|ế|ề|ễ|ể|ệ/gi, "e");
      // Letter "a"
      slug = slug.replace(/a|á|à|ã|ả|ạ|ă|ắ|ằ|ẵ|ẳ|ặ|â|ấ|ầ|ẫ|ẩ|ậ/gi, "a");
      // Letter "o"
      slug = slug.replace(/o|ó|ò|õ|ỏ|ọ|ô|ố|ồ|ỗ|ổ|ộ|ơ|ớ|ờ|ỡ|ở|ợ/gi, "o");
      // Letter "u"
      slug = slug.replace(/u|ú|ù|ũ|ủ|ụ|ư|ứ|ừ|ữ|ử|ự/gi, "u");
      // Letter "d"
      slug = slug.replace(/đ/gi, "d");
      // Trim the last whitespace
      slug = slug.replace(/\s*$/g, "");
      // Change whitespace to "-"
      slug = slug.replace(/\s+/g, "-");

      return slug;
    },
  },
};

export default MIXINS;
