const ls = {
  get(value, parse = true) {
    if (parse) {
      const val = localStorage.getItem(value) || null;
      return val && val != "undefined" ? JSON.parse(val) : val;
    } else {
      return localStorage.getItem(value);
    }
  },

  set(key, value, stringify = true) {
    if (stringify) {
      return localStorage.setItem(key, JSON.stringify(value));
    } else {
      return localStorage.setItem(key, value);
    }
  },

  rem(key) {
    localStorage.removeItem(key);
  },

  delete(key) {
    localStorage.removeItem(key);
  },

  clear() {
    localStorage.clear();
  },
};

export default ls;
