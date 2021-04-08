<template>
  <div class="home">
    <div v-if='"loggedIn"'>
      <button class=login @click="login()">Login</button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

import axios from 'axios';
export default {
  name: "Home",
  data() {
    return {
    reservations: []
    }
  },
  computed: {
    userID: function() {
      console.log(this.$root.$computed.userID());
      return this.$root.$computed.userID();
    },
  },
  methods: {
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
        console.log("Reservation for " + planes[i].id + " created")
      } catch (error) {
        console.log(error);
      }
    }
    console.log("All aircraft reservations completed for " + userID)
    },
    async login() {
      console.log("login function entered, moving to create reservations");
      let results = await this.getReservations(this.userID);
      console.log(results);
      if(results.length === 0) {
        console.log("creating reservations in DB")
      this.CreateReservationsForClient(this.userID);
      } //if there are no results,
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

<style>

.login {
  margin-bottom: 20px;
}

</style>