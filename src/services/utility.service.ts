export default class UtilityService {
   public static getUserData() {
    const temp = localStorage.getItem('userData');
    let userData = null;
    if (typeof temp === "string") {
      userData = JSON.parse(temp);
    }
    return userData
  }
}
