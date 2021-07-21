<template>
  <div id="white-board-wrapper">
    <div id="white-board-control">
      <div id="upload-ctrl-group" class="ctrl-group">
        <button class="round-button upload-button" >
          <label>PDF</label>
        </button>
        <button class="round-button upload-button" @click="sharePic">
          <label>Picture</label>
        </button>
      </div>

      <div id="shape-ctrl-group" class="ctrl-group">

          <button class="round-button">
            <i class="material-icons">post_add</i>
          </button>
          <button class="round-button">
            <i class="material-icons-outlined">circle</i>
          </button>
          <button class="round-button">
          <i class="material-icons">horizontal_rule</i>
        </button>
          <button class="round-button">
            <i class="material-icons-outlined">crop_square</i>
          </button>

      </div>

      <div id="line-redo-ctrl-group" class="ctrl-group">
        <button class="round-button">
          <i class="material-icons">phonelink_erase</i>
        </button>
        <button class="round-button">
          <i class="material-icons-outlined">draw</i>
        </button>
        <button class="round-button">
          <i class="material-icons">restart_alt</i>
        </button>
        <button class="round-button">
          <i class="material-icons-outlined">undo</i>
        </button>

      </div>

      <div id="pen-thickness-ctrl-group" class="ctrl-group">
        <label class="thickness-label">A</label>
        <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100%">
          <button id="thickness-inc-low" class="round-button inc-button">
          <i class="material-icons">remove</i>
        </button>

          <button id="thickness-inc-high" class="round-button inc-button">
            <i class="material-icons">add</i>
          </button></div>

      </div>

      <div id="color-wheel-ctrl-group" class="ctrl-group">
        <v-swatches v-model="color" popover-x="left" inline background-color="#e0e5ec" row-length="8" :swatch-style=this.swatchStyle>

        </v-swatches>
      </div>

    </div>

    <canvas id="white-board-canvas"></canvas>
  </div>

</template>

<script>
// eslint-disable-next-line no-unused-vars
import VSwatches from 'vue-swatches'



export default {
  name: "whiteBoard",
  data(){

    return {
      color: '#7389a9',
      thickness : 100,
      swatchStyle: { boxShadow: '2px 2px 4px #bec3c9, -2px -2px 4px #ffffff'}



    }
  },
  components:{
    VSwatches
  },
  methods:{
    sharePic(){
      
    }
  }
}
</script>
<style src="../style/neuMeet.css"></style>
<style scoped>
#white-board-wrapper{
  border-radius: 24px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
#white-board-control{

  box-sizing: border-box;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: row-reverse;
}

#white-board-canvas{
  box-sizing: border-box;
  width: 100%;
  height: calc(100% - 120px);
  border-radius: 24px;
  border: 8px solid #e0e5ec;
  background-color: #e0e5ec;
  box-shadow: inset 3px 3px 6px #bec3c9,
  inset -3px -3px 6px #ffffff;

}

.ctrl-group{
  box-sizing: border-box;
  height: 100%;
  padding: 5px;
  margin-top: 5px;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
#upload-ctrl-group{

}
.upload-button{
  width: 80px;

}

.upload-button > label{
  font-weight: bold;
}

#shape-ctrl-group{
  display: grid;
  grid-template-rows: 55px 55px;
  grid-template-columns: 55px 55px;

  justify-items: center;
  align-items: center;
}

#line-redo-ctrl-group{
  display: grid;
  grid-template-rows: 55px 55px;
  grid-template-columns: 55px 55px;

  justify-items: center;
  align-items: center;
}

.thickness-label{
  margin: 0px;
  font-size: 70px;
  font-family: "Open Sans";
  font-weight: 100;
  line-height: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;

  width: 100%;
  height: 100%;

  vertical-align: center;


}
#pen-thickness-ctrl-group{
  box-sizing: border-box;
  justify-content: space-around;
  width: 100px;






  height: calc(100% - 16px);

}

#thickness-inc-high, #thickness-inc-low{
  width: 20px;
  height: 20px;
}


</style>