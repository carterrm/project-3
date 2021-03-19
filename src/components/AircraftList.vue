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
                        <button class="auto" @click="markFavorite(plane)">Add 1 hour reservation</button>
                        <p class='reserved successfully' v-show='plane.hoursBooked > 0'>Reservation successful! You have {{plane.hoursBooked}} hours reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default{
    name: 'AircraftList',
    props: {
        aircraftList:Array
    },   //props: is like the constructor- defines the variables we expect to come in
    methods: {
        markFavorite(plane) {
            plane.hoursBooked++;
        }
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