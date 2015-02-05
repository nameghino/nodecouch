# nodecouch
A lightweight interface to a CouchDB instance

```
var nc = require('./nodecouch.js');
var db = new nc('localhost', 'movies');

// Store a movie
var movie = {
	'title': 'Apollo 13',
	'year': 1995,
	'directors': ['Ron Howard'],
	'cast': ['Tom Hanks', 'Gary Sinise', 'Kevin Bacon', 'Bill Paxton', 'Ed Harris'],
	'poster': 'http://www.reellifewithjane.com/wp-content/uploads/2014/06/Apollo-13-Poster.jpg'
}

db.storeDocument('apollo13', movie, function(err, result) {
	if (err) { console.dir(err); return; }
	console.log('stored under revision ' + result.rev);
});

// Fetch a key
db.loadDocument('apollo13', function(err, obj) {
	if (err) { console.dir(err); return; }
	console.log('got object:');
	console.dir(obj);
}
```

BTW, the above snippets were written at 2 AM and not checked, sry :(
