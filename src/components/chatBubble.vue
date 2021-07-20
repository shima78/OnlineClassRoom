<template>
    <div class="answer-bubble">
      <div class="username-label-wrapper">
        <label class="username-label">
          {{username}}
        </label>
      </div>
     <p class="answer-p">
        {{message}}
     </p>
      <label class="time-label">
        {{time}}
      </label>
    </div>
</template>

<script>
export default {
  name: "chatBubble",
  data(){
    return{

    }
  },
  props:{
    username: String,
    message: String,
    time: String
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

</style>