var request = require('request');
var fs = require('fs');
var GITHUB_USER = "leanneherrndorf";
var GITHUB_TOKEN = "9f4b43ca9e916d6914b8682baab62f6551be9455";
var avatarURL = [];
var loginVAL = {};


console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  console.log(requestURL);

  var options = {
    url: requestURL,
    headers: {
      'User-Agent': 'request'
    }
  };

  request(options, function(err, response, body) {
    if (err) throw err;
    console.log('Response Status Code:', response.statusCode);
    var result = JSON.parse(body);
    cb(err, result);
  });
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);

  for( var x in result) {
    loginVAL = "avatars/" + result[x].login + ".jpg";
    avatarURL = result[x].avatar_url;
    downloadImageByURL(avatarURL, loginVAL);
  }
});


function downloadImageByURL(url, filePath) {

  request.get(url)               // Note 1
       .on('error', function (err) {
         throw err;
       })
       .on('response', function (response) {
         console.log('Response Status Code: ', response.statusCode);
       })
       .on('end', function (end) {
        console.log('Downloading image...');
      })
       .pipe(fs.createWriteStream(filePath))

       .on('finish', function(finish) {
          console.log('Download complete.');
       });

}


