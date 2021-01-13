import * as AWS from "aws-sdk";
require('dotenv').config()
const activateAws = (activate: boolean = false) => {
  if (activate) {
    AWS.config.getCredentials(function (err) {
      if (err) { }
      //console.log(err.stack);
      // credentials not loaded
      else {
        AWS.config.update({ region: 'ap-south-1' })
        // console.log("Access key:", AWS.config.credentials.accessKeyId);
        // console.log("Region: ", AWS.config.region);
      }
    });
  }
}
export default activateAws