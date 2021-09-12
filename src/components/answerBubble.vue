<template>
  <div class="answer-bubble">
    <div class="top-wrapper">
      <div class="username-label-wrapper">
        <label class="username-label">
          {{ username }}
        </label>
      </div>
      <div id="accept-reject-wrapper">
        <template v-if="role === 'owner'">
          <button class="accept-reject-button" @click="acceptAnswer" :id="'reject-button'+qid+'_'+answerID">
            <i class="material-icons">cancel</i>
            <label>
              Reject
            </label>
          </button>
          <button class="accept-reject-button" @click="rejectAnswer" :id="'accept-button'+qid+'_'+answerID">
            <label>
              Accept
            </label>
            <i class="material-icons">check_circle</i>
          </button>
        </template>

        <template v-if="role === 'std' || role === 'std'">
          <button class="accept-reject-button" :disabled="true" v-if="accept === false">
            <label>
              Rejected
            </label>
            <i class="material-icons">cancel</i>
          </button>
          <button class="accept-reject-button" :disabled="true" v-if="accept === true">
            <label>
              Accepted
            </label>
            <i class="material-icons">check_circle</i>
          </button>
          <button class="accept-reject-button" :disabled="true" v-if="accept === null">
            <label>
              Not checked
            </label>
            <i class="material-icons">remove_circle</i>
          </button>
        </template>

      </div>
    </div>
    <p class="answer-p">
      {{ answerMessage }}
    </p>
    <div
        style="display: flex; justify-content: space-between; align-items: center; width: 100%; box-sizing: border-box;">
      <label class="time-label">
        {{ time }}
      </label>
      <label v-if="role === 'std' || role === 'presenter'">
        <input type="number" class="score-input-bar" style="text-align: center" v-model="score" :disabled="true">
      </label>
      <div style="display: flex; justify-content: space-around; align-items: center; box-sizing: border-box;"
           v-if="role === 'owner'">
        <button id="score-inc-low" class="round-button inc-button" @click="decScore">
          <i class="material-icons">remove</i>
        </button>
        <input type="text" class="score-input-bar" v-model="inputScore" style="text-align: center">
        <button id="score-inc-high" class="round-button inc-button" @click="incScore">
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
  data() {
    return {
      inputScore: 0,
      role: null,
      server: null,
      outPutScore: 0

    }
  },
  props: {
    username: String,
    answerMessage: String,
    time: String,
    accept: Boolean,
    answerID: Number,
    qid: Number,
    score: Number
  },
  methods: {
    incScore: function () {
      if (this.inputScore < 20) {
        this.inputScore += 0.5;
      }
    },
    decScore: function () {
      if (this.inputScore > 0) {
        this.inputScore -= 0.5;
      }
    },
    ...mapGetters(['getServer', "getRole"]),

    init: function () {

      this.server = this.getServer();
      this.role = this.getRole();

      this.outPutScore = this.score;
      this.inputScore = this.score;
      console.log('outPutscore', this.accept)

    },

    acceptAnswer: function () {
      this.server.emit('accept', {qid: this.qid, ansid: this.answerID, isAcc: true})
      this.server.emit('getAnswers', this.qid);
      this.scoreQuestion();
      //:id="'accept-button' + qid + '_' + answerID"
      let selectButton = document.getElementById('accept-button' + this.qid + '_' + this.answerID);
      selectButton.childNodes[0].style.color = 'var(--text-color)';
      selectButton.childNodes[1].style.color = 'var(--text-color)';

      let unSelectButton = document.getElementById('reject-button' + this.qid + '_' + this.answerID);
      unSelectButton.childNodes[0].style.color = 'var(--accent-color)';
      unSelectButton.childNodes[1].style.color = 'var(--accent-color)';
      console.log('outPutscore', this.accept)

    },
    rejectAnswer: function () {
      this.server.emit('accept', {qid: this.qid, ansid: this.answerID, isAcc: false})
      this.scoreQuestion()

      let selectButton = document.getElementById('reject-button' + this.qid + '_' + this.answerID);
      selectButton.childNodes[0].style.color = 'var(--text-color)';
      selectButton.childNodes[1].style.color = 'var(--text-color)';

      let unSelectButton = document.getElementById('accept-button' + this.qid + '_' + this.answerID);
      unSelectButton.childNodes[0].style.color = 'var(--accent-color)';
      unSelectButton.childNodes[1].style.color = 'var(--accent-color)';


    },
    scoreQuestion: function () {
      this.server.emit('setScore', {qid: this.qid, ansid: this.answerID, score: parseInt(this.inputScore)})

    }

  },
  mounted() {

    this.init();

  }
}
</script>

<style scoped>
.answer-bubble {

  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: flex-start;
  padding: 12px 12px 10px 12px;
  margin: 12px 14px 12px 14px;

  min-height: 10px;
  background-color: var(--main-color);
  border-radius: 12px;

  box-shadow: var(--neu-shadow-3px);
}

.answer-p {
  font-size: 14px;
  margin-top: 8px;
  text-align: left;
  text-justify: inter-word;
  margin-left: 4px;
  margin-right: 1px;

  overflow-wrap: anywhere;
}

.time-label {
  font-size: 10px;
  margin-top: 2px;
  justify-self: right;
}

.username-label {
  font-size: 14px;
  color: var(--main-color);
  font-weight: bold;
  text-overflow: ellipsis;
}

.username-label-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: var(--accent-gradiant);
  border-radius: 12px;
  padding: 4px 8px 4px 8px;
  max-width: 60%;
}

.score-input-bar {


  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color);

  margin-right: 10px;
  margin-left: 10px;

  border-radius: 18px;
  padding-left: 12px;
  padding-right: 12px;

  border-width: 0px;
  background-color: var(--main-color);
  width: 40px;
  -webkit-appearance: none;
  outline: none;

  box-shadow: var(--neu-shadow-inset-1px);


}

#score-inc-high, #score-inc-low {
  width: 16px;
  height: 16px;
}

#accept-reject-wrapper {
  min-height: 24px;
  max-height: 24px;
  width: 140px;
  display: flex;
  justify-content: center;
  align-items: center;


  box-shadow: var(--neu-shadow-2px);
  border-radius: 24px;
}

.accept-reject-button {
  height: 22px;
  width: 100%;
  margin: 2px;
  background-color: var(--main-color);
  outline: none;
  border: none;
  border-radius: 24px;

  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
}

.accept-reject-button > label {
  font-size: 12px;
  font-weight: 400;
  margin-left: 3px;
  margin-right: 3px;
}

.accept-reject-button > i {
  font-size: 16px;
  color: var(--text-color);
}

.accept-reject-button:active {
  box-shadow: var(--neu-shadow-inset-1px);

}

.accept-reject-button:active > i {
  color: var(--accent-color);

}


.accept-reject-button:disabled > i {
  color: var(--accent-color);
}

.accept-reject-button:disabled:active {
  box-shadow: none;
}

.accept-reject-button:disabled:active > i {
  box-shadow: none;
}

.accept-reject-button:active > i {
  color: var(--accent-color);

}


.top-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}


</style>