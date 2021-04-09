<template>
  <div class="wrapper">
    <button @click="addTestLogEntries">Add Dummy Data</button>
    <button @click="updateEntries">Update Entries</button>
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
import axios from 'axios';
import logbook from "../mock-data-logbook-entries";
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
  created() {
      this.updateEntries();
  },
  methods: {

    async logbookSubmit() {
      try{
        this.entries.unshift({
        entryID: (this.$root.$data.numLogEntries + 1),
        aircraftID: this.aircraft,
        numHours: parseInt(this.hoursFlown),
        description: this.descriptionBound
      });
        let requestBody = {
            userID: this.$root.$data.userID,
            numHours: parseInt(this.hoursFlown),
            aircraftID: this.aircraft,
            description: this.descriptionBound
        }
        await axios.post(("/api/logbook/" + this.$root.$data.userID), requestBody);
        this.updateEntries();
      }
      catch(error){
        console.log(error);
      }
    },

    async deleteEntry(entry) {
      let index = this.$root.$data.logbookEntries.indexOf(entry);
      this.$root.$data.logbookEntries.splice(index,1);
      try{
        let apiString = ("/api/entries/" + this.$root.$data.userID + "/" + entry._id);
        await axios.delete(apiString);
      }
      catch(error){
        console.log(error);
      }
      this.updateEntries();
    },

    async updateEntries() {
      try{
        let entriesFromDB = await axios.get("/api/logbook/" + this.$root.$data.userID);
        this.$root.$data.logbookEntries = entriesFromDB.data;
      }
      catch(error){
        console.log(error);
      }
    },

    async addTestLogEntries() {
      try{
        let i = 0;
        for(i = 0; i < logbook.length; i++) {
            let requestBody = {
              userID: this.$root.$data.userID,
              numHours: parseInt(logbook[i].numHours),
              aircraftID: logbook[i].aircraftID,
              description: logbook[i].description
            }
            await axios.post("/api/logbook/" + this.$root.$data.userID, requestBody);
        }
      }
      catch(error) {
        console.log("error");
      }
      
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