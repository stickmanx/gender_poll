var http = require('http');
var fs = require('fs');
var url = require('url');
var io = require('socket.io');


var server = http.createServer(function (request, response) {

	var file_path = "";
	var mimes = {
		'css': 'text/css',
		'js': 'text/javascript',
		'htm': 'text/html',
		'html': 'text/html'
	}

	var url_request = url.parse(request.url).pathname;
	var tmp = url_request.lastIndexOf(".");
	var ext = url_request.substring((tmp + 1))

	console.log(ext);

	if(url_request == '/' || url_request == '/index.html') {
		file_path = "index.html";
	}

	if(ext == 'css' || ext == 'js' || ext =='htm' || ext == 'html') {
		file_path = url_request.replace("/", "");
	}

	fs.readFile(file_path, function(error, data) {
		if(error) {
			response.writeHeader(500, {"Content-Type": "text/html"});
			response.write("<h1>Internal Server Error!</h1>");
		}
		else
		{
			response.writeHeader(200, {"Content-Type": mimes[ext]});
			response.write(data);
		}

		response.end();
	});

});

server.listen(8000);
console.log('Server running in localhost port 8000');

var sockets = io.listen(server);

sockets.on('connection', function (socket) {

	socket.on('vote_male', function () {
		console.log('vote_male received');

		var get_poll = function(errors, content) {

			var poll = JSON.parse(content);

			poll = {'males':poll.males+1, 'females':poll.females};


			fs.writeFile('poll.txt', JSON.stringify(poll), 'utf8', function() {
				console.log('write file complete');
			});

			console.log(poll);
			sockets.sockets.emit('gender_info', poll);
			
		}

		fs.readFile('poll.txt', 'utf8', get_poll);
	});

	socket.on('vote_female', function () {
		console.log('vote_male received');

		var get_poll = function(errors, content) {

			var poll = JSON.parse(content);

			poll = {'males':poll.males, 'females':poll.females+1};


			fs.writeFile('poll.txt', JSON.stringify(poll), 'utf8', function() {
				console.log('write file complete');
			});
			console.log(poll);
			sockets.sockets.emit('gender_info', poll);
			
		}

		fs.readFile('poll.txt', 'utf8', get_poll);
	});

	socket.on('load_chart', function() {
		var get_poll = function(errors, content) {

			var poll = JSON.parse(content);

			sockets.sockets.emit('gender_info', poll);
		}

		fs.readFile('poll.txt', 'utf8', get_poll);		
	})
});

// reset the array poll.txt file change the current count




