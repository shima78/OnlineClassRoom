<template>
  <div id="white-board-wrapper">
    <div id="white-board-control">
      <div id="upload-ctrl-group" class="ctrl-group">
          <button class="round-button pdf-button" style="grid-column: 1; grid-row: 1;" @click="pdfDiv.style.zIndex = 3; canvas.style.zIndex = 1;">
            <label>PDF</label>
          </button>
          <input class="round-button pdf-button custom-file-input" id="pdf-upload-button" style="grid-column: 2; grid-row: 1;" type="file">
        <button class="round-button" style="grid-column: 1; grid-row: 2;" @click="canvas.style.zIndex = 3; pdfDiv.style.zIndex = 1;">
          <i class="material-icons">cast_for_education</i>
        </button>
        <input class="round-button custom-file-input" id="photo-upload-button" style="grid-row: 2; grid-column: 2;" type="file" @change="uploadImage">
      </div>

      <div id="shape-ctrl-group" class="ctrl-group">

          <button class="round-button">
            <i class="material-icons">post_add</i>
          </button>
          <button class="round-button" @click="drawCircle">
            <i class="material-icons-outlined">circle</i>
          </button>
          <button class="round-button" @click="drawLine">
          <i class="material-icons">horizontal_rule</i>
        </button>
          <button class="round-button" @click="drawRect">
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
        <button class="round-button" @click="undo">
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
import {mapGetters} from "vuex";
// eslint-disable-next-line no-unused-vars




