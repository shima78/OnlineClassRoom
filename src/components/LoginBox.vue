<template>
  <div id="generate-class-box">
    <div id="generate-class-form">
      <div id="flamingo-image">

      </div>




          <input id="username" class="input-bar text" v-model="username" placeholder="Username" autocomplete="off" name="username">
          <input id="roomid" class="input-bar text" v-model="roomID" placeholder="room ID" autocomplete="off" name="roomid">
          <input id="password" class="input-bar text" v-model="password" placeholder="Password" autocomplete="off" name="password" type="password">
          <button id="meet-enter-button" @click="loginInit" type="submit" > Enter Meeting </button>





      </div>
    </div>
</template>



<script>
// eslint-disable-next-line no-unused-vars
import io from 'socket.io-client';
// eslint-disable-next-line no-unused-vars
import uuid from "uuid";
import router from "@/router";


export default {
  name: "LoginBox",
  components: {

  },
  data(){
    return {
      username: "",
      password: "",
      roomID:null,
      SERVER: null,
      address: 'ws://localhost:3000',
      role: null,
      usid: null //unique socket id

    }
  },
  methods: {

    loginInit: function (){

          this.SERVER = io(this.address);
          const socket = this.SERVER;


      socket.emit('login',{name: this.username,pass:this.password, room: this.roomID})

      socket.on("loginRes",(data)=>{
        console.log(data)
        if(data==400){
          console.log("wrong") //login data handling
        }
        else{
          this.usid = data.socketID;
          this.role = data.role;
          socket.emit('joinRoom', {username: this.username, room: this.roomID , isCreator: false});
          router.push({name: "Meeting", params: {socket: this.SERVER, token: "1"}});
          console.log("" +
              "we have:" +
              this.usid + '\n\n' + "also: " +this.role)
        }
      })
      //Login pass then socket





    }
  }
}
</script>
<style src="../style/loginRadio.css"></style>
<style scoped>
#generate-class-box{
  height: 100%;
  width: 100%;
}
#generate-class-form{
  display: grid;
  grid-template-rows: minmax(100px,auto) repeat(2,40px) minmax(0px,40px) 40px;
  row-gap: 16px;
  grid-template-columns: minmax(100px,1fr) 120px;

  height: 100%;
  overflow: hidden;
}
.input-bar{
  margin-right: 10px;
  margin-left: 10px;

  border-radius: 18px;
  padding-left: 8px;
  padding-right: 8px;

  border-width: 0px;
  background-color: #222222;
  box-shadow:  7px 7px 14px #0e0e0e,
  -7px -7px 14px #141414;
  transition-duration: 0.01s;

  grid-column: 1/3;

}

.text{
  font-size: 16px;
  font-weight: 7;
  font-family: "Poppins",sans-serif;
  font-weight: 300;
  color: #7389a9;
}
.input-bar:focus{
  font-weight: 7;
  border-width: 0px;
  color: #bbbbbb;
  outline: none;


  border-bottom-width: 2px;
  border-bottom-color: #cf525c;
  transition-duration: 0.01s;


}




button{
  margin-left: 10px;
  margin-right: 10px;


  border-radius: 18px;

  background: linear-gradient(145deg, #ff7c74, #d86861);
  box-shadow:  7px 7px 14px #0f0f0f,
  -7px -7px 14px #131313;

  border: none;
  outline: none;

  color: white;
  font-family: "Poppins",sans-serif;
  font-size: 14px;
  font-weight: 300;


  transition-duration: 0.1s;

}

button:active{
  margin-top: -2px;
  margin-bottom: 2px;
  transition-duration: 0.1s;
  background: linear-gradient(145deg, #d86861, #ff7c74);


}


#link-gen-button{
  grid-row: 5;
  grid-column: 2/3;
}

#link-gen-out{

  grid-row: 5;
  grid-column: 1;
  margin-right: 10px;
  margin-left: 10px;



}



#class-name-input{
  grid-row: 2;
}


#user-name-input{
  grid-row: 3;
}

#flamingo-image{
  gird-row:1;
  grid-column: 1/3;

  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column-reverse;

}
#meet-enter-button{
  grid-column: 1/3;
  grid-row: 5;
}

</style>