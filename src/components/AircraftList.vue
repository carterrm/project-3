<template>
    <div class='wrapper'>
        <div v-for='plane in aircraftList' :key="plane.id">
            <div class='fleet-plane'>
                <img :src="'/images/' + plane.id + '.jpg'" class='plane-image'>
                 <div class='plane-text'>
                    <p class='plane-header'>{{plane.name}}</p>
                    <p class='plane-description'>This marvel of engineering has {{plane.seats}} seats for you and yours.</p>
                    <p class='plane-description'>With {{plane.engines}} engine(s) with {{plane.horsepower}} horsepower each, the {{plane.name}} will get you where you need to go at speeds of up to {{plane.speed}} knots to distances of up to {{plane.range}} NM!</p>
                    <div class='plane-button-holder'>
                        <button class="auto" @click="incrementHoursReserved(plane)">Add reservation</button>
                        <button class="auto" @click="decrementHoursReserved(plane)">Remove 1 hour reservation</button>
                        <p class='reserved successfully' v-show='plane.hoursBooked > 0'>Reservation successful! You have {{plane.hoursBooked}} hours reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default{
    name: 'AircraftList',
    props: {
        aircraftList:Array
    },   //props: is like the constructor- defines the variables we expect to come in
    data() {
    return {
      reservations: [],
    }
  },

  created() {
      this.getReservations(this.$root.$data.userID);
      console.log(this.reservations);
  },
    
    methods: {
        async incrementHoursReserved(plane) {
            plane.hoursBooked++;
            try {
                axios.put(`/api/reservations/edit/`, {
                    userID: this.$root.$data.userID,
                    aircraftID: plane.id,
                    hoursReserved: plane.hoursBooked
                 });
            this.getReservations(this.$root.$data.userID);
            } catch (error) {
                console.log(error);
            }
        },
        async decrementHoursReserved(plane) {
            if(plane.hoursBooked > 0) {
                plane.hoursBooked--;
                try {
                axios.put(`/api/reservations/edit/`, {
                    userID: this.$root.$data.userID,
                    aircraftID: plane.id,
                    hoursReserved: plane.hoursBooked
                 });
                this.getReservations();
                }
                catch (error) 
                {
                    console.log(error);
                }
            }
        },
        updateAircraftReservations() {
            let response = this.reservations;
            let i = 0;
                for (i = 0; i < response.length; i++) {
                    let j = 0;
                    for (j = 0; j < this.aircraftList.length; j++) {
                        if(response[i].aircraftID == this.aircraftList[j].id) {
                            this.aircraftList[j].hoursBooked = response[i].numHours;
                        }
                    }
                }
        },

        //TODO Something in this chain of command is being funky & not updating properly- Mongo's right, the client's one added hour behind. Removing hours seems to work, though
        async getReservations() {
            let response = 0;
            let userID = this.$root.$data.userID
            try {
                response = await axios.get("/api/reservations/" + userID);
                this.reservations = response.data;
            } catch (error) {
                console.log(error);
            }
            this.updateAircraftReservations();
        },
    
    }
}
</script>

<style>
.fleet-plane {
    display: flex;
    flex-direction:column;
    align-items: center;
    margin:20px;
    text-align:center;
}

.plane-text {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.plane-image {
    max-width:100%;
    height:auto;
}

.plane-header {
    font-family: "Montserrat";
    font-size:2em;
    margin-top:2%
}

.plane-description {
    font-family: "Roboto";
}

/*Desktop styles below*/
@media only screen and (min-width: 1000px) {
    .fleet-plane {
        flex-direction: row;
        justify-content: center;
        margin:20px;
    }

    .plane-image {
        margin-right:50px;
        max-width: 600px;
    }

    .plane-header {
        font-size: 4em;
    }

    .plane-description {
        font-size: 20px;
    }
}

</style>