<template>
  <div class="file">
    <form @submit.prevent="" enctype="multipart/form-data" style="max-height: 40px; max-height: 40px">
      <div class="fields" style="max-height: 40px; max-width: 40px">
        <input v-if="pdf"
            class="round-button custom-file-input pdf-upload-button"
            type="file"
            ref="file"
            @change="onSelect"
        />
        <input  v-if="picture"
            class="round-button custom-file-input picture-upload-button"
               type="file"
               ref="file"
               @change="onSelect"
        />
      </div>

    </form>


  </div>
</template>

<script>
import axios from 'axios';
import {mapGetters} from "vuex";
export default {
  name: 'FileUpload',
  data() {
    return {
      file:"",
      message:"",
      server:this.$store.getters.getServer,
    }
  },
  props:{
    pdf: Boolean,
    picture: Boolean
  }
  ,
  methods: {
    ...mapGetters(['getServer']),

    async onSelect(){
      //const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      const file = this.$refs.file.files[0];
      console.log('file',file)
      this.file = file;
      //if(!allowedTypes.includes(file.type)){
      //  this.message = "Filetype is wrong!!"
      //}
      if(file.size>50000000){
        console.log('file size')
        this.message = 'Too large, max size allowed is 500kb'
      }
      else {
        console.log('sending to server')
        const formData = new FormData();
        formData.append('file',this.file);
        try{

          await axios.post('http://localhost:3000/upload',formData).then(response => (this.message = response));
          // this.message = 'Uploaded!!'
          //console.log("UNDEFINED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",this.message)
          console.log("response",JSON.stringify(this.message))
          const str = JSON.stringify(this.message)
          console.log(JSON.parse(str))
          const filename = this.message.data.file.filename
          console.log(filename)
          if(this.picture){
            this.server.emit('fileUpload',filename)
          }
          else if(this.pdf){
            this.server.emit('uploadPDF',filename,this.message.data.file.originalname)
          }
        }
        catch(err){
          console.log('tried',err.response.data.error)
          console.log(err);
          this.message = err.response.data.error
        }
      }
    }




  },


}
</script>

<style src="../style/neuMeet.css"></style>
<style>
.file{
  max-height: 40px;
}
.custom-file-input::-webkit-file-upload-button {
  visibility: hidden;
}
.custom-file-input::before {
  font-family: "Material Icons Outlined";

  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
  white-space: nowrap;
  -webkit-user-select: none;
  cursor: pointer;
  font-size: 25px;
  width: 100%;
  height: 100%;
  border-radius: 50px;
  color: #7389a9;
}

.custom-file-input:active::before {
  color: #ff7c74;

}

.custom-file-input::-webkit-file-upload-button {
  visibility: hidden;
}
.custom-file-input::before {
  font-family: "Material Icons Outlined";

  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
  white-space: nowrap;
  -webkit-user-select: none;
  cursor: pointer;
  font-size: 25px;
  width: 100%;
  height: 100%;
  border-radius: 50px;
  color: #7389a9;
}

.custom-file-input:active::before {
  color: #ff7c74;
}


.picture-upload-button::before{
  content: '\e251';
}


.pdf-upload-button::before{
  content: '\e2c6';
}
</style>