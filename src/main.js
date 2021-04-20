import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import mock from "./mock-data";
import logbook from "./mock-data-logbook-entries";

Vue.config.productionTip = false;

let entryData = {
  aircraft: mock,
  name:"",
  logbookEntries: logbook,
  userID: '-1'
}

new Vue({
  router,
  data: entryData,
  computed: {
    totalHours: function() {
      let result = 0;
      for(const entry of this.logbookEntries) {
        result += entry.numHours;
      }
      return result;
    },
    highPerformanceHours: function() {
      let result = 0;
      for (const entry of this.logbookEntries){
        if(entry.aircraftID != "DA40" && entry.aircraftID != "DA20") {
            result += entry.numHours;
        }
      }
      return result;
    },
    multiEngineHours: function() {
      let result = 0;
      for (const entry of this.logbookEntries){
        if(entry.aircraftID == 'DA42' || entry.aircraftID == 'DA62') {
            result += entry.numHours;
        }
      }
      return result;
    },
    hasAchievedPrivate: function() {
      if(this.totalHours > 40) {
        return true;
      }
      else{
        return false;
      }
    },
    hasAchievedCommercial: function() {
      if(this.totalHours > 250) {
        return true;
      }
      else{
        return false;
      }
    },
    hoursToPrivate: function() {
      return 40 - this.totalHours;
    },
    hoursToCommercial: function() {
      return 250 - this.totalHours;
    },
    getUserID: function() {
      return this.$data.userID;
    }
  },
  render: (h) => h(App),
}).$mount("#app");
