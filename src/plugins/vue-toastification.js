import "vue-toastification/dist/index.css";

import Toast, { TYPE } from "vue-toastification";

export const ToastOptions = {
  toastDefaults: {
    // ToastOptions object for each type of toast
    [TYPE.ERROR]: {
      timeout: 10000,
      closeButton: true,
    },
    [TYPE.SUCCESS]: {
      timeout: 3000,
      hideProgressBar: true,
    },
  },
};

export default Toast;
