<template>
  <div class="answer-bubble">
    <div class="top-wrapper">
    <div class="username-label-wrapper">
      <label class="username-label">
        {{username}}
      </label>
    </div>
    <div id="accept-reject-wrapper">
      <button class="accept-reject-button">
        <label>
          Reject
        </label>
      </button>
      <button class="accept-reject-button">
        <label>
          Accept
        </label>
      </button>
    </div>
    </div>
    <p class="answer-p">
      {{answerMessage}}
    </p>
    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; box-sizing: border-box;">
      <label class="time-label">
        {{time}}
      </label>
      <div style="display: flex; justify-content: space-around; align-items: center; box-sizing: border-box;">
        <button id="thickness-inc-low" class="round-button inc-button" @click="decScore">
          <i class="material-icons">remove</i>
        </button>
        <input type="text" class="score-input-bar" v-model="score" style="text-align: center">
        <button id="thickness-inc-high" class="round-button inc-button" @click="incScore" >
          <i class="material-icons">add</i>
        </button>
      </div>
    </div>



  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "answerBubble",
  data(){
    return{
      score: 0,
      role: null,
      server: null
    }
  },
  props:{
    username: String,
    answerMessage: String,
    time: String
  },
  methods:{
    incScore: function (){
      if(this.score < 20){
        this.score += 0.5;
      }
    },
    decScore: function (){
      if(this.score > 0){
        this.score -= 0.5;
      }
    },
    ...mapGetters(['getServer',"getRole"])

  },
  mounted() {
    this.server = this.getServer;
    this.role =  this.getRole;
  }
}
</script>

<style scoped>
.answer-bubble{

  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: flex-start;
  padding: 12px 12px 10px 12px;
  margin: 12px 14px 12px 14px;

  min-height: 10px;
  background-color: #e0e5ec;
  border-radius: 12px;

  box-shadow:  3px 3px 6px #bec3c9,
  -3px -3px 6px #ffffff;
}

.answer-p{
  font-size: 14px;
  margin-top: 8px;
  text-align: left;
  text-justify: inter-word;
  margin-left: 4px;
  margin-right: 1px;

   overflow-wrap: anywhere;
}
.time-label{
  font-size: 10px;
  margin-top: 2px;
  justify-self: right;
}
.username-label{
  font-size: 14px;
  color: #e0e5ec;
  font-weight: bold;
  text-overflow: ellipsis;
}
.username-label-wrapper{
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(145deg, #ff7c74, #d86861);;
  border-radius: 12px;
  padding: 4px 8px 4px 8px;
  max-width: 60%;
}

.score-input-bar{


  font-family: "Poppins",sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #7389a9;

  margin-right: 10px;
  margin-left: 10px;

  border-radius: 18px;
  padding-left: 12px;
  padding-right: 12px;

  border-width: 0px;
  background-color: #e0e5ec;
  width: 40px;
  -webkit-appearance: none;
  outline: none;

  box-shadow:  inset 1px 1px 2px #bec3c9,
  inset -1px -1px 2px #ffffff;


}
#thickness-inc-high, #thickness-inc-low{
  width: 16px;
  height: 16px;
}

#accept-reject-wrapper{
  min-height: 24px;
  max-height: 24px;
  width: 132px;
  display: flex;
  justify-content: center;
  align-items: center;


  box-shadow:   1px 1px 2px #bec3c9,
   -1px -1px 2px #ffffff;
  border-radius: 24px;
}

.accept-reject-button {
  height: 22px;
  width: 65px;
  margin: 2px;
  background-color: #e0e5ec;
  outline: none;
  border: none;
  border-radius: 24px;
  padding-bottom: 1px;
}

.accept-reject-button > label{
  font-size: 12px;
  font-weight: 400;
}

.accept-reject-button:active{
  box-shadow:  inset 1px 1px 2px #bec3c9,
  inset -1px -1px 2px #ffffff;

}

.top-wrapper{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

</style>