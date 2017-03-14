//Leanne Herrndorf
//Lighthouse Labs Project 1
//
//This project requests avatars for all contributers to a given project on GitHub, and downloads them to disk.


var request = require('request');
var fs = require('fs');
var GITHUB_USER = "leanneherrndorf";
var GITHUB_TOKEN = "9f4b43ca9e916d6914b8682baab62f6551be9455";
var avatarURL = [];
var loginVAL = {};
var owner = process.argv[2];
var repo = process.argv[3];

console.log('Welcome to the GitHub Avatar Downloader!');

//Construct URL, return an array of contributors, call callback function
function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = 'https://' + GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';

  var options = {
    url: requestURL,
    headers: {
      'User-Agent': 'request'
    }
  };

  request(options, function(err, response, body) {
    if (err) {
      throw err;
    }
    if (response && response.statusCode !== 200) {
      console.log("Response was not 200!", response);
      return false;
    }

    var result = JSON.parse(body);
    cb(err, result);
  });
}

//Download image with input url and outputs to desired download filePath
function downloadImageByURL(url, filePath) {

  //if avatars folder does not yet exist, create it
  if(!fs.existsSync("./avatars")) {
    fs.mkdirSync("./avatars");
  }
  request.get(url)
        .on('error', function (err) {
          throw err;
        })

       .on('response', function (response) {
         //Notify user if a response code other than 200 is received
         if (response && response.statusCode !== 200) {
           console.log("Response was not 200!", response);
           return false;
         }
       })
       //Notify user that image is downloading
       .on('end', function (end) {
         console.log('Downloading image...');
       })
       //Notify user that image is finished downloading
       .pipe(fs.createWriteStream(filePath))
       .on('finish', function(finish) {
         console.log('Download complete.');
       });
}

//Ensure owner and user are passed in command line argument, if not request in console.
if( owner && repo) {
  //Call getRepoContributors function
  getRepoContributors(owner, repo, function(err, result) {
    console.log("Errors:", err);
    //For each in item in array, construct a file path with the login value, and download the avatar at the constructed URL
    for( var x in result) {
      loginVAL = "avatars/" + result[x].login + ".jpg";
      avatarURL = result[x].avatar_url;
      downloadImageByURL(avatarURL, loginVAL);
    }
  });
} else {
  console.log('Please input owner and repo.');
}






