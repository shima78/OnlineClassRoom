<template>
  <div id="home-app" class="base">
      <div id="back-slide" class="base">
        <div id="logo-icon-box">
          <img src="../assets/logo/whiteLogo.png"></div>
        <div id="home-box" class="top">
         <LoginBox>
         </LoginBox>
        </div>
      </div>
  </div>
</template>

<script>

import * as Three from 'three'
import LoginBox from "@/components/LoginBox";



export default {
  name: 'Home',
  components: {
    LoginBox

  },
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mainMesh: null,
      wireFrameMesh: null,
      container: null

    }
  },
  methods: {
    init: function() {


      this.container = document.getElementById('back-slide');

      this.camera = new Three.PerspectiveCamera(40, this.container.clientWidth/this.container.clientHeight, 0.01, 10);
      this.camera.position.z = 1;


      this.scene = new Three.Scene();

      


      let wireFrameGeometry = new Three.SphereGeometry(0.28,4,4);
      let wireFrameMaterial = new Three.MeshBasicMaterial();
      wireFrameMaterial.color = new Three.Color(0xffffff);
      wireFrameMaterial.wireframe = true;
      this.wireFrameMesh = new Three.Mesh(wireFrameGeometry,wireFrameMaterial);
      this.wireFrameMesh.translateX(-0.1);
      this.scene.add(this.wireFrameMesh);





      this.renderer = new Three.WebGLRenderer({antialias: true, alpha: true});
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

      this.renderer.domElement.setAttribute("id","back-canvas");
      this.renderer.domElement.style.width = "inherit";
      this.renderer.domElement.style.height = "inherit";
      this.renderer.domElement.style.gridRow = "1/8";
      this.renderer.domElement.style.gridColumn = "1/10";
      this.renderer.domElement.style.zIndex ="1";
      this.container.appendChild(this.renderer.domElement);






    },
    animate: function() {
      requestAnimationFrame(this.animate);
      this.renderer.setSize(this.container.clientWidth,this.container.clientHeight);
      this.wireFrameMesh.rotation.z +=0.00025;
      this.wireFrameMesh.rotation.y +=0.00025;
      this.renderer.render(this.scene, this.camera);
    },


  },
  mounted() {
    this.init();
    this.animate();
  }
}
</script>

<style scoped>




.base{
  z-index: 1;

}
.top{
  z-index: 2;
}


#back-slide{
  width: 100vw;
  max-width:100%;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr repeat(12,1fr) ;
  grid-template-rows:   repeat(8,1fr) ;
  background-image: url("../assets/background/mainBack.jpeg");


}

#home-box{

  grid-column: 7/10;
  grid-row: 2/7;
  min-width: 300px;
  max-width: 400px;
  min-height: 350px;
  max-height: 650px;
  margin-left: 80px;

  padding: 16px 14px 26px;
  border-radius: 30px;
  background: #111111;
  box-shadow:  20px 20px 60px #cf525c,
  -20px -20px 60px #ff707c;


}
#logo-icon-box{
  background-color: transparent;
  position:fixed;
  top: 12px;
  left: 12px;
  min-width: 100px;
  min-height: 50px;

}
#logo-icon-box > img{
  max-width: 200px;
  max-height: 50px;
}

</style>
