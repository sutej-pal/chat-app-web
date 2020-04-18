import HttpService from '../../services/http.service'
import UtilityService from '../../services/utility.service'

export default {
  data () {
    return {
      userId: '',
      formData: {
        profileImage: ''
      },
      userData: {},
      profileImage: {
        file: ''
      },
      isFormEditable: false,
      activeUser: ''
    }
  },
  methods: {
    getUserData () {
      HttpService.post('user-profile', {userId: this.userId}).then(res => {
        this.userData = res.data.data
      })
    },
    getImageUrl (url) {
      return process.env.VUE_APP_base_url + url
    },
    async onImageUpload (type, e) {
      this.profileImage.file = e.target.files[0];
      this.profileImage.object = URL.createObjectURL(this.profileImage.file)
      const formData = new FormData();
      formData.append('file', this.profileImage.file)
      await HttpService.post('update-profile-image', formData);
    },
    updateUserProfile() {
      HttpService.post('update-user-profile', {id: this.userData.id, bio: this.userData.bio})
        .then(_ => {
          this.isFormEditable = !this.isFormEditable;
        })
    }
  },
  computed: {},
  mounted () {
    this.activeUser = UtilityService.getUserData();
    this.userId = this.$route.params.userId;
    this.getUserData();
  }
}
