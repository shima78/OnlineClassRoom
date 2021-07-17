<template>
  <div class="chat-bubble">
      <label class="username-label">
        {{username}}
      </label>
    <label class="role-label" v-if="role === 'owner'">
      {{role}}
    </label>
  </div>
</template>

<script>
export default {
  name: "userBubble",
  data(){
    return{

    }
  },
  props:{
    username: String,
    role: String
  }
}
</script>

<style scoped>
.chat-bubble{

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px 10px 12px;
  margin: 12px 14px 12px 14px;

  min-height: 10px;
  max-height: 10px;
  background-color: #e0e5ec;
  border-radius: 12px;

  box-shadow:  3px 3px 6px #bec3c9,
  -3px -3px 6px #ffffff;
}


.username-label{

  font-family: "Poppins",sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #7389a9;

}


.role-label{

  font-family: "Poppins",sans-serif;
  font-size: 10px;
  font-weight: 400;
  color: #cf525c;

}

</style>