<template>
  <div id="white-board-wrapper">
    <div id="white-board-control">
      <div id="upload-ctrl-group" class="ctrl-group">

          <button class="round-button pdf-button" style="grid-column: 1; grid-row: 1;" @click="pdfDiv.style.zIndex = 3; canvas.style.zIndex = 1;">
            <label>PDF</label>
          </button>

          <button class="round-button pdf-button" style="grid-column: 2; grid-row: 1;">
            <i class="material-icons">
              <file-upload/>file_upload
            </i>

          </button>

        <button class="round-button" style="grid-column: 1; grid-row: 2;" @click="canvas.style.zIndex = 3; pdfDiv.style.zIndex = 1;">
          <i class="material-icons">cast_for_education</i>
        </button>

        <button class="round-button" style="grid-row: 2; grid-column: 2;">
          <i class="material-icons">insert_photo</i>
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
          <i class="material-icons" @click="eraseMode">phonelink_erase</i>
        </button>
        <button class="round-button" @click="pendMode">
          <i class="material-icons-outlined">draw</i>
        </button>
        <button class="round-button" @click="clearAll">
          <i class="material-icons">restart_alt</i>
        </button>
        <button class="round-button">
          <i class="material-icons-outlined">undo</i>
        </button>

      </div>

      <div id="pen-thickness-ctrl-group" class="ctrl-group">
        <label class="thickness-label" id="thickness-label-a">A</label>
        <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100%">
          <button id="thickness-inc-low" class="round-button inc-button" @click="thicknessDec">
          <i class="material-icons">remove</i>
        </button>

          <button id="thickness-inc-high" class="round-button inc-button" @click="thicknessInc">
            <i class="material-icons">add</i>
          </button></div>

      </div>

      <div id="color-wheel-ctrl-group" class="ctrl-group">
        <v-swatches v-model="color" popover-x="left" inline background-color="#e0e5ec" row-length="8" :swatch-style=this.swatchStyle>
        </v-swatches>
      </div>

    </div>
    <div id="wrapper" style="display: grid; grid-template-rows: 1fr; grid-template-columns: 1fr; height: calc(100% - 120px); box-sizing: border-box;">
      <div id="pdf-view-wrapper" style="z-index: 1; grid-row: 1; grid-column: 1;">
          <label v-if="noPdf.value" id="noPdfLabel">{{this.noPdf.text}}</label>
      </div>
      <canvas id="white-board-canvas" @mousedown="mouseDown" @mousemove="mouseMove" @mouseup="mouseup" @mouseleave="mouseleave" style="z-index: 2; grid-row: 1; grid-column: 1;">

      </canvas>
    </div>

  </div>

</template>

<script>
// eslint-disable-next-line no-unused-vars
import VSwatches from 'vue-swatches'
// eslint-disable-next-line no-unused-vars
import FileUpload from "./FileUpload";
import {mapGetters} from "vuex";


