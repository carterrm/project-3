<template>
  <div class="home" v-if="!isLoggedIn()">
    <form class="pure-form">
      <fieldset>
        <legend>Register for an account</legend>
        <input placeholder="first name" v-model="firstName">
        <input placeholder="last name" v-model="lastName">
      </fieldset>
      <fieldset>
        <input placeholder="username" v-model="username">
        <input type="password" placeholder="password" v-model="password">
      </fieldset>
      <fieldset>
        <button type="submit" class="pure-button pure-button-primary" @click.prevent="register">Register</button>
      </fieldset>
    </form>
    <p v-if="error" class="error">{{error}}</p>
    <form class="pure-form space-above">
      <fieldset>
        <legend>Login</legend>
        <input placeholder="username" v-model="usernameLogin">
        <input type="password" placeholder="password" v-model="passwordLogin">
      </fieldset>
      <fieldset>
        <button type="submit" class="pure-button pure-button-primary" @click.prevent="login">Login</button>
      </fieldset>
    </form>
  </div>
  <div v-else>
            <p>You're logged in- head over to your Reservations and Logbook!</p>
            <button @click="logout()" class='logout-button'>Log Out</button>
    </div>
</template>

<script>
// @ is an alias to /src

import axios from 'axios';
export default {
  name: "Home",
  data() {
    return {
    reservations: [],
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    usernameLogin: '',
    passwordLogin: '',
    error: '',
    errorLogin: '',
    }
  },
  computed: {
    userID: function() {
      return this.$root.$data.userID;
    },
  },
  methods: {
    logout() {
      this.$root.$data.userID = "-1";
    },
    isLoggedIn() {
            if(this.$root.$data.userID == '-1') {
                console.log("User is not logged in");
                return false;
            }
            else {
                console.log("User is logged in");
                return true;
            }
        },
    async CreateReservationsForClient(userID) {
      let planes = this.$root.$data.aircraft;
      var i = 0;
      for(i = 0; i < planes.length; i++) {
        try {
          await axios.post("/api/reservations/" + userID, {
              userID: userID,
              hoursBooked: 0,
              aircraftID: planes[i].id
          });
        } catch (error) {
          console.log(error);
        }
      }
    },

    async register() {
      console.log("Entering register()");
      this.error = '';
      this.errorLogin = '';
      if (!this.firstName || !this.lastName || !this.username || !this.password)
        return;
      try {
        let requestData = {
          firstName: this.firstName,
          lastName: this.lastName,
          username: this.username,
          password: this.password,
        };
        console.log(requestData);
        let response = await axios.post('/', requestData);
        console.log("Response = " + response);
        this.$root.$data.userID = response.data.user._id;
        this.CreateReservationsForClient(this.$root.$data.userID);
      } catch (error) {
        this.error = error.response.data.message;
        this.$root.$data.user = null;
      }
    },
    async login() {
      console.log("Entering login");
      this.error = '';
      this.errorLogin = '';
      if (!this.usernameLogin || !this.passwordLogin)
        return;
      try {
        let response = await axios.post('/api/login', {
          username: this.usernameLogin,
          password: this.passwordLogin,
        });
        this.$root.$data.userID = response.data.user._id;
      } catch (error) {
        this.errorLogin = "Error: " + error.response.data.message;
        this.$root.$data.user = null;
      }
      //code from previous login
      let results = await this.getReservations(this.$root.$data.userID);
      if(results.length === 0) {
        this.CreateReservationsForClient(this.$root.$data.userID);
      }
    },
    async getReservations(userID) {
      try {
        const response = await axios.get("/api/reservations/" + userID);
        return response.data;
      } catch (error) {
        console.log(error);
        return 20;
      }
    },
  },
  
};
</script>

<style scoped>
.space-above {
  margin-top: 50px;
}

h1 {
  font-size: 28px;
  font-variant: capitalize;
}

.hero {
  padding: 120px;
  display: flex;
  justify-content: center;
}

.heroBox {
  text-align: center;
}

.hero form {
  font-size: 14px;
}

.hero form legend {
  font-size: 20px;
}

input {
  margin-right: 10px;
}

fieldset {
  border:0px;
}

.error {
  margin-top: 10px;
  display: inline;
  padding: 5px 20px;
  border-radius: 30px;
  font-size: 10px;
  background-color: #d9534f;
  color: #fff;
}

.logout-button {
  margin-bottom: 20px;
}
</style>