/*!
 * iPhone4 on CSS3
 * http://tjrus.com/iphone
 *
 * Copyright (c) 2011-2012 Vasiliy Zubach
 *
 * Author	Vasiliy Zubach 
 */
 
 var TIME = 400;
var letters_interval;

$(document).ready(function(){

	iphone.init();	

});


iphone = {
	
	slide_started 		: false,
	
	letter_animate_time 	: 50,
	
	panels_animate_time	: 400,
	
	status 			: 'lock',	// lock, unlock, call, answer, off
	
	voice_off			: true,	// true, false
	
	volume			: 0.5, 		// 0 >= voice <= 1
	
	iconsDefaultPosition	: {},
	
	iconsOutPosition		: {},
	
	color : '#000',

	/* init iPhone functions */
	init : function(){

		iphone.slideInitiate();
		
		iphone.soundFix();

		$('#iphone_home_button').click(function(){
			if(iphone.status == 'off'){
				iphone.turnOn();
			}
		});

		iphone.prepareTextAnimate();
		
		iphone.startTextAnimate();
		
		iphone.prepareIcons();
		
		$('#iphone_power_button').click(function(){
			switch(iphone.status){
				case 'off':
					iphone.turnOn();
					break;

				case 'lock':
					iphone.turnOff();
					break;

				case 'unlock':
					iphone.turnOff();
					break;
			}
		});
		
		iphone.timeUpdate();
		
		switch(iphone.status){
			case 'off':
				iphone.turnOff();
				break;

			case 'lock':
				iphone.lock();
				break;

			case 'unlock':
				iphone.unlock();
				break;
		}
		
/*
		$('.icon').children('div').click(function(){
			iphone.alert();
		});
*/
		
		setTimeout(function(){
			iphone.alert();
		}, 10000);

	},


	slideInitiate : function(){
	
		if ( ! iphone.is_mobile()) {

			
			$('#iphone_slider').mousedown(function(e){
			
				e.preventDefault();
				
				var self = this;
				var element = $(this).offset();
				
				element.width = $(this).width();
				element.height = $(this).height();
				element.css_left = parseInt($(this).css('left')); 

				mouse_position = {
					x : e.pageX - element.left,
				};
				
				slide_area_width = parseInt($('#iphone_unlock').width());
				slider_left = parseInt($('#iphone_slider').css('left'));

				$(document).mousemove(function(e){

					iphone.slide_started = true;
					var x = e.pageX - element.left;

					var properties = { left: element.css_left + x - mouse_position.x }
					
					properties.left = (properties.left > slide_area_width - element.width - 5) ? slide_area_width - element.width - 5 : properties.left;
					properties.left = (properties.left < slider_left) ? slider_left : properties.left;

					var opacity_k = (slide_area_width - properties.left*3) / (slide_area_width);
					$('#iphone_slide2unlock').css({'opacity': opacity_k}, TIME/2);

					$(self).css(properties);
					
				});
			})
			$(document).mouseup(function(){
				if(iphone.slide_started) {
					$(document).unbind('mousemove');
					iphone.endSlide();
					iphone.slide_started = false;
				}
			});
			
		} else {
			
			$('#iphone_slider').bind("touchstart", function(e){
			
				e.preventDefault();

				var orig = e.originalEvent;
				
				var self = this;
				var element = $(this).offset();
				
				element.width = $(this).width();
				element.height = $(this).height();
				element.css_left = parseInt($(this).css('left')); 

				mouse_position = {
					x : orig.changedTouches[0].pageX - element.left,
				};
				
				slide_area_width = parseInt($('#iphone_unlock').width());
				slider_left = parseInt($('#iphone_slider').css('left'));

				$(document).bind("touchmove", function(e){

					var x = orig.changedTouches[0].pageX - element.left;

					var properties = { left: element.css_left + x - mouse_position.x }
					
					properties.left = (properties.left > slide_area_width - element.width - 5) ? slide_area_width - element.width - 5 : properties.left;
					properties.left = (properties.left < slider_left) ? slider_left : properties.left;

					var opacity_k = (slide_area_width - properties.left*3) / (slide_area_width);
					$('#iphone_slide2unlock').css({'opacity': opacity_k}, TIME/2);

					$(self).css(properties);
					
				});
			}).bind("touchend", function(){
				$(document).unbind('touchmove');
				iphone.endSlide();
			});
		}
	},


	/* function unlocks iPhone or back slider to start */
	endSlide : function(){
		var slider_left = parseInt($("#iphone_slider").css('left'));
		if ( slider_left > (parseInt($('#iphone_unlock').width()) - parseInt($('#iphone_slider').width()) - 20)) {
			iphone.unlock();
		} else {
			var time_k = slider_left / (parseInt($('#iphone_unlock').width()) - parseInt($('#iphone_slider').width()) - 20);
			$('#iphone_slider').animate({'left': '0'}, (TIME * time_k) * 2 / 3);
			$('#iphone_slide2unlock').stop().animate({'opacity': '1'}, (TIME * time_k) * 2 / 3);
		}
	},


	turnOn : function(){
		if (iphone.status != 'off') 
			return;
	
		iphone.status = 'lock';

		$('.iphone_display').removeClass('off');
		
		$('#iphone_headline').children('.iphone_lock').show();
		$('#iphone_headline_clock').hide();
		
		$('#iphone_slider').css({'left': '0'});
		$('#iphone_slide2unlock').css({'opacity': '1'});
				
		$('#iphone_headline').css({'top':'0'});
		$('#iphone_lock_header').css({'top':'20px'});
		$('#iphone_lock_footer').css({'bottom':'0'});
		
		$('#iphone_dock').css({'bottom': '-80px'});
		
		iphone.hideIcons();

		iphone.updateStatus();
	},


	turnOff : function(){
	
		iphone.soundLock();

		iphone.status = 'off';
		
		$('.iphone_display').addClass('off');
				
		$('#iphone_headline').css({'top':'-20px'});
		$('#iphone_lock_header').css({'top':'-113px'});
		$('#iphone_lock_footer').css({'bottom':'-97px'});
		
		$('#iphone_dock').css({'bottom': '-80px'});
		
		iphone.hideIcons();

		iphone.updateStatus();
		
		iphone.quick_hide_alert();
	},


	lock : function(){
		
		iphone.status = 'lock';

		$('.iphone_display').removeClass('off');

		$('#iphone_headline').children('.iphone_lock').show();
		$('#iphone_headline_clock').hide();
		
		$('#iphone_slider').css({'left': '0'});
		$('#iphone_slide2unlock').css({'opacity': '1'});
				
		$('#iphone_headline').stop().animate({'top':'0'}, iphone.panels_animate_time);
		$('#iphone_lock_header').stop().animate({'top':'20'}, iphone.panels_animate_time);
		$('#iphone_lock_footer').stop().animate({'bottom':'0'}, iphone.panels_animate_time);
		
		$('#iphone_dock').stop().animate({'bottom': '-80'}, iphone.panels_animate_time);
		
		iphone.animateHideIcons();

		iphone.updateStatus();
	},


	unlock : function(){
		
		iphone.soundUnlock();

		iphone.status = 'unlock';

		$('.iphone_display').removeClass('off');
		
		$('#iphone_headline').animate({'top':'0'}, iphone.panels_animate_time);
		$('#iphone_headline').children('.iphone_lock').hide();
		$('#iphone_headline_clock').show();
		
		$('#iphone_lock_header').animate({'top':'-113'}, iphone.panels_animate_time);
		$('#iphone_lock_footer').animate({'bottom':'-97'}, iphone.panels_animate_time);

		$('#iphone_dock').stop().animate({'bottom': '4'}, iphone.panels_animate_time);
		
		iphone.showIcons();

		iphone.updateStatus();
	},


	alert : function(text){
		if (text != null)
			$('#iphone_alert .text').html(text);
			
		var properties = {
			'-webkit-transform' : 'scale(1)',
			   '-moz-transform' : 'scale(1)',
			    '-ms-transform' : 'scale(1)',
			     '-o-transform' : 'scale(1)',
			        'transform' : 'scale(1)',
			'-webkit-transition' : 'all 0.3s',
			   '-moz-transition' : 'all 0.3s',
			    '-ms-transition' : 'all 0.3s',
			     '-o-transition' : 'all 0.3s',
			        'transition' : 'all 0.3s',
		}
		$('#iphone_alert').css(properties);
	},
    
	hide_alert : function(){
		var properties = {
			'opacity' : '0',
			'-webkit-transition' : 'all 0.3s',
			   '-moz-transition' : 'all 0.3s',
			    '-ms-transition' : 'all 0.3s',
			     '-o-transition' : 'all 0.3s',
			        'transition' : 'all 0.3s',
		}
		$('#iphone_alert').css(properties);
		setTimeout(function(){
			iphone.quick_hide_alert();
		},300);
	},
	
	quick_hide_alert : function(){
		properties = {
			'opacity' : '1',
			'-webkit-transform' : 'scale(0)',
			   '-moz-transform' : 'scale(0)',
			    '-ms-transform' : 'scale(0)',
			     '-o-transform' : 'scale(0)',
			        'transform' : 'scale(0)',
			'-webkit-transition' : 'none',
			   '-moz-transition' : 'none',
			    '-ms-transition' : 'none',
			     '-o-transition' : 'none',
			        'transition' : 'none',
		}
		$('#iphone_alert').css(properties);
	},

	showIcons : function(){
		var icons = $('#iphone_icons_containter').children('.icon');
		for( var i = 0; i< icons.length; i++ ){
			$(icons[ i ]).stop().animate({'left' : iphone.iconsDefaultPosition[ i ][ 'left' ] , 'top': iphone.iconsDefaultPosition[ i ][ 'top' ]} , iphone.panels_animate_time);
		}
	},


	hideIcons : function(){
		var icons = $('#iphone_icons_containter').children('.icon');
		for( var i = 0; i< icons.length; i++ ){
			$(icons[ i ]).css({'left' : iphone.iconsOutPosition[ i ][ 'left' ] , 'top': iphone.iconsOutPosition[ i ][ 'top' ]});
		}
	},


	animateHideIcons : function(){
		var icons = $('#iphone_icons_containter').children('.icon');
		for( var i = 0; i< icons.length; i++ ){
			$(icons[ i ]).stop().animate({'left' : iphone.iconsOutPosition[ i ][ 'left' ] , 'top': iphone.iconsOutPosition[ i ][ 'top' ]}, iphone.panels_animate_time);
		}
	},


	prepareIcons : function(){
		var icons = $('#iphone_icons_containter').children('.icon');
		for( var i = 0; i< icons.length; i++ ){
			iphone.iconsDefaultPosition[ i ] = {};
			iphone.iconsOutPosition[ i ] = {};

			var tmp_left = $(icons[ i ]).css('left');
			tmp_left = tmp_left.replace(new RegExp("px",'g'),"");

			var tmp_top = $(icons[ i ]).css('top');
			tmp_top = tmp_top.replace(new RegExp("px",'g'),"");

			iphone.iconsDefaultPosition[ i ][ 'left' ] = parseInt(tmp_left);
			iphone.iconsDefaultPosition[ i ][ 'top' ] = parseInt(tmp_top);
			

			if (i == 0 || i == 1 || i == 4 || i == 5 ){
					iphone.iconsOutPosition[ i ][ 'left' ] = parseInt(tmp_left) - 200;
					iphone.iconsOutPosition[ i ][ 'top' ] = parseInt(tmp_top) - 200;
			}

			if (i == 2 || i == 3 || i == 6 || i == 7 ){
					iphone.iconsOutPosition[ i ][ 'left' ] = parseInt(tmp_left) + 200;
					iphone.iconsOutPosition[ i ][ 'top' ] = parseInt(tmp_top) - 200;
			}

			if (i == 8 || i == 9 || i == 12 || i == 13 ){
					iphone.iconsOutPosition[ i ][ 'left' ] = parseInt(tmp_left) - 200;
					iphone.iconsOutPosition[ i ][ 'top' ] = parseInt(tmp_top) + 200;
			}

			if (i == 10 || i == 11 || i == 14 || i == 15 ){
			
					iphone.iconsOutPosition[ i ][ 'left' ] = parseInt(tmp_left) + 200;
					iphone.iconsOutPosition[ i ][ 'top' ] = parseInt(tmp_top) + 200;
			}
			
			
			$(icons[ i ]).css({'left' : iphone.iconsOutPosition[ i ][ 'left' ] , 'top': iphone.iconsOutPosition[ i ][ 'top' ]});
		}
	},


	updateStatus : function(){
		var set_status = (iphone.status == 'off') ? 'turned off' : (iphone.status == 'lock') ? 'turned on and locked' : 'turned on and unlocked';
		$('#current_status').html(set_status);
	},


	timeUpdate : function(){
		var date = new Date();
		var week_days = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
		var year_month = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
		var minutes = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();
		var hours = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours();
		$('#iphone_lock_time').html(hours + '<span>:</span>' + minutes);
		$('#iphone_headline_clock').html(hours + ':' + minutes);
		$('#iphone_lock_date').html(week_days[date.getDay()] + ', ' + year_month[date.getMonth()] + ' ' + date.getDate());
		
		$('#iphone_icon_day').html(week_days[date.getDay()]);
		$('#iphone_icon_day_num').html(date.getDate());
	
		setTimeout("iphone.timeUpdate()", (1000 * (60 - date.getSeconds())));
	},
	
	
	stopTextAnimate : function(){
		if (iphone.is_mobile()) { return }

		clearInterval(letters_interval);
	},
	
	
	startTextAnimate : function(){
		if (iphone.is_mobile()) { return }

		iphone.animateLetters();
	},
	
	
	prepareTextAnimate : function () {
		var start_text = $('#iphone_slide2unlock').html();
		var end_text = '';
		for(var i = 0; i< start_text.length; i++){
			end_text += '<span style="opacity:0.3">' + start_text.charAt(i) + '</span>';
		}
		$('#iphone_slide2unlock').html(end_text);
		
		var spans = $('#iphone_slide2unlock').children('span');
		for (var i = 0; i < spans.length; i++){
			$(spans[ i ]).attr('id', 'spans_'+i);
		}
	},
	
	
	animateLetters : function() {
		setTimeout(function(){
			iphone.animateCicle();
		}, iphone.pannels_animate_time);
		
		letters_interval = setInterval(function(){
			iphone.animateCicle();
		},2500);
	},


	animateCicle : function(){
		for (var i = 0; i < 15; ++i) {
			(function(i) {
				setTimeout(function(){
					$('#spans_'+i).stop().animate({'opacity':'1'}, iphone.letter_animate_time, function(){
						setTimeout(function(){ $('#spans_' + i).stop().animate({'opacity':'0.3'}, iphone.letter_animate_time) }, iphone.letter_animate_time*4);
					});
				}, (i * iphone.letter_animate_time*1.2));
			})(i);
		}
	},	
	

	soundFix : function(){
		if (iphone.is_mobile()) { return }
		
		return;
		var id = 'soundLock';
		document.getElementById(id).volume = 0;
		document.getElementById(id).play();

		id = 'soundUnlock';
		document.getElementById(id).volume = 0;
		document.getElementById(id).play();
	},


	soundLock : function(){
		if (iphone.is_mobile()) { return }

		var id = 'soundLock';
		document.getElementById(id).pause();
		document.getElementById(id).currentTime = 0;
		document.getElementById(id).volume = iphone.volume;
		document.getElementById(id).play();
	},
	
	
	soundUnlock : function(){
		if (iphone.is_mobile()) { return }
		
		var id = 'soundUnlock';
		document.getElementById(id).volume = 0.3;
		document.getElementById(id).pause();
		document.getElementById(id).currentTime = 0;
		document.getElementById(id).volume = iphone.volume;
		document.getElementById(id).play();
	},
	
	
	is_mobile : function() {
		var userAgent = navigator.userAgent.toString().toLowerCase();
		return (userAgent.indexOf('mobile') != -1) ? true : false;
	},	
}