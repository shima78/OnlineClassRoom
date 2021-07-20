<template>
  <div class="answer-bubble">
    <div class="username-label-wrapper">
      <label class="username-label">
        {{username}}
      </label>
    </div>
    <p class="answer-p">
      {{answerMessage}}
    </p>
    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; box-sizing: border-box;">
      <label class="time-label">
        {{time}}
      </label>
      <div style="display: flex; justify-content: space-around; align-items: center; box-sizing: border-box;">
        <button id="answer-score-inc-low" class="round-button inc-button">
          <i class="material-icons">remove</i>
        </button>
        <input type="text" class="score-input-bar">
        <button id="answer-score-inc-high" class="round-button inc-button">
          <i class="material-icons">add</i>
        </button>
      </div>
    </div>



  </div>
</template>

<script>
export default {
  name: "answerBubble",
  data(){
    return{

    }
  },
  props:{
    username: String,
    answerMessage: String,
    time: String,
    score: Number,
    role: String
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
#answer-score-inc-high, #answer-score-inc-low{
  width: 16px;
  height: 16px;
}


</style>