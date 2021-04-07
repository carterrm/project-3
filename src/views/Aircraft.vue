<template>
  <div class="home">
    <AircraftList :aircraftList = "aircraft" /> <!--Aircraft inside double quotes is the computed property, after colon is the name of that
    data inside AircraftList -->
  </div>
</template>

<script>
// @ is an alias to /src
import AircraftList from "../components/AircraftList.vue";

export default {
  name: "Home",
  computed: {
    aircraft: function() {
      return this.$root.$data.aircraft;
    }
  },
  components: {
    AircraftList,
  },
};
</script>
