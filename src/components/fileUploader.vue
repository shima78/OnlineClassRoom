<template>
  <div class="file">
    <form @submit.prevent="" enctype="multipart/form-data">
      <div class="fields">
        <label>
        </label><br/>
        <input class="round-button pdf-button custom-file-input photo-upload-button"
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
          console.log("UNDEFINED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",this.message)
          console.log("response",JSON.stringify(this.message))
          const str = JSON.stringify(this.message)
          console.log(JSON.parse(str))
          const filename = this.message.data.file.filename
          console.log(filename)
          this.server.emit('fileUpload',filename)
        }
        catch(err){
          console.log('tried',err.response.data.error)
          console.log(err);
          this.message = err.response.data.error
        }
      }
    },



  }

}
</script>


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

.photo-upload-button::before{
  content: '\e251';
}

</style>