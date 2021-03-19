<template>
  <div class="wrapper">
  <p>Add an entry:</p>
    <form v-on:submit.prevent="logbookSubmit" class="about">
      <label for="planes">Choose the aircraft you flew:</label>
      <select name="planes" id="planes" v-model="aircraft">
        <option value="DA62">DA62</option>
        <option value="DA42">DA42</option>
        <option value="DA50">DA50</option>
        <option value="DA40">DA40</option>
        <option value="DA20">DA20</option>
      </select>
      <label for="hoursFlown">Hours flown:</label>
      <select name="hoursFlown" id="hoursFlown" v-model="hoursFlown">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
      <label for="planes">Describe your flight</label>
        <textarea class="flightDescription" v-model="descriptionBound"></textarea>
        <br/>
        <button type="submit">Submit Entry</button>
    </form>
    <div class="ratingsEarned">
      <div v-if="this.earnedPrivate">
        <p>Congratulations! You've logged enough hours for your private license! Schedule your exam and checkride at the front office!</p>
      </div>
      <div v-else>
        <p>You have {{this.$root.hoursToPrivate}} hours to go before you can take your private license exam.</p>
      </div>
      <div v-if="this.earnedCommercial">
        <p>Congratulations! You've logged enough hours for your commercial license! Schedule your exam and checkride at the front office!</p>
      </div>
      <div v-else>
        <p>You have {{this.$root.hoursToCommercial}} hours to go before you can take your commercial license exam.</p>
      </div>
      <div v-if="this.earnedMulti">
        <p>Congratulations! You've logged enough twin hours for your multi-engine rating!</p>
      </div>
      <div v-if="this.earnedHighPerformance">
        <p>Congratulations! You've logged enough hours for your high-performance rating!</p>
      </div>
    </div>
    <div v-for='entry of entries' :key="entry.entryID">
      <div id=hours-aircraft>
          <p class="logbook-entry-header">{{entry.aircraftID}} -- {{entry.numHours}} hours </p>
      </div>
      <p> {{entry.description}} </p>
      <button @click="deleteEntry(entry)">Delete Entry</button>
    <hr class="break">
    </div>
  </div>
</template>

<script>
export default {
  name: "Logbook",
  data: function() {
    return {
      aircraft: "",
      hoursFlown: 0,
      descriptionBound: ""
    };
  },
    computed: {
      entries: function() {
        return this.$root.$data.logbookEntries;
      },
      earnedPrivate: function() {
        if(this.$root.totalHours >= 40) {
          return true;
        }
        else {
          return false;
        }
      },
      earnedCommercial: function() {
        if(this.$root.totalHours >= 250) {
          return true;
        }
        else {
          return false;
        }
      },
      earnedMulti: function() {
        if(this.$root.multiEngineHours > 10) {
          return true;
        }
        else {
          return false;
        }
      },
      earnedHighPerformance: function() {
        if(this.$root.highPerformanceHours > 10) {
          return true;
        }
        else {
          return false;
        }
      },
    },
  components: {
  },
  methods: {
    logbookSubmit() {
      this.$root.$data.numLogEntries++;
      console.log(this.hoursFlown + "hours flown");
      this.entries.unshift({
        entryID: (this.$root.$data.numLogEntries + 1),
        aircraftID: this.aircraft,
        numHours: parseInt(this.hoursFlown),
        description: this.descriptionBound
      });
    },
    deleteEntry(entry) {
      let index = this.$root.$data.logbookEntries.indexOf(entry);
      this.$root.$data.logbookEntries.splice(index,1);
    }
  }
};


</script>

<style>
  .about{
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .break {
    color: #123356;
  }

  .logbook-entry-header {
    font-size:2em;
    font-family: "Helvetica";
  }
</style>