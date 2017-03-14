var request = require('request');
var fs = require('fs');
var GITHUB_USER = "leanneherrndorf";
var GITHUB_TOKEN = "9f4b43ca9e916d6914b8682baab62f6551be9455";
var avatarURL = [];
var loginVAL = {};
var owner = process.argv[2];
var repo = process.argv[3];

console.log('Welcome to the GitHub Avatar Downloader!');


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

//Construct URL, return an array of contributors
function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  //console.log(requestURL);

  var options = {
    url: requestURL,
    headers: {
      'User-Agent': 'request'
    }
  };

  //retun array of contributors, call callback function
  request(options, function(err, response, body) {
    if (err) throw err;

    if (response && response.statusCode !== 200) {
      console.log("Response was not 200!", response);
      return false;
    }
    //console.log('Response Status Code:', response.statusCode);
    //Constructs an array of contributors
    var result = JSON.parse(body);

    //Call callback function
    cb(err, result);
  });
}

//Download image for desired avatar url
function downloadImageByURL(url, filePath) {
  request.get(url)
       .on('error', function (err) {
         throw err;
       })
       //Notify user if a response code other than 200 is received
       .on('response', function (response) {
        //console.log('Response Status Code: ', response.statusCode);
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


