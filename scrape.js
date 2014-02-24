var request = require('request'); 
var cheerio = require('cheerio');
var fs = require('fs'); 

var socialURLS = {
	'fb': /\bfacebook.com\b/, 
	'tw': /\btwitter.com\b/,
	'gplus': /\bplus.google.com\b/, 
	'ig': /\binstagram.com\b/
}


function socialScrape(url){
	var results = []; 

	request(url, function(err, resp, html){
	if(!err && resp.statusCode == 200){
		var $ = cheerio.load(html); 

		//find each of the links on this page 
		$('a').each(function(i, el){
			var a = $(el).attr('href'); 

			//test to see if the links are social media URLS
			for(var key in socialURLS){
				if(socialURLS[key].test(a) && results.indexOf(a) < 0){
					results.push(a); 
				}
			}	
		
		});
		console.log(results); 

		fs.appendFileSync('./data.txt', "*** Social urls for " + url + " ***" + '\n', 'utf-8')
		for(var i=0; i<results.length;i++){
			fs.appendFileSync('./data.txt', results[i] + '\n', 'utf-8')
		}
	}
});
}

fs.readFileSync('./urls.txt').toString().split('\n').forEach(function (line){
    socialScrape(line); 
  }); 