export default {
  name: "whiteBoard",
  data(){

    return {
      server:this.$store.getters.getServer,
      color: 'rgb(61,85,110)',
      colorHold: 'rgb(61,85,110)',
      thickness : 4,
      swatchStyle: { boxShadow: '2px 2px 4px #bec3c9, -2px -2px 4px #ffffff'},
      canvasContext: null,
      canvas: null,
      offset: {
        left: 0,
        top: 0
      },
      click: {
        x: new Array(),
        y: new Array(),
        drag: new Array()
      },
      paint: false,
      strokeStyle: 'rgb(5,4,5)',
      tab: {
        pdf: 0,
        whiteBoard: 1,
      },
      canvasHeightHold: null,
      pdfDiv: null,
      noPdf:{
        value: 1,
        text: "Nothing is being shared,\nupload a PDF file first."
      }




    }
  },
  components:{
    FileUpload,
    VSwatches

  },
  methods:{
    ...mapGetters(['getServer']),
    addClick: function (x,y,dragging){

      if(x) {
        this.click.x.push(x);
        this.click.y.push(y);
        this.click.drag.push(dragging);
      }
      },
    drawOnCanvas: function (){
      this.canvasContext.strokeStyle = this.color;
      this.canvasContext.lineJoin = 'round';
      this.canvasContext.lineWidth = this.thickness;

      for(let i=0; i < this.click.x.length; i++){
        this.canvasContext.beginPath();
        if(this.click.drag[i] && i){
          this.canvasContext.moveTo(this.click.x[i-1],this.click.y[i-1]);

        }
        else{
          this.canvasContext.moveTo(this.click.x[i] - 1,this.click.y[i]);

        }

        this.canvasContext.lineTo(this.click.x[i],this.click.y[i]);
        this.canvasContext.closePath();
        this.canvasContext.stroke();
      }
    },


    init: function (){
      this.pdfDiv = document.getElementById('pdf-view-wrapper');
      this.canvas = document.getElementById('white-board-canvas');
      this.canvasContext = this.canvas.getContext("2d");
      this.canvasContext.fillStyle = 'blue';



      let scale = window.devicePixelRatio;
      this.canvas.width = Math.floor(this.canvas.width*scale);
      this.canvas.height = Math.floor(this.canvas.height*scale);
      this.canvasContext.scale(scale,scale);


      this.server.on("bgURL",async (URL)=>{
        // document.getElementById("image").src = URL
        console.log(URL)
        document.getElementById("white-board-canvas").style.backgroundImage = "url("+URL+")";
      })



    },
    mouseDown: function (event){
      // eslint-disable-next-line no-unused-vars
      let MouseX = event.pageX - this.offset.left;
      // eslint-disable-next-line no-unused-vars
      let MouseY = event.pageY - this.offset.top;

      this.paint = true;
      this.addClick(event.pageX - this.offset.left,event.pageY - this.offset.top);
      this.drawOnCanvas();

    },
    mouseMove: function (event){
      if(this.paint){
        this.addClick(event.pageX - this.offset.left,event.pageY - this.offset.top,true);
        this.drawOnCanvas();
      }
    },
    // eslint-disable-next-line no-unused-vars
    mouseup: function (event){
      this.paint = false;
      this.ClearDrawCoordinates();

    },

    mouseleave: function (){
      this.paint = false;
      this.ClearDrawCoordinates();

    },

    ClearDrawCoordinates: function (){


      this.click.x = new Array();
      this.click.y = new Array();
      this.click.drag = new Array();
    },



      thicknessInc:  function (){
        if(this.thickness < 9){
          this.thickness += 1;
          document.getElementById('thickness-label-a').style.fontWeight = (this.thickness * 100).toString();


        }
      },
    thicknessDec: function (){
        if(this.thickness > 1){
          this.thickness -= 1;
          document.getElementById('thickness-label-a').style.fontWeight = (this.thickness * 100).toString();

        }
      },

    eraseMode: function (){
      this.colorHold = this.color;
      this.color = '#e0e5ec'
    },
    pendMode: function (){
      this.color = this.colorHold;
    },
    clearAll: function (){
      this.canvasContext.clearRect(0, 0, 2*this.canvas.width, 2*this.canvas.height);
    },
    setCanvasOffset: function (){


      let positionRect = this.canvas.getBoundingClientRect();
      this.offset.top = positionRect.top;
      this.offset.left = positionRect.left;
      console.log("offsets", this.offset.top,this.offset.left);

      let scale = window.devicePixelRatio;
      this.canvas.width = Math.floor(this.canvas.offsetWidth*scale);
      this.canvas.height = Math.floor(this.canvas.offsetHeight*scale);
      this.canvasContext.scale(scale,scale);
    },

  },
  mounted() {
    this.init();
    this.setCanvasOffset();

  }
}
</script>
<style src="../style/neuMeet.css"></style>
<style scoped>
#wrapper{
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}
#white-board-wrapper{
  border-radius: 24px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
#white-board-control{
  padding: 5px;
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
  height: calc(100%);
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

  display: grid;
  grid-template-rows: 55px 55px;
  grid-template-columns: 55px 55px;

  justify-items: center;
  align-items: center;

}


.upload-button > label{
  font-weight: bold;
}


.pdf-button >label{
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

#pdf-view-wrapper{
  background-color: #e0e5ec;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  height: calc(100%);
  border-radius: 24px;
  border: 8px solid #e0e5ec;
  max-height: inherit;

  box-shadow: inset 3px 3px 6px #bec3c9,
  inset -3px -3px 6px #ffffff;
}

#noPdfLabel{
  font-size: 24px;


  font-style: italic;
}


</style>