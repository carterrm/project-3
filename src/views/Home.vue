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
      CreateReservationsForClient(this.userID);
    }
  },
  async CreateReservationsForClient(userID) {
    let planes = this.$root.$data.aircraft;
    var i = 0;
    for(i = 0; i < planes.length; i++) {
      try {
        await axios.post("/api/reservations/" + userID, {
            userID: userID,
            numHours: 0,
            aircraftID: planes[i].id
        });
        console.log("Reservation for " + planes[i].id + " created")
      } catch (error) {
        console.log(error);
      }
    }
    console.log("All aircraft reservations completed for " + userID)
      
    },
};
</script>

<style>

.login {
  margin-bottom: 20px;
}

</style>