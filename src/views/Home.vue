<template>
  <div class="home">
    <div v-if='"loggedIn"'>
      <button class=login @click='"login"'>Login</button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  computed: {
    userID: function() {
      return 1010;
    },
    loggedIn: function() {
      return false;
    }
  },
  methods: {
    login: function() {
      return this.userID;
    }
  }
};
</script>

<style>

.login {
  margin-bottom: 20px;
}

</style>