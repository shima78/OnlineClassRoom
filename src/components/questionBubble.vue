<template>
  <div class="question-bubble">
    <div class="question-label-wrapper" style="min-width: 100%;">
      <label class="question-label"> Question {{questionIndex}}</label>
      <button class="round-button question-bubble-round-button" @click="getAnswers">view answers</button>
    </div>

    <div class="question-body-wrapper" style="min-width: 100%; box-sizing: border-box;">
      <p class="question-p">
        {{questionText}}
      </p>
      <div class="question-lower-bar" style="width: 100%;">
        <label class="level-label">Level {{level}}</label>
        <div class="question-time-ans-box">
            5 A<br>
          {{time}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "questionBubble",
  data(){
    return{
        qid: null,
      serve: null,
      answerArray: new Array()
    }
  },
  props:{
    questionIndex: Number,
    questionText: String,
    time: String,
    level: Number
  },
  mounted() {
    this.qid = this.questionIndex;
    this.server = this.$store.getters.getServer;
    this.server.on("answersArray", (data) => {
      this.updateCurrentAnswers(data);


    });

  },
  methods:{
    ...mapGetters(['getServer']),
    ...mapActions(['updateCurrentAnswers']),
    getAnswers: function (){

      this.server.emit('getAnswers',this.qid)
    }

  }
}
</script>

<style scoped>

.question-label{
  font-size: 14px;
  color: #e0e5ec;
  font-weight: bold;
}
.question-bubble{
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: flex-start;
  box-sizing: border-box;
  margin: 12px 14px 12px 14px;


  background-color: #e0e5ec;
  border-radius: 12px;

  box-shadow:  3px 3px 6px #bec3c9,
  -3px -3px 6px #ffffff;
}

.question-time-ans-box{
  display: block;
  line-height: 10px;
  font-family: "Poppins",sans-serif;
  font-size: 10px;
  font-weight: 200;
  color: #7389a9;

}

.question-p{
  font-size: 14px;
  margin-top: 8px;
  text-align: left;
  text-justify: inter-word;
  margin-left: 7px;
  margin-right: 4px;


  overflow-wrap: normal;
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
}
.username-label-wrapper{
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(145deg, #ff7c74, #d86861);;
  border-radius: 12px;
  padding: 4px 8px 4px 8px;
}
.question-label-wrapper{
  box-sizing: border-box;
  width: 100%;
  min-height: 20px;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ff7c74;
  border-radius: 12px 12px 0px 0px;
  padding: 4px 8px 4px 8px;
}

.question-bubble-round-button{
  width: 100px;
  height: 20px;
  box-shadow:  2px 2px 4px #d96963,
  -2px -2px 4px #ff8f85;

  font-family: "Poppins",sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #7389a9;
}

.question-bubble-round-button:active{
  color: #ff7c74;
  box-shadow: inset 2px 2px 4px #bec3c9,
  inset -2px -2px 4px #ffffff;
}
.question-body-wrapper{
  padding: 12px 12px 10px 12px;

}
.question-lower-bar{
  display: flex;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
}
.level-label{
  font-weight: bold;
  font-size: 11px;
}

</style>