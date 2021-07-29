<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>


export default {

  name: 'App',
  components: {

  },
  data: function (){
    return{
      serverConnection: null,

    }
  },
  methods: {
    serverConnect(socket){

      this.serverConnection = socket;
      console.log("app has received socket:\t",socket);

    }
  },
  created() {
    if (document.documentElement.clientWidth < 1200) {
      document.querySelector("meta[name=viewport]").setAttribute(
          'content',
          'width=device-width, initial-scale=0.75, maximum-scale=0.90, user-scalable=0');
    }
  }

}

</script>
<style>
#app {
  max-width:100%;
  margin: 0px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#app-main{
  display: flex;
  justify-content: flex-start;
  max-width:100%;
  width: 100vw;
  background-color: aqua;
  z-index: 1;
}


#app-main-view{
  max-width:100%;
  max-height: 100%;
  width: 100vw;
  height: 100vh;
  z-index: 1;
}


#home-box-container{
  max-height: 100%;
  max-width: 100%;
  grid-row: 2/6;
  grid-column: 4/6;
  background-color: black;
  z-index: 2;
}
#home-footer{
  background-color: #111111;
  height: 200px;
  width: 100vw;
  max-width: 100%;
}

</style>