export default {
  name: "whiteBoard",
  data(){

    return {
      server: null,
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
      },
      shapeClickMemory:{
        initialPoint:{
          x: null,
          y: null
        },
        finalPoint:{
          x: null,
          y: null
        }
      }




    }
  },
  components:{
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

      this.server.emit('draw-from-client', ({
        click: {
          x: this.click.x,
          y: this.click.y,
          drag: this.click.drag
        },
        strokeStyle: this.color,
        lineWidth: this.thickness
      }));
    },

    init: function (){
      this.server = this.$store.getters.getServer;

      this.pdfDiv = document.getElementById('pdf-view-wrapper');
      this.canvas = document.getElementById('white-board-canvas');
      this.canvasContext = this.canvas.getContext("2d");
      this.canvasContext.fillStyle = 'blue';



      let scale = window.devicePixelRatio;
      this.canvas.width = Math.floor(this.canvas.width*scale);
      this.canvas.height = Math.floor(this.canvas.height*scale);
      this.canvasContext.scale(scale,scale);

      //eventListeners

      this.server.on("clear-the-canvas-from-server",() =>{
        this.canvasContext.clearRect(0, 0, 2*this.canvas.width, 2*this.canvas.height);
      });

      this.server.on("draw-from-server",(data) =>{
        this.drawOnClientCanvas(data);
      })

      this.server.on("circle-draw-from-server",({shapeClickMemory, strokeStyle, lineWidth}) =>{

        this.drawCircleClient({shapeClickMemory, strokeStyle, lineWidth});
      })
      this.server.on("line-draw-from-server",({shapeClickMemory, strokeStyle, lineWidth}) =>{

        this.drawLineClient({shapeClickMemory,strokeStyle,lineWidth});
      })
      this.server.on("rect-draw-from-server",({shapeClickMemory, strokeStyle, lineWidth}) =>{

        this.drawRectClientL({shapeClickMemory,strokeStyle,lineWidth});
      })





    },
    mouseDown: function (event){
      // eslint-disable-next-line no-unused-vars
      let MouseX = event.pageX - this.offset.left;
      // eslint-disable-next-line no-unused-vars
      let MouseY = event.pageY - this.offset.top;

      this.shapeClickMemory = {
        initialPoint: {
          x: this.shapeClickMemory.finalPoint.x,
          y: this.shapeClickMemory.finalPoint.y
        },
        finalPoint: {
          x: event.pageX - this.offset.left,
          y: event.pageY - this.offset.top
        }
      }


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
      if (this.click.x.length > 0) {

        this.server.emit('maintain-history', {
          click:{
            x: this.click.x,
            y: this.click.y,
            drag: this.click.drag
          },
          strokeStyle: this.color,
          lineWidth: this.thickness,
          shapeProperties: false
        });
      }

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
      if(this.color != '#e0e5ec'){
        this.colorHold = this.color;
      }
      this.color = '#e0e5ec'
    },
    pendMode: function (){
      this.color = this.colorHold;
    },
    clearAll: function (){
      this.server.emit('clear-the-canvas', {});
      this.canvasContext.clearRect(0, 0, 2*this.canvas.width, 2*this.canvas.height);
    },
    setCanvasOffset: function (){
      let positionRect = this.canvas.getBoundingClientRect();
      this.offset.top = positionRect.top;
      this.offset.left = positionRect.left;


      let scale = window.devicePixelRatio;
      this.canvas.width = Math.floor(this.canvas.offsetWidth*scale);
      this.canvas.height = Math.floor(this.canvas.offsetHeight*scale);
      this.canvasContext.scale(scale,scale);
    },
    drawLine: function (){
      this.canvasContext.beginPath();
      this.canvasContext.moveTo(this.shapeClickMemory.initialPoint.x,this.shapeClickMemory.initialPoint.y);
      this.canvasContext.lineTo(this.shapeClickMemory.finalPoint.x,this.shapeClickMemory.finalPoint.y);
      this.canvasContext.closePath();
      this.canvasContext.stroke();

      this.server.emit('draw-line-client', {
        shapeClickMemory: this.shapeClickMemory,
        strokeStyle: this.color,
        lineWidth: this.thickness
      });

     this.server.emit('maintain-history', {
       shapeClickMemory: this.shapeClickMemory,
       shapeProperties: 'line',
        strokeStyle: this.color,
        lineWidth: this.thickness
      });

    },

    drawCircle: function (){
      let deltaX = this.shapeClickMemory.finalPoint.x - this.shapeClickMemory.initialPoint.x;
      let deltaY = this.shapeClickMemory.finalPoint.y - this.shapeClickMemory.initialPoint.y;
      let radius = Math.sqrt((deltaX*deltaX) + (deltaY*deltaY))/2;
      this.canvasContext.beginPath();
      this.canvasContext.arc((this.shapeClickMemory.finalPoint.x+this.shapeClickMemory.initialPoint.x)/2,(this.shapeClickMemory.finalPoint.y+this.shapeClickMemory.initialPoint.y)/2,radius,0,2*Math.PI);
      this.canvasContext.closePath();
      this.canvasContext.stroke();

      this.server.emit('draw-circle-client', {
        shapeClickMemory: this.shapeClickMemory,
        strokeStyle: this.color,
        lineWidth: this.thickness
      });

      this.server.emit('maintain-history', {
        shapeClickMemory: this.shapeClickMemory,
        shapeProperties: 'circle',
        strokeStyle: this.color,
        lineWidth: this.thickness
      });

    },

    drawRect: function (){
      this.canvasContext.beginPath();
      this.canvasContext.moveTo(this.shapeClickMemory.initialPoint.x,this.shapeClickMemory.initialPoint.y);
      this.canvasContext.lineTo(this.shapeClickMemory.finalPoint.x,this.shapeClickMemory.initialPoint.y);
      this.canvasContext.lineTo(this.shapeClickMemory.finalPoint.x,this.shapeClickMemory.finalPoint.y);
      this.canvasContext.lineTo(this.shapeClickMemory.initialPoint.x,this.shapeClickMemory.finalPoint.y);
      this.canvasContext.lineTo(this.shapeClickMemory.initialPoint.x,this.shapeClickMemory.initialPoint.y);
      this.canvasContext.closePath();
      this.canvasContext.stroke();

      this.server.emit('draw-rect-client', {
        shapeClickMemory: this.shapeClickMemory,
        strokeStyle: this.color,
        lineWidth: this.thickness
      });

      this.server.emit('maintain-history', {
        shapeClickMemory: this.shapeClickMemory,
        shapeProperties: 'rect',
        strokeStyle: this.color,
        lineWidth: this.thickness
      });


    },

    drawOnClientCanvas: function (data) {

        this.canvasContext.strokeStyle = data.strokeStyle;
        this.canvasContext.lineJoin = "round";
        this.canvasContext.lineWidth = data.lineWidth;

        for (let i = 0; i < data.click.x.length; i++) {
          this.canvasContext.beginPath();
          if (data.click.drag[i] && i) {
            this.canvasContext.moveTo(data.click.x[i - 1], data.click.y[i - 1]);
          } else {
            this.canvasContext.moveTo(data.click.x[i] - 1, data.click.y[i]);
          }
          this.canvasContext.lineTo(data.click.x[i], data.click.y[i]);
          this.canvasContext.closePath();
          this.canvasContext.stroke();
        }
    },
    //pass shapeMemory and line style
    drawCircleClient: function ({shapeClickMemory,strokeStyle,lineWidth}){
      this.canvasContext.strokeStyle = strokeStyle;
      this.canvasContext.lineWidth = lineWidth;

      let deltaX = shapeClickMemory.finalPoint.x - shapeClickMemory.initialPoint.x;
      let deltaY = shapeClickMemory.finalPoint.y - shapeClickMemory.initialPoint.y;
      let radius = Math.sqrt((deltaX*deltaX) + (deltaY*deltaY))/2;

      this.canvasContext.beginPath();

      this.canvasContext.arc((shapeClickMemory.finalPoint.x+shapeClickMemory.initialPoint.x)/2,(shapeClickMemory.finalPoint.y+shapeClickMemory.initialPoint.y)/2,radius,0,2*Math.PI);
      this.canvasContext.closePath();
      this.canvasContext.stroke();
    },

    drawRectClientL: function ({shapeClickMemory,strokeStyle,lineWidth}){
      this.canvasContext.strokeStyle = strokeStyle;
      this.canvasContext.lineWidth = lineWidth;
      this.canvasContext.beginPath();
      this.canvasContext.moveTo(shapeClickMemory.initialPoint.x,shapeClickMemory.initialPoint.y);
      this.canvasContext.lineTo(shapeClickMemory.finalPoint.x,shapeClickMemory.initialPoint.y);
      this.canvasContext.lineTo(shapeClickMemory.finalPoint.x,shapeClickMemory.finalPoint.y);
      this.canvasContext.lineTo(shapeClickMemory.initialPoint.x,shapeClickMemory.finalPoint.y);
      this.canvasContext.lineTo(shapeClickMemory.initialPoint.x,shapeClickMemory.initialPoint.y);
      this.canvasContext.closePath();
      this.canvasContext.stroke();


    },

    drawLineClient: function ({shapeClickMemory,strokeStyle,lineWidth}){

      this.canvasContext.strokeStyle = strokeStyle;
      this.canvasContext.lineWidth = lineWidth;

      this.canvasContext.beginPath();
      this.canvasContext.moveTo(shapeClickMemory.initialPoint.x,shapeClickMemory.initialPoint.y);
      this.canvasContext.lineTo(shapeClickMemory.finalPoint.x,shapeClickMemory.finalPoint.y);
      this.canvasContext.closePath();
      this.canvasContext.stroke();


    },
    maintainShapeHistory: function (){

    },
    undo: function (){
      this.server.emit('undo-canvas', {});
    },
    uploadImage: function (){
      console.log("imageUp running");
      const reader = new FileReader();
      reader.onload = function() {
        const base64 = this.result.replace(/.*base64,/, '');
        this.server().emit('image', base64);
      };
      reader.readAsDataURL(this.files[0]);



    }







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
  padding: 8px;

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