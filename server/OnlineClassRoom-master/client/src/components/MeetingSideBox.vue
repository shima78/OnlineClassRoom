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

          <div id="chat-message-box">
            <vue-scroll>
              <div id="bubble-chat-container">

              </div>
            </vue-scroll>
          </div>

          <div id="chatMessageEntry">
              <input id="chatMessageInput" type="text" class="input-bar" v-model="entryText">
              <button id="send-button" class="round-button" @click="sendMessage">
                <i class="material-icons">send</i>
              </button>
          </div>
      </div>
      <div id="attendList" class="side-box-v-container" v-if="selected === 2">
        <div>

        </div>
      </div>
      <div id="questionList" class="side-box-v-container" v-if="selected === 3">
        <div>

        </div>
      </div>

    </div>
</template>

<script>

import ChatBubble from "@/components/chatBubble";

export default {
  name: "MeetingSideBox",
  // eslint-disable-next-line vue/no-unused-components
  components: {ChatBubble},
  data() {
    return {
        chatButton : null,
        listButton : null,
        questionButton : null,
        selected: null,

        entryText: null
    }

  },
  methods:{
    init: function (){
          this.chatButton = document.getElementById("chat-button");
          this.listButton = document.getElementById("list-button");
          this.questionButton = document.getElementById("question-button");

    },
    sendMessage : function (){
      if(this.entryText =="") {
        console.log("empty");
        return;
      }
      console.log( document.getElementById("bubble-chat-container"));
      document.getElementById("bubble-chat-container").insertAdjacentHTML("afterend",
      "<chat-bubble></chat-bubble>");

    }
  },
  mounted() {
    this.init();
  }
}
</script>
<style src="../style/neuMeet.css"></style>
<style scoped>
  #side-box{
    width: 400px;
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


#send-button{
  background-image: linear-gradient(145deg, #ff7c74, #d86861);
  box-shadow:  3px 3px 6px #bec3c9,
  -3px -3px 6px #ffffff;
  margin-right: 8px;
  border-radius: 100px;

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


  #chatList::-webkit-scrollbar {
    display: none;
  }

  #chat-message-box::-webkit-scrollbar {
    display: none;
  }
  #chatList{

    overflow-y: scroll;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }

  #chat-message-box{

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


    box-shadow:  inset 4px 4px 8px #c5cad0,
    inset -4px -4px 8px #fbffff;


  }





</style>