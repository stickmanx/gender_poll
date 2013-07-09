$(document).ready(function() {
	$('#login').submit(function() {
		$.getJSON(
			$(this).attr('action'),
			$(this).serialize(),
			function(result) {
				if(result.success)
				{
					window.location = result.location;
				}
				else
				{
					$('#login_result').html(result.error);
				}
			}
		);
		return false;
	});
});

