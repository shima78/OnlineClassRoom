<template>
  <div id="meeting-app">
    <div id="meeting-background">
      <div id="Nav-bar-container">
          <MeetingNavbar>
          </MeetingNavbar>
      </div>

      <div id="board-container">
          <white-board></white-board>

      </div>

      <div id="side-container">
        <MeetingSideBox>
        </MeetingSideBox>
      </div>


    </div>
  </div>


</template>

<script>
import MeetingNavbar from "@/components/MeetingNavbar";
import MeetingSideBox from "@/components/MeetingSideBox";
import WhiteBoard from "@/components/whiteBoard";

export default {
  name: "Meeting",
  components: {
    WhiteBoard,
    MeetingSideBox,
    MeetingNavbar
  },

}
</script>
<style src="../style/neuMeet.css"></style>
<style scoped>
#meeting-background{
  background-color: #e0e5ec;
  width: 100vw;
  height: 100vh;
  max-height: 100%;
  max-width: 100%;
  display: grid;
  row-gap: 10px;
  grid-template-columns: minmax(700px,1fr) 400px;
  grid-template-rows: 80px minmax(500px,1fr);
}
#Nav-bar-container{
  grid-row: 1;
  grid-column: 1/3;
  z-index: 1;
  max-width: 100%;
  max-height: 100%;

}

#board-container{
  margin: 20px 40px 40px;
  border-radius: 24px;
  display: flex;

  background: #e0e5ec;
  box-shadow:  5px 5px 10px #bec3c9,
  -5px -5px 10px #ffffff;

}



#side-container{
  display: flex;
  margin-right: 40px;
  margin-bottom: 40px;
  margin-top: 20px;
  border-radius: 24px;

  background: #e0e5ec;
  box-shadow:  5px 5px 10px #ccd0d7,
  -5px -5px 10px #f4faff;


}


#meeting-app{
  z-index: 0;
}
</style>