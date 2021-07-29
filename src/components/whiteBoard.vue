<template>
  <div id="white-board-wrapper">
    <div id="white-board-control" v-show="expandWhiteBoardControl">
      <div id="upload-ctrl-group" class="ctrl-group">
          <button class="round-button pdf-button" style="grid-column: 1; grid-row: 1;" @click="pdfDiv.style.zIndex = 3; canvas.style.zIndex = 1;">
            <label>PDF</label>
          </button>
        <fileUploader  :pdf="true" :picture="false" style="grid-column: 2; grid-row: 1;"></fileUploader>

          <!--<input class="round-button pdf-button custom-file-input" id="pdf-upload-button" style="grid-column: 2; grid-row: 1;" type="file">-->
        <button class="round-button" style="grid-column: 1; grid-row: 2;" @click="canvas.style.zIndex = 3; pdfDiv.style.zIndex = 1; canvas.style.backgroundImage = null">
          <i class="material-icons">cast_for_education</i>
        </button>
        <fileUploader  :pdf="false" :picture="true" style="grid-row: 2; grid-column: 2;" v-if="imageBack == 0"></fileUploader>
        <button class="round-button" style="grid-column: 2; grid-row: 2;" v-if="imageBack == 1" @click="clearBackground">
          <i class="material-icons">cancel</i>
        </button>
        <!---<input class="round-button custom-file-input" id="photo-upload-button" style="grid-row: 2; grid-column: 2;" type="file" @change="onSelect"> -->


      </div>

      <div id="shape-ctrl-group" class="ctrl-group">

          <button class="round-button" :disabled="role === 'std'">
            <i class="material-icons">post_add</i>
          </button>
          <button class="round-button" @click="drawCircle" :disabled="role === 'std'">
            <i class="material-icons-outlined">circle</i>
          </button>
          <button class="round-button" @click="drawLine" :disabled="role === 'std'">
          <i class="material-icons">horizontal_rule</i>
        </button>
          <button class="round-button" @click="drawRect" :disabled="role === 'std'">
            <i class="material-icons-outlined">crop_square</i>
          </button>

      </div>

      <div id="line-redo-ctrl-group" class="ctrl-group">
        <button class="round-button" :disabled="role === 'std'">
          <i class="material-icons" @click="eraseMode">phonelink_erase</i>
        </button>
        <button class="round-button" @click="pendMode" :disabled="role === 'std'">
          <i class="material-icons-outlined">draw</i>
        </button>
        <button class="round-button" @click="clearAll" :disabled="role === 'std'">
          <i class="material-icons">restart_alt</i>
        </button>
        <button class="round-button" @click="undo" :disabled="role === 'std'">
          <i class="material-icons-outlined">undo</i>
        </button>

      </div>

      <div id="pen-thickness-ctrl-group" class="ctrl-group">
        <label class="thickness-label" id="thickness-label-a">A</label>
        <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100%">
          <button id="thickness-inc-low" class="round-button inc-button" @click="thicknessDec" :disabled="role === 'std'">
          <i class="material-icons">remove</i>
        </button>

          <button id="thickness-inc-high" class="round-button inc-button" @click="thicknessInc" :disabled="role === 'std'">
            <i class="material-icons">add</i>
          </button></div>


      </div>

      <div id="color-wheel-ctrl-group" class="ctrl-group">
        <v-swatches v-if="clientWide" v-model="color" popover-x="left" inline  background-color="#e0e5ec" row-length="4" :swatch-style=this.swatchStyle :close-on-select="true" :disabled="role === 'std'">
        </v-swatches>
        <v-swatches v-if="!clientWide" v-model="color" popover-x="left"   background-color="#e0e5ec" row-length="4" :swatch-style=this.swatchStyle :close-on-select="true" :disabled="role === 'std'">
        </v-swatches>
      </div>

    </div>
    <div id="wrapper" style="display: grid; grid-template-rows: 1fr; grid-template-columns: 1fr; height: calc(100% - 120px); box-sizing: border-box;">
      <div id="pdf-view-wrapper" style="z-index: 1; grid-row: 1; grid-column: 1;">
        <div id="pdf-nav-bar">
            <button class="round-button" id="hide-button"  @click="expandWhiteBoardControlFunction"
                    style="display: flex; justify-content: space-between; width: 120px; padding-left: 10px; box-sizing: border-box;"
                    :disabled="role === 'std'">
                <label v-if="expandWhiteBoardControl">hide</label>
                <label v-if="!expandWhiteBoardControl">show</label>
                <i v-if="expandWhiteBoardControl" class="material-icons">expand_less</i>
                <i v-if="!expandWhiteBoardControl" class="material-icons">expand_more</i>

            </button>


        </div>
        <vue-pdf-app style="height: calc(100%); width: 100%; border-radius: 0px 0px 14px 14px;"
                     :pdf="PDF.pdfSource" :title="PDF.title" theme="light"
                      :page-number="PDF.pageNumber"
        ></vue-pdf-app>
      </div>
      <!-- <input :required="test ? true : false"> -->

      <canvas  id="white-board-canvas" @mousedown="mouseDown" @mousemove="mouseMove" @mouseup="mouseup" @mouseleave="mouseleave" style="z-index: 2; grid-row: 1; grid-column: 1;">

      </canvas>

    </div>

  </div>

</template>

