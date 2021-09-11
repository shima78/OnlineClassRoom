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
<style v-if=" 5 < 3">
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



/* http://meyerweb.com/eric/tools/css/reset/
   v2.0 | 20110126
   License: none (public domain)
*/

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
  display: block;
}
body {
  line-height: 1;
}
ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}


</style>

