<template>
    <div id="nav-bar">
          <div id="media-control">
            <input type="checkbox" class="toggle-button check-box" id="speaker">
            <input type="checkbox" class="toggle-button check-box" id="microphone">
            <input type="range" id="volume-slider" class="slider">
          </div>

          <div id="exit">
            <button id="exit-button" class="round-button">
              <i class="material-icons">power_settings_new</i>
            </button>
          </div>
    </div>
</template>

<script>

export default {
  name: "MeetingNavbar",
  components: {},
  data(){
    return{

    }
  },

  methods: {

  },
  mounted() {

  }
}
</script>
<style src="../style/neuMeet.css"></style>
<style scoped>
#nav-bar{
  display: flex;
  justify-content: space-between;
  align-content: center;
  margin: 24px 40px 6px 40px;
  padding: 0px 10px;


  min-height: 50px;
  max-height: 50px;
  border-radius: 24px;
  z-index: 2;

  background: #e0e5ec;
  box-shadow:  5px 5px 10px #bec3c9,
  -5px -5px 10px #ffffff;


}

#media-control{
  display: flex;
  justify-content: space-around;
  align-content: center;
  align-items: center;
}


#exit{
  display: flex;
  justify-content: space-around;
  align-content: center;
  align-items: center;
}
#exit-button{


  margin-right: -2px;
}



#speaker{
  margin-left: -1px;
  margin-right: 10px;
}
#microphone{
  margin-right: 10px;
}

#volume-slider{

    margin-right: 10px;
}

#speaker:after{
  content: "\e050";
}

#microphone:after{
  content: "\e029";
}



</style>