<script>
// eslint-disable-next-line no-unused-vars
import VSwatches from 'vue-swatches'
import fileUploader from "@/components/fileUploader";
import {mapGetters,mapActions} from "vuex";
import VuePdfApp from "vue-pdf-app";
import "vue-pdf-app/dist/icons/main.css";


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
        value: 0,
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
      },

      //imageData
      imageData:{
        file: null,
        message: null
      },

      //ui variable
      clientWide: null,
      role: null,

      PDF:{
        pdfSource: null,
        title: null,
        pageNumber: null
      },

      expandWhiteBoardControl: 1,
      imageBack: 0





    }
  },
  components:{
    fileUploader,
    VSwatches,
    VuePdfApp
  },

  computed:{
    PDFPageNumber(){
      return this.PDF.pageNumber;
    }
  },


  watch:{
    PDF: function(){
      console.log('pdfpage',this.PDFPageNumber)//emit pagenumber change
    }
  }
  ,
  methods:{
    ...mapGetters(['getServer','getRole','getRoomID']),
    ...mapActions(['updateRole']),
    clearBackground: function (){
     this.canvas.style.backgroundImage = null;
     this.imageBack = 0;
    },
    expandWhiteBoardControlFunction: function (){

      let clientWideHold = this.clientWide;
      let wrapper = document.getElementById('wrapper');

      if(this.expandWhiteBoardControl){
        this.clientWide = clientWideHold;
        wrapper.style.height = 'calc(100%)'
        this.expandWhiteBoardControl = !this.expandWhiteBoardControl;

      }
      else{
      this.clientWide = clientWideHold;
        wrapper.style.height = 'calc(100% - 120px)'


        this.expandWhiteBoardControl = !this.expandWhiteBoardControl;
      }


    },
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
      this.role = this.$store.getters.getRole;
      this.clientWide =1;

      //vueswatch size based
      let canvasControl = document.getElementById('white-board-control');
      if(canvasControl.offsetWidth < 900){
        this.clientWide = 0;
      }
      else{
        this.clientWide = 1;
      }


      //role based button disable
     /* if(this.role == "std"){

        let whiteBoardInputControls = canvasControl.getElementsByTagName('input');
        let whiteBoardButtonControls = canvasControl.getElementsByTagName('button');
        console.log(whiteBoardInputControls,whiteBoardInputControls)
        for(let i = 0;i < whiteBoardButtonControls.length; i++){
          if(i==1 || i==0){
            continue;
          }
          whiteBoardButtonControls[i].disabled = true;
        }

        for(let j = 0;j < whiteBoardInputControls.length; j++){
          whiteBoardInputControls[j].disabled = true;
        }

        console.log('whiteBoardInputControls',whiteBoardInputControls);
        console.log('whiteBoardButtonControls',whiteBoardButtonControls);
      }*/



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

      //pdf event listeners

      this.server.on("privateMessage",(data)=>{
        console.log("pdfList",data)
      })


      //imageUpload
      //TODO fix IMAGE FRONT
      this.server.on("bgURL",async (URL)=>{
        this.imageBack = 1;
        // document.getElementById("image").src = URL
        console.log('bgrul:::',URL)
        this.canvas.style.backgroundImage = "url("+URL+")";
        this.canvas.style.backgroundPosition = "center";
        this.canvas.style.backgroundRepeat = "no-repeat";
        this.canvas.style.backgroundAttachment = "fixed";
        this.canvas.style.backgroundSize = "contain";

      })


      this.server.on("PDF",async (PDF)=>{
        console.log('pdf:',PDF);
        this.PDF.pdfSource=PDF;

      })

      this.server.on("newRole", async (data)=>{
        console.log('promote data',data)
        let user = data.find(user => user.socketID === this.server.id && user.online === true)
        this.updateRole(user.role)
        this.role = user.role;

      })





    },
    mouseDown: function (event){
      if(this.role == 'std'){
        return;
      }
      else {

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
        this.addClick(event.pageX - this.offset.left, event.pageY - this.offset.top);
        this.drawOnCanvas();
      }

    },
    mouseMove: function (event){
      if(this.role == 'std'){
        return;
      }
      else{
        if(this.paint){
          this.addClick(event.pageX - this.offset.left,event.pageY - this.offset.top,true);
          this.drawOnCanvas();
        }
      }

    },
    // eslint-disable-next-line no-unused-vars
    mouseup: function (event){
      if(this.role == 'std'){
        return;
      }
      else{
        this.paint = false;
        this.ClearDrawCoordinates();
      }


    },

    mouseleave: function (){
      if(this.role == 'std'){
        return;
      }
      else{
        this.paint = false;
        this.ClearDrawCoordinates();
      }


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
      if(this.role == 'std'){
        return;
      }else{
        this.server.emit('clear-the-canvas', {});
        this.canvasContext.clearRect(0, 0, 2*this.canvas.width, 2*this.canvas.height);
      }

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
    resizeLog: function (){
      let canvasControl = document.getElementById('white-board-control');
      if(canvasControl.offsetWidth < 900){
        this.clientWide = 0;
      }
      else{
        this.clientWide = 1;
      }

      this.setCanvasOffset()
    }


},
  mounted() {
    this.init();
    this.setCanvasOffset();
    window.onresize = this.resizeLog;
    console.log("PDF",this.PDF)

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
  justify-content: space-around;
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


#color-wheel-ctrl-group{

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
  flex-direction: column;
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

.pdf-app.light {
  --pdf-toolbar-color: #7389a9;
  --pdf-button-hover-font-color: #ff7c74;
  --pdf-app-background-color:#bcc6d6;
}

#pdf-nav-bar{

  padding: 4px 10px;
  box-sizing: border-box;
  width: 100%;
  max-height: 36px;
  min-height: 36px;
  background-color: #e0e5ec;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  border-radius: 14px 14px 0px 0px;
  box-shadow:  3px 3px 6px #bec3c9,
   -3px -3px 6px #ffffff;

}
#pdf-nav-bar > button{
  height: 25px;
  width: 40px;
}

#pdf-nav-bar-mid > label{
  font-style: italic;
}
#hide-button {
  width: 120px;
}




</style>