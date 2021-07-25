<template>
    <div id="nav-bar">
          <div id="media-control">
            <input type="checkbox" class="toggle-button check-box" id="speaker">
            <input type="checkbox" class="toggle-button check-box" id="microphone">
            <input type="range" id="volume-slider" class="slider">
          </div>

          <div id="exit">
            <button id="exit-button" class="round-button" @click="exit">
              <i class="material-icons">power_settings_new</i>
            </button>
          </div>

          <div id="export-users" v-if=" true" >
            <button id="export-users-button" class="round-button" @click="exportData">
              export users
            </button>
          </div>

      </div>
</template>

<script>
import {mapActions} from "vuex";
import * as Papa from 'papaparse';
export default {
  name: "MeetingNavbar",
  components: {},
  data(){
    return{
    server:this.$store.getters.getServer,
      userRole: this.$store.getters.getRole
    }
  },

  methods: {
    exportData(){
        this.server.emit('export')
    },

    exit() {
      this.server.emit('logOut')
      this.$router.back()

    },
      ...mapActions(['updateUsersData']),

    },

  mounted() {
    console.log("role",this.userRole)
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