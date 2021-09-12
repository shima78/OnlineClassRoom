<template>
  <div id="generate-class-box">
    <div id="generate-class-form">
      <div id="flamingo-image-div">
        <img src="../assets/flamingo-art.svg" id="flamingo-image">
      </div>


      <input id="username" class="input-bar text" v-model="username" placeholder="Username" autocomplete="off"
             name="username" maxLength="32">
      <input id="roomid" class="input-bar text" v-model="roomID" placeholder="room ID" autocomplete="off" name="roomid"
             maxLength="32">
      <input id="password" class="input-bar text" v-model="password" placeholder="Password" autocomplete="off"
             name="password" type="password" maxLength="64">
      <button class="meet-enter-button" @click="loginInit"> Enter Meeting</button>
      <button id="meet-enter-button" @click="loginInit"> Guest</button>

    </div>
  </div>
</template>


<script>
// eslint-disable-next-line no-unused-vars
import io from 'socket.io-client';
// eslint-disable-next-line no-unused-vars
import uuid from "uuid";
import router from "@/router";
// eslint-disable-next-line no-unused-vars
import {store} from "@/store/store";
// eslint-disable-next-line no-unused-vars
import {mapGetters, mapActions} from 'vuex';
import jwt_decode from 'jwt-decode'


export default {
  name: "LoginBox",
  components: {},
  data() {
    return {
      parent: this,
      username: "",
      password: "",
      roomID: null,
      SERVER: null,
      address: 'ws://localhost:3000',
      role: null,
      usid: null,//unique socket id,
      userArray: []
    }
  },
  methods: {

    ...mapActions(['updateUsersData']),
    loginInit: async function () {

      this.SERVER = await io(this.address);
      const socket = this.SERVER;
      this.$store.commit('setServer', socket);
      console.log('login data: ', {name: this.username, pass: this.password, room: this.roomID})
      socket.emit('login', {name: this.username, pass: this.password, room: parseInt(this.roomID)})

      await socket.on("loginRes", (data) => {
        console.log("login", data)
        if (data == 400) {
          // this.$toast.error("Wrong Credentials", {
          //   toastClassName: "my-custom-toast-class",
          //   position: "top-left",
          //   timeout: 5000,
          //   closeOnClick: true,
          //   pauseOnFocusLoss: true,
          //   pauseOnHover: true,
          //   draggable: true,
          //   draggablePercent: 0.6,
          //   showCloseButtonOnHover: false,
          //   hideProgressBar: false,
          //   closeButton: "button",
          //   icon: true,
          //   rtl: false
          // });
          // console.log("wrong") //login data handling
        } else {
          let decoded = jwt_decode(data);
          console.log(decoded)
          socket.emit('joinRoom', ({
            username: decoded.usr.username,
            room: this.roomID,
            role: decoded.usr.userRole,
            userID: decoded.usr.userID
          }));
          console.log('login data', {
            username: decoded.usr.username,
            room: this.roomID,
            role: decoded.usr.userRole,
            userID: decoded.usr.userID
          })
          this.$store.commit('setRoomID', decoded.usr.id);
          this.$store.commit('setRole', decoded.usr.userRole)
          this.$store.commit('setUsername', decoded.usr.username);
          this.$store.commit('setUserID', decoded.usr.userID);


          this.SERVER.on("roomUsers", (userData) => {
            console.log('ROOMUSERS IS ACTUALLY RUNNING', userData.users);
            this.updateUsersData(userData.users);
          });


          router.push({name: "Meeting", params: {isPush: true}});

        }
      })
      //Login pass then socket
    }

  }

}
</script>
<style src="../style/loginRadio.css"></style>
<style scoped>
#generate-class-box {
  height: 100%;
  width: 100%;
}

#generate-class-form {
  display: grid;
  grid-template-rows: minmax(100px, auto) repeat(2, 40px) minmax(0px, 40px) 40px;
  row-gap: 16px;
  grid-template-columns: minmax(100px, 1fr) 120px;

  height: 100%;
  overflow: hidden;
}

.input-bar {
  margin-right: 10px;
  margin-left: 10px;

  border-radius: 18px;
  padding-left: 8px;
  padding-right: 8px;

  border-width: 0px;
  background-color: #222222;
  box-shadow: 7px 7px 14px #0e0e0e,
  -7px -7px 14px #141414;
  transition-duration: 0.01s;

  grid-column: 1/3;

}

.text {
  font-size: 16px;
  font-weight: 7;
  font-family: "Poppins", sans-serif;
  font-weight: 300;
  color: var(--text-color);
}

.input-bar:focus {
  font-weight: 7;
  border-width: 0px;
  color: #bbbbbb;
  outline: none;


  border-bottom-width: 2px;
  border-bottom-color: #cf525c;
  transition-duration: 0.01s;


}


button {
  margin-left: 10px;
  margin-right: 10px;


  border-radius: 18px;

  background: var(--accent-gradiant);
  box-shadow: 7px 7px 14px #0f0f0f,
  -7px -7px 14px #131313;

  border: none;
  outline: none;

  color: white;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 400;


  transition-duration: 0.1s;

}

button:active {
  margin-top: -2px;
  margin-bottom: 2px;
  transition-duration: 0.1s;
  background: linear-gradient(145deg, #d86861, var(--accent-color));


}


#link-gen-button {
  grid-row: 5;
  grid-column: 2/3;
}

#link-gen-out {

  grid-row: 5;
  grid-column: 1;
  margin-right: 10px;
  margin-left: 10px;


}


#class-name-input {
  grid-row: 2;
}


#user-name-input {
  grid-row: 3;
}

#flamingo-image-div {
  gird-row: 1;
  grid-column: 1/3;
  background-repeat: no-repeat;
  justify-items: center;


}

#flamingo-image {
  margin: 60px;
  margin-right: -10px;
  margin-top: -10px;
}

.meet-enter-button {
  grid-column: 1/2;
  grid-row: 5;
}


</style>