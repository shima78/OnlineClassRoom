<template>
    <div id="nav-bar">
          <div id="media-control">
            <input type="checkbox" class="toggle-button check-box" id="speaker">
            <input type="checkbox" class="toggle-button check-box" id="microphone">
            <input type="checkbox" class="toggle-button check-box" id="video">
            <input type="range" id="volume-slider" class="slider">
          </div>

          <div id="exit-export">
            <button id="exit-button" class="round-button" @click="exit">
              <i class="material-icons">power_settings_new</i>
            </button>

            <button id="export-button" class="round-button" @click="output" :disabled="role === 'std'" v-if="role === 'owner'">
              <label>Export</label>
            </button>
          </div>
    </div>
</template>

<script>


import {mapActions, mapGetters} from "vuex";
import * as Papa from 'papaparse';
export default {
  name: "MeetingNavbar",
  components: {

  },
  data(){
    return{
        server: null,
        role: null,
    }
  },

  methods: {
    ...mapGetters(['getServer','getRole']),
    ...mapActions(['updateUsersData']),

    output: function (){
      this.server.emit('export')

    },
    exit: function (){
      this.server.emit('logOut');
      this.$router.back();

    },
    init: function (){
      this.server.on("roomUsers", (userdata) => {
        this.updateUsersData(userdata.users);
      });

      this.server.on("exportData", (data) => {
        // console.log(data)
        let usersText = Papa.unparse(data['users']);
        let usersFilename = 'users.csv';
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(usersText));
        element.setAttribute('download', usersFilename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        let questionsText = Papa.unparse(data['questions']);
        let questionsFilename = 'questions.csv';
        // let element = document.createElement('a');
        element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(questionsText));
        element.setAttribute('download', questionsFilename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        let messagesText = Papa.unparse(data['messages']);
        let messagesFilename = 'messages.csv';
        // let element = document.createElement('a');
        element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(messagesText));
        element.setAttribute('download', messagesFilename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      });
    }



  },
  mounted() {
      this.server =  this.$store.getters.getServer;
      this.role = this.$store.getters.getRole;
      this.init();

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


#exit-export{
  flex-direction: row-reverse;
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
}
#exit-button{

  margin-left: 15px;
  margin-right: -1px;
}



#speaker{
  margin-left: -1px;
  margin-right: 10px;
}
#microphone{
  margin-right: 10px;
}
#video{
  margin-right: 10px;
}

#video:after{
  content: '\e04b';
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

#export-button{
  width: 80px;
}

#export-button > label{
  font-weight: bold;
  font-size: 14px;
}



</style>