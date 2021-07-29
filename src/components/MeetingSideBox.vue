<template>
  <div id="side-box" class="box">
    <div id="tab-buttons" class="radio-wrapper">
      <button id="chat-button" class="tab-button" name="tab1" value="chat" v-on:click=" selected = 1">
        <i class="material-icons">chat</i>
      </button>
      <button id="list-button" class="tab-button" name="tab2" value="attend" v-on:click="selected = 2">
        <i class="material-icons">format_list_bulleted</i>
      </button>
      <button id="question-button" class="tab-button" name="tab3" value="question" v-on:click="selected = 3">
        <i class="material-icons">quiz</i>
      </button>
    </div>
    <div id="chatList" class="side-box-v-container" v-if="selected === 1">
      <div id="chat-message-box" class="side-shadow-container">
        <vue-scroll>
          <template v-for="messageOBJ in this.messagesArray">
            <chat-bubble :key="messageOBJ.index" :username="messageOBJ.username" :message="messageOBJ.message" :time="messageOBJ.time"></chat-bubble>
          </template>
        </vue-scroll>
      </div>

      <div id="chatMessageEntry" >
        <input id="chatMessageInput" type="text" class="input-bar" v-model="chatEntryText">
        <button id="send-button" class="round-button pink-button" @click="sendMessage">
          <i class="material-icons">send</i>
        </button>
      </div>
    </div>
    <div id="attendList" class="side-box-v-container" v-if="selected === 2">
      <div class="attend-list-box side-shadow-container">
        <vue-scroll>
          <template v-for="userOBJ in userInfo[0].filter(user => user.online == true)">
            <user-bubble :key="userOBJ.index" :username="userOBJ.username"
                         :join-time="userOBJ.joinTime" :status="userOBJ.online"
                         :user-role="userOBJ.role"
                         :socket-i-d="userOBJ.socketID"
            ></user-bubble>
          </template>
        </vue-scroll>
      </div>
      <div v-show="newGuest.exists" v-if="this.getRole() === 'owner'" style="display: flex; flex-direction: column; width: calc(100% - 20px); height:  margin-left:
      10px; margin-right: 10px; box-sizing: border-box; margin-top: 10px;">
        <div style="height: 40px">
          <label>User {{this.newGuest.username}} has requested to enter the room at {{this.newGuest.time}}</label>
        </div>
        <div class="guest-button-holder" style="display: flex; flex-direction: row; justify-content: space-evenly; ">
          <button class="question-bubble-round-button round-button guest-button">Accept</button>
          <button class="question-bubble-round-button round-button guest-button">Reject</button>
        </div>

      </div>
    </div>
    <div id="question-list" class="side-box-v-container" v-if="selected === 3">
      <div id="question-entry" class="side-shadow-container">
        <div style="width: 100%; box-sizing: border-box;">
          <!-- <div class="question-label-wrapper">
             <label class="question-label">
               Question
             </label>
           </div> -->
          <textarea id="question-entry-input" class="input-bar scrollable" rows="6" v-model="questionEntryText">
            </textarea>
        </div >
        <div id="question-input-action-wrapper">
          <div style="display: flex; flex-direction: row;justify-content: space-between; align-items: center; margin-right: 30px">
            <template v-if="role === 'owner'">
              <button id="question-hard-inc-low" class="round-button inc-button"   @click="decDifficulty" >
                <i class="material-icons">remove</i>
              </button>
              <input type="checkbox" class="slider-check-box" v-model="this.questionDifficulty.checkBoxBind" disabled="true" value=1>
              <input type="checkbox" class="slider-check-box" v-model="this.questionDifficulty.checkBoxBind" disabled="true" value=2>
              <input type="checkbox" class="slider-check-box" v-model="this.questionDifficulty.checkBoxBind" disabled="true" value=3>
              <input type="checkbox" class="slider-check-box" v-model="this.questionDifficulty.checkBoxBind" disabled="true" value=4>
              <input type="checkbox" class="slider-check-box" v-model="this.questionDifficulty.checkBoxBind" disabled="true" value=5>
              <button id="question-hard-inc-high" class="round-button inc-button"   @click="incDifficulty">
                <i class="material-icons">add</i>
              </button>
            </template>
            <template v-if="role === 'std' || role ==='presenter'">
              <button id="qid-selector-left" class="round-button inc-button"  @click="lastQuestionSelect">
                <i class="material-icons">chevron_left</i>
              </button>
              <input type="text" class="input-bar" v-model="qid" style="height: 30px; width: 100%; text-align: center;" placeholder="Question Number"  disabled>
              <button id="qid-selector-right" class="round-button inc-button"   @click="nextQuestionSelect">
                <i class="material-icons">chevron_right</i>
              </button>
            </template>

          </div>
          <button id="question-send-button" class="pink-button" @click="askQuestion" v-if="role === 'owner'"> Ask </button>
          <button id="answer-send-button" class="pink-button" @click="answerQuestion" v-if="role === 'std' || role === 'presenter'"> Answer </button>

        </div>
      </div>
      <div id="question-box" class="side-shadow-container">

        <vue-scroll>
          <template v-for="questionOBJ in this.questionArray">
            <question-bubble :key="questionOBJ.index" :question-index="questionOBJ.id" :question-text="questionOBJ.text"
                             :time="questionOBJ.time" :level="questionOBJ.difficulty" :answer-count="questionOBJ.answers.length">
            </question-bubble>
          </template>
        </vue-scroll>

      </div>

      <div id="answer-box" class="side-shadow-container">
        <vue-scroll>
          <template v-for="object in currentAnswers[0]">
            <answer-bubble :key="object.index" :answer-message="object.text"
                           :username="object.username" :qid="parseInt(object.qid)"
                           :time="object.time" :score="object.score"
                           :accept="object.isAccepted" :answer-i-d="object.id"
            ></answer-bubble>
          </template>
        </vue-scroll>
      </div>
    </div>

  </div>
