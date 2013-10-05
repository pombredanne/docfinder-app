//  =====================
//  = Author: Varemenos =
//  =====================

$(function () {
	function getResults() {
		// get the keyword
		query = $('#query').val();
		// get the selected language
		lang = $('#lang').find('option:selected').text();

		// if its set to All
		if (lang == 'All') {
			// then just empty the string
			lang = '';
		}

		// ajax call
		$.ajax({
			dataType: 'jsonp',
			jsonp: 'callback',
			url: 'http://searchco.de/api/jsonp_search_IV/?q=' + lang + ' ' + query + '&p=' + (params.page - 1) + '&callback=?',
			success: function (data) {
				// if the results are more than 10
				if (data.total > 10) {
					// then calculate pages
					pages = parseInt(data.total / 10, 10);
					if ((data.total % 10) > 0) {
						pages++;
					}
				} else {
					// else there is only 1 page
					pages = 1;
				}

				// hide the results div
				$('#results').hide();

				// if data were returned
				if(data.total !== null){
					// print data returned
					$("#info h3").html('Found "' + data.total + '" results.');
				}else{
					// else ask for data
					$("#info h3").html('Please enter a keyword first');
				}

				// delete any already loaded results from previous queries
				$('#results .result').remove();

				// create the result HTML
				for (var i = 0; i < data.results.length; i++) {
					$("#results").append('<div class="result"><h3><a class="resultLink" href="' + data.results[i].url + '">' + data.results[i].name + '</a><span class="label">' + data.results[i].type + '</span></h3><hr /><p class="description">' + data.results[i].description + '</p><p class="synopsis">' + data.results[i].synopsis + '</p><div class="namespace">' + data.results[i].namespace + '</div></div>');
				}

				// empty the .page dropdown options
				$('.page').html('').removeAttr('disabled');
				// fill the .page dropdown with page options
				for (i = 0; i < pages; i++) {
					$('.page').append('<option name=' + (i + 1) + ' value=' + (i + 1) + '>' + (i + 1) + '</option>');
				}

				// finally enable the .page dropdown
				$('.page option[name=' + params.page + ']').attr("selected", true);

				// and display results
				$('#results').fadeIn('250', function () {
					// then scroll to the #results
					var offset = $("#info").offset().top;
					$('html, body').animate({scrollTop: offset}, 250);
				});
			}
		});
	}

	var params = {
		q: "",
		lang: "",
		page: 1
	};

	// Events

	// on form submit event
	$('form').on("submit", function (e) {
		e.preventDefault();
		getResults();
	});

	// on page change event
	$('.page').on("change", function () {
		params.page = $(this).find('option:selected').val();
		getResults();
		$(this).find('option[name=' + params.page + ']').attr("selected", true);
	});

	// on page change event
	$(".page select").on("mouseup", function (e) {
		e.preventDefault();
		$(this).find('option[name=' + params.page + ']').attr("selected", true);
	});
});
