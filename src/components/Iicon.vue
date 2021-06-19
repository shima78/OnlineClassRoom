<template>
<div id="icon-box"></div>
</template>

<script>

  import * as Three from 'three'


  export default {
  name: 'Icon',
  data() {
  return {
  camera: null,
  scene: null,
  renderer: null,
  mesh: null,
  container: null
}
},
  methods: {
  init: function() {
  this.container = document.getElementById('icon-box');

  this.camera = new Three.PerspectiveCamera(70, 1/1, 0.01, 10);
  this.camera.position.z = 1;
  this.camera.zoom = 1;
  this.scene = new Three.Scene();
  this.scene.background = new Three.Color(0xffffff);



    const loader = new Three.TextureLoader();
    console.log("public/iconTexture.png");
    // eslint-disable-next-line no-unused-vars
    const texture = new Three.TextureLoader();


    loader.load(
        // resource URL
        'src/assets/iconTexture.png',

        // onLoad callback
        function ( texture ) {
          // in this example we create the material when the texture is loaded
          // eslint-disable-next-line no-unused-vars
          const material = new Three.MeshBasicMaterial( {
            map: texture
          } );
        },

        // onProgress callback currently not supported
        function (){
          console.log("Loading...");
        },

        // onError callback
        // eslint-disable-next-line no-unused-vars
        function ( err ) {
          console.log( 'An error happened.' );
        }
    );



  this.renderer = new Three.WebGLRenderer();
  this.renderer.setSize(5,5);

  this.renderer.domElement.setAttribute("id","icon-canvas");
  this.renderer.domElement.style.width = "61px";
  this.renderer.domElement.style.height = "61px";
  this.renderer.domElement.style.margin = "2px";
  this.renderer.domElement.style.borderRadius = "4px";
  this.renderer.domElement.style.gridRow = 1;
  this.renderer.domElement.style.gridColumn = 1;

  this.container.appendChild(this.renderer.domElement);

},
  animate: function() {
  requestAnimationFrame(this.animate);
  this.renderer.render(this.scene, this.camera);
}
},
  mounted() {
  this.init();
  this.animate();
}
}
</script>


<style scoped>

</style>