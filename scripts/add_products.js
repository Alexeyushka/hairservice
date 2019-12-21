console.log("add_products running");

const button = document.getElementById('add_tea');
button.addEventListener('click', function(e) {
	console.log('tea added');
	
	fetch('/tea_added', {method: 'POST'})
		.then(function(response) {
			if (response.ok) {
				console.log('Click was recorded');
				return;
		}
	})
		.catch(function(error) {
			console.log(error);
	});
});

