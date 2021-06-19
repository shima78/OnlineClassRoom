<template>
    <div id="side-box" class="box">
        <div id="tab-buttons" class="radio-wrapper">
          <input id="chat-button"     type="radio" class="tab-button neu-button" v-model="selected" name="tab" value="chat">
          <input id="list-button"     type="radio" class="tab-button neu-button" v-model="selected" name="tab" value="list">
          <input id="question-button" type="radio" class="tab-button neu-button" v-model="selected" name="tab" value="question">
        </div>
      <div id="chatList" class="side-box-v-container" v-if="selected === 'chat'"></div>
      <div id="attendList" class="side-box-v-container" v-if="selected === 'list'"></div>
      <div id="questionList" class="side-box-v-container" v-if="selected === 'question'"></div>
    </div>
</template>

<script>

export default {
  name: "MeetingSideBox",
  data() {
    return {
        chatButton : null,
        listButton : null,
        questionButton : null,
        selected: 'chat'
    }

  },
  methods:{
    init: function (){
          this.chatButton = document.getElementById("chat-button");
          this.listButton = document.getElementById("list-button");
          this.questionButton = document.getElementById("question-button");
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
    row-gap: 20px;


  }

  #chatList{
    display: flex;
    max-width: 100%;
    height: 100%;
    border-radius: 24px;
    grid-column: 1;
    grid-row: 2;
    align-self: flex-end;

    margin-bottom: 10px;

    margin-right: 10px;
    margin-left: 10px;

    background: #e0e5ec;
    box-shadow: inset 6px 6px 12px #ccd0d7,
    inset -6px -6px 12px #f4faff;
  }

  #tab-buttons{
    display: grid;
    justify-items: center;
    align-items: center;
    grid-template-rows: 100%;
    grid-template-columns: repeat(3,1fr);

    border-radius: 24px;
    margin: 10px 10px;
    padding: 2px 2px ;
    max-width:100% ;
    background: #e0e5ec;
    box-shadow:
    3px 3px 6px #ccd0d7,
    -3px -3px 6px #f4faff,
    inset 3px 3px 6px #ccd0d7,
    inset -3px -3px 6px #f4faff;

    border: 2px solid #e0e5ec;


    max-height: 38px;
  }

  .tab-button{

  }

  .side-box-v-container{
    background: #e0e5ec;
    box-shadow:  3px 3px 6px #ccd0d7,
    -3px -3px 6px #f4faff;
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







</style>