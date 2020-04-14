import HttpService from '../../services/http.service'

export default {
  data () {
    return {
      formData: {
        profileImage: ''
      },
      userData: {
        profileImage: ''
      },
      uploadedImage: '',
      isFormEditable: false
    }
  },
  methods: {
    getUserData () {
      HttpService.post('user-profile', { userId: '5e8df3227614ad37304affab' }).then(res => {
        console.log('result', res)
        this.userData = res.data.data
      })
    },
    getImageUrl (url) {
      console.log(process.env.VUE_APP_base_url + url)
      return process.env.VUE_APP_base_url + url
    },
    onImageUpload (type, event) {
      if (event.target.files && event.target.files[0]) {
        const reader = new FileReader()
        reader.onload = (e) => {
          console.log('sdsdsd', e);
          this.userData.profileImage = e.target.result;
          reader.readAsDataURL(event.target.files[0])
        }
      }
    },
    updateUserProfile() {
      HttpService.post('update-user-profile', {bio: this.userData.bio})
        .then(res => {
          console.log('response', res);
          this.isFormEditable = !this.isFormEditable;
        })
    }
  },
  computed: {},
  mounted () {
    this.getUserData()
  }
}
