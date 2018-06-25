(() => { 	// simple arrow function (from top to bottom)
					//to avoid working in the global scope
	function clean(node) {
		for(var n = 0; n < node.childNodes.length; n++) {
			var child = node.childNodes[n];
			if(
				child.nodeType === 8 ||
				(child.nodeType === 3 && !/\S/.test(child.nodeValue))
			) {
				node.removeChild(child);
				n--;
			} else if(child.nodeType === 1) {
				clean(child);
			}
		}
	}
	// This function "clean" avoids having empty DOM nodes "#text"
	// (caused by tabs and returns in html file),
	// and thus avoids selectable empty strings in the page
	clean(document.body);



	$(document).ready(function() {

		$('#rectListener').on('click', function() {
			resetCategorizedDisplay();
		});
		$('.this').not('.nb').on('click', function() {
			resetCategorizedDisplay();
		});

		let categoriesArray = ['.illus', '.design', '.code'];

		let categorizeDisplay = (_class) => {
			return function() {

				if(!$(this).hasClass('activ')) { // if this has NOT the activ class
					$('.thumbnail' + _class).removeClass('hidden'); // div with the .thumbnail AND activated classes
					$('.thumbnail' + _class).addClass('activ');

					$('.thumbnail').not(_class).not('.nb').addClass('hidden');
					$('.thumbnail').not(_class).not('.nb').removeClass('activ');

					$(_class + ' .nb').removeClass('hidden');
					$(_class + ' .nb').addClass('activ');
					$('.thumbnail').not(_class).children().addClass('hidden');
					// $('.thumbnail').not(_class).children().removeClass('activ');

					$(this).addClass('activ');
					$('.categories p').not(this).removeClass('activ');

				} else {
					resetCategorizedDisplay();

				}
			};
		};

		for(let category of categoriesArray) {
			$('.categories ' + category).click(categorizeDisplay(category));
		}


		function resetCategorizedDisplay() {
			$('.categories p').removeClass('activ');
			$('.thumbnail').removeClass('hidden');
			$('.thumbnail').removeClass('activ');
		}

		/*GOLD COLOR
		rgb(120,150,20)
		rgb(235,210,90)
		rgb(255,255,255)
		*/

		$('.thumbnail').not('.this').magnificPopup({
			type: 'ajax',
			// Delay in milliseconds before popup is removed
			removalDelay: 400,
			// Class that is added to popup wrapper and background
			// make it unique to apply your CSS animations just to this exact popup
			mainClass: 'mfp-fade',
			// other options
			fixedContentPos: true,

			callbacks: {
				open: function() {
					location.href = location.href.split('#')[0] + "#";
				},
				close: function() {
					if(location.hash) history.go(-1);
				}
			}
		});

	});

	$(window).on('hashchange', function() {

		if(location.href.indexOf("#") < 0) {

			$.magnificPopup.close();
		}
	});

})();
