export default class UtilityService {
   public static getUserData() {
    const temp = localStorage.getItem('userData');
    let userData = null;
    if (typeof temp === "string") {
      userData = JSON.parse(temp);
    }
    return userData
  }

  public static async onImageUpload(event: { target: { files: Blob[] } }) {
     let base64String: string | ArrayBuffer | null;
     let file: Blob;
     return new Promise((resolve, reject) => {
       if (event.target.files && event.target.files[0]) {
         file = event.target.files[0];
         const reader = new FileReader();
         reader.readAsDataURL(event.target.files[0]);
         reader.onload = () => {
           base64String = reader.result;
           resolve({file, base64String})
         };
         reader.onerror = function (error) {
           console.log('Error: ', error);
         };
       }
     })
  }

  static getImageUrl (url: string) {
    return process.env.VUE_APP_base_url + url
  }
}
