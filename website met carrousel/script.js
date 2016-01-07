$(document).ready(function(){
	var slideShow = $('#slideShow'),
		ul = slideShow.find('ul'),
		li = ul.find('li'),
		cnt = li.length;

	updateZindex();

	if($.support.transform){
	// Modern browsers with support for css3 transformations
		slideShow.bind('showNext',function(){
			slideShow.trigger('rotateContainer',['next',90]);
		});
		
		slideShow.bind('showPrevious',function(){
			slideShow.trigger('rotateContainer',['previous',-90]);
		});
	}
	
	else{
	// Fallback for Internet Explorer and older browsers
		slideShow.bind('showNext',function(){
			$('li:first').fadeOut('slow',function(){
				$(this).remove().appendTo(ul).show();
				updateZindex();
			});
		});
		
		slideShow.bind('showPrevious',function(){
			var liLast = $('li:last').hide().remove().prependTo(ul);
			updateZindex();
			liLast.fadeIn('slow');
		});
	}

	$('#previousLink').click(function(){
		if(slideShow.is(':animated')){
			return false;
		}
		slideShow.trigger('showPrevious');
		return false;
	});
	
	$('#nextLink').click(function(){
		if(slideShow.is(':animated')){
			return false;
		}
		slideShow.trigger('showNext');
		return false;
	});
	
	function updateZindex(){
		ul.find('li').css('z-index',function(i){
			return cnt-i;
		});
	}
});