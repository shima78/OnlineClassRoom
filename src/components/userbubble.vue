<template>
  <div class="answer-bubble">
    <label class="username-label">
      {{username}}
    </label>
    <div style="display: flex; flex-direction: row; justify-content: space-evenly; align-content: center; " >
      <template  v-if="role === 'owner' && userRole != 'owner'">
        <button class="accept-reject-button"  id="accept-button" @click="demoteUser" v-if="userRole === 'presenter'">
          <i class="material-icons">group_remove</i>
          <label>
            Demote
          </label>
        </button>
        <button class="accept-reject-button"  id="reject-button" @click="promoteUser" v-if="userRole === 'std'">
          <label>
            Promote
          </label>
          <i class="material-icons">group_add</i>
        </button>
      </template>
      <button class="accept-reject-button"  id="reject-button" @click="promoteUser" v-if="userRole === 'std'">
        <label>
          Promote
        </label>
        <i class="material-icons">group_add</i>
      </button>
      <label class="role-label">
        {{ joinTime }}
      </label>


    </div>

  </div>
</template>

<script>


import {mapGetters} from "vuex";

export default {
  name: "userBubble",
  data(){
    return{
      role: null,
      server: null
    }
  },
  props:{
    username: String,
    joinTime: String,
    userRole: String,
    socketID: String

  },
  methods:{
    ...mapGetters(['getRole','getServer']),
    promoteUser: function (){
      console.log('running promote')
      this.server.emit('promote',this.socketID)
    },
    demoteUser: function (){
      console.log('running demote')
      this.server.emit('demote',this.socketID)
    }
  },
  mounted() {
    this.role = this.$store.getters.getRole;
    this.server = this.$store.getters.getServer;
  }
}
</script>

<style scoped>
.answer-bubble{

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
  color: #ff7c74;

}

.accept-reject-button {
  height: 22px;
  width: 100%;
  margin: 2px;
  background-color: #e0e5ec;
  outline: none;
  border: none;
  border-radius: 24px;

  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
}

.accept-reject-button > label{
  font-size: 12px;
  font-weight: 400;
  margin-left: 3px;
  margin-right: 3px;
}

.accept-reject-button > i{
  font-size: 14px;
  color: #7389a9;
}

.accept-reject-button:active{
  box-shadow:  inset 1px 1px 2px #bec3c9,
  inset -1px -1px 2px #ffffff;

}

.accept-reject-button:active > i{
  color: #ff7c74;

}


.accept-reject-button:disabled >i{
  color: #ff7c74;
}
.accept-reject-button:disabled:active{
  box-shadow: none;
}
.accept-reject-button:disabled:active >i{
  box-shadow: none;
}

.accept-reject-button:active > i{
  color: #ff7c74;

}

</style>