</template>

<script>
import ChatBubble from "@/components/chatBubble";
import UserBubble from "@/components/userbubble";
import QuestionBubble from "@/components/questionBubble";
import AnswerBubble from "@/components/answerBubble";
// eslint-disable-next-line no-unused-vars
import {mapActions, mapGetters} from "vuex";

export default {
  name: "MeetingSideBox",
  // eslint-disable-next-line vue/no-unused-components
  components: { AnswerBubble, QuestionBubble, UserBubble, ChatBubble},
  data() {
    return {
      chatButton: null,
      listButton: null,
      questionButton: null,
      selected: 1,
      chatEntryText: null,
      questionEntryText: "",
      messagesArray: new Array(),
      questionDifficulty: {currentValue: 1, checkBoxBind: [1]},
      questionArray: new Array(),
      answerArray: null,
      role: null,
      qid: 0,
      username: null,
      newGuest: {
        exists: 0,
        name: "Dwadawdwadwd",
        time: "19:81 pm"
      }
    }
  },
  methods:{
    ...mapActions(['updateUsersData']),
    ...mapGetters(['getRole','getUsername',"getUserData"]),
    init: function () {




      //login inti
      this.answerArray =  this.questionArray.map(q => q.answers);

      this.username = this.$store.getters.getUsername;
      this.role = this.$store.getters.getRole;
      this.chatButton = document.getElementById("chat-button");
      this.listButton = document.getElementById("list-button");
      this.questionButton = document.getElementById("question-button");

      //events
      this.SERVER.on("message", (message) => {
        let today = new Date();
        this.messagesArray.push({
          username: message.username,
          message: message.text,
          time: today.getHours() + ":" + today.getMinutes(),
          index: this.messagesArray.length
        });

      });
      this.SERVER.on("roomUsers", (userdata) => {
        this.updateUsersData(userdata.users);
      });

      //getting question!!
      this.SERVER.on("newQuestion", (newQuestion) => {
        this.questionArray = newQuestion;

      });

      //get answers back
      this.SERVER.on("answer",(answerData) =>{

        this.questionArray = answerData;

      })

      //answerAccept
      this.SERVER.on("newAccept",(acceptData)=>{
        this.updateUsersData(acceptData)
      })

      //answerScore
      this.SERVER.on("newScore",(scoreData)=>{
        console.log('NewscoreData',scoreData)
        this.updateUsersData(scoreData)
      })

      //promoteUser
      this.SERVER.on("newRole",data =>{
        this.updateUsersData(data)
      })

    },
    sendMessage : function (){
      if(this.chatEntryText =="") {
        return;
      }
      else{

        this.SERVER.emit("chatMessage",this.chatEntryText);
        this.chatEntryText="";
      }
    },
    incDifficulty:  function (){
      if(this.questionDifficulty.currentValue < 5){
        this.questionDifficulty.currentValue += 1;
        this.questionDifficulty.checkBoxBind.push(this.questionDifficulty.currentValue);
        console.log("checkbox" + this.questionDifficulty.checkBoxBind)
      }
    },
    decDifficulty: function (){
      if(this.questionDifficulty.currentValue > 1){
        this.questionDifficulty.currentValue -= 1;
        this.questionDifficulty.checkBoxBind.pop();
        console.log("checkbox" + this.questionDifficulty.checkBoxBind)
      }
    },
    askQuestion: function (){
      //TODO
      if(this.questionEntryText == "") {
        console.log('empty text')
        return;
      }
      else{

        let questionSendData = {
          text: this.questionEntryText,
          difficulty: this.questionDifficulty.currentValue
        }
        console.log('sending question to server',questionSendData)
        //sending Question!
        this.SERVER.emit('chatQuestions',questionSendData);
      }
    },
    answerQuestion: function (){
      if(this.questionEntryText == "") {
        console.log('empty text')
        return;
      }else{
        console.log('sending answer to server')
        let answerData = {
          username: this.username,
          text: this.questionEntryText,
          qid: this.qid
        }
        //sending Answers!
        this.SERVER.emit('chatAnswer',answerData);

      }
    },
    lastQuestionSelect: function (){
      let questionList = this.questionArray.map(x => x.id);
      console.log(questionList,this.qid-1)
      if(questionList.includes(this.qid - 1)){
        this.qid = this.qid - 1;
      }
    },
    nextQuestionSelect: function (){
      let questionList = this.questionArray.map(x => x.id);
      if(questionList.includes(this.qid+1)){
        this.qid = this.qid + 1;
      }

    },
  },
  mounted() {
    this.init();
  },
  computed :{
    userInfo(){
      return this.$store.getters.getUserData;
    },
    SERVER(){
      return this.$store.getters.getServer;
    },
    currentAnswers(){
      return this.$store.getters.getCurrentAnswerArray;
    }

  }
}
</script>
<style src="../style/neuMeet.css"></style>
<style scoped>
#side-box{
  width: 450px;
  height: 100%;
  max-height: 100%;
  max-width: 100%;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 60px  1fr ;
}
.side-box-v-container{
  display: grid;
  margin: 20px 10px 10px;
  border-radius: 24px;
}
#question-button{
  grid-row: 1;
  grid-column: 3;
}
#list-button{
  grid-row: 1;
  grid-column: 2;
}
#chat-button{
  grid-row: 1;
  grid-column: 1;
}
#chatList{
  grid-template-columns: 100%;
  grid-template-rows: 1fr 60px;
}
#chatMessageEntry{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#chatMessageInput{
  border-radius: 24px;
  width: calc(100% - 60px);
  height: 40px;
}
.pink-button{
  background-color: #ff7c74;
  box-shadow:  3px 3px 6px #bec3c9,
  -3px -3px 6px #ffffff;
  margin-right: 8px;
  border-radius: 100px;
}
.pink-button:active{
  background-color: #e0e5ec;
  box-shadow:  inset 3px 3px 6px #bec3c9,
  inset -3px -3px 6px #ffffff;
  margin-right: 8px;
  border-radius: 100px;
  color: #ff7c74;
}
#send-button:active{
  background: #e0e5ec;
  box-shadow: inset 3px 3px 6px #bec3c9,
  inset -3px -3px 6px #ffffff;
}
#send-button > i{
  color: #e0e5ec;
}
#send-button:active > i{
  color: #ff7c74;
}
.input-bar{
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
  box-shadow:  inset 4px 4px 8px #c5cad0,
  inset -4px -4px 8px #fbffff;
  -webkit-appearance: none;
  outline: none;
}
#question-list{
  grid-template-columns: auto;
  grid-template-rows: 190px 1fr 1fr;
}
#question-entry{
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: space-between;
  padding-right: 0px;
  padding-left: 0px;
  padding-bottom: 10px;
  border-radius: 0px;
  box-shadow: none;
}
#question-entry-input{
  box-sizing: border-box;
  width: 100%;
  padding-top: 10px;
  padding-bottom: 10px;
  margin: 0px;
  border-radius: 24px;
}
#question-input-action-wrapper{
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 5px 0px 5px 0px;
}
#question-send-button{
  width: 68px;
  height: 30px;
  border-radius: 18px;
  margin-right: 6px;
  padding-left: 8px;
  padding-right: 8px;
  border: none;
  outline: none;
  color: white;
  font-family: "Poppins",sans-serif;
  font-size: 14px;
  font-weight: bold;
}
#question-send-button:active{
  color: #ff7c74;
}
#answer-send-button{
  width: 68px;
  height: 30px;
  border-radius: 18px;
  margin-right: 6px;
  padding-left: 8px;
  padding-right: 8px;
  border: none;
  outline: none;
  color: white;
  font-family: "Poppins",sans-serif;
  font-size: 14px;
  font-weight: bold;

}

#answer-send-button:active{
  color: #ff7c74;
}
#answer-send-button:active > label{
  color: white;
}



.side-box-v-container::-webkit-scrollbar {
  display: none;
}
.side-shadow-container::-webkit-scrollbar {
  display: none;
}
.side-box-v-container{
  overflow-y: scroll;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.side-shadow-container{
  overflow-y: scroll;
  display: flex;
  flex-direction: column-reverse;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  border-radius: 24px;
  background-color: #e0e5ec;
  margin-right: 10px;
  margin-left: 10px;
  margin-bottom: 10px;
  min-height: 20px;
  box-shadow:  inset 4px 4px 8px #c5cad0,
  inset -4px -4px 8px #fbffff;
}
/*.question-label{
  font-size: 16px;
  color: #e0e5ec;
  font-weight: bolder;
}
.question-label-wrapper{
  box-sizing: border-box;
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ff7c74;
  border-radius: 12px 12px 0px 0px;
  padding: 4px 8px 4px 8px;
}*/
#attendList{
  grid-template-rows: 6fr 1fr;
  box-sizing: border-box;
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
.guest-button{
  box-shadow: none;
  height: 30px;
  font-size: 14px;
  font-weight: bold;
  width: 100%;
}

.guest-button > label{
  color: #ff7c74;

}

.guest-button:active{
  box-shadow: inset 2px 2px 4px #bec3c9,
  inset -2px -2px 4px #ffffff;

}
.guest-button-holder{
  box-sizing: border-box;
  border-radius: 24px;
  box-shadow:  3px 3px 6px #bec3c9,
  -3px -3px 6px #ffffff;
}
</style>