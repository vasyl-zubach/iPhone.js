define([
	'jquery',
	'text!../tpl/iphone.html',
	'text!../tpl/sounds.html'
], function($, tpl_iphone, tpl_sounds) {

	var listenHash = function(){
			var $iphone_black_bg = $('.iphone-black-bg'),
				$color_set = $('.color-set'),
				$btn_tweet_color = $('.btn-color-tweet');

			var hash = window.location.hash.toLowerCase(),
				update_hash = function(hash){
					$iphone_black_bg.css('background-color', hash);
					$color_set.find('a').removeClass('on');
					$(hash.toLowerCase() + '_color').addClass('on');
					$btn_tweet_color.attr('href', 'https://twitter.com/share?url=&text=' + encodeURIComponent('So awesome! What do you think about my color version of iPhone 4 in pure CSS3? (made by @TjRus) http://tjrus.com/iphone' + window.location.hash));
				};

			if (hash != '') {
				update_hash(hash);
			}
			setInterval(function(){
				if (hash != window.location.hash) {
					hash = window.location.hash.toLowerCase();
					update_hash(hash);
				}
			}, 100);
		},

		updateColors = function(){
			var tpl = {
				start: '<li class="first"><a href="#000000" id="000000_color" style="background: #000000"></a></li>',
				color: '<li><a href="#{{color}}" id="{{color}}_color" style="background: #{{color}}"></a></li>',
				end: '<li class="last"><a href="#ffffff" id="ffffff_color" style="background: #ffffff"></a></li>',
				random : '<li class="color-set-random">Random</li>'
			},
			colors = '012345678abcdef'.split(''),
			html = '',
			$colors = $('.color-set'),
			$random = $('.color-set-random');

			$random.off();

			for(var i = 0; i < 10; i++){
				var color_string = '';
				for(var j = 0; j < 6; j++){
					color_string += colors[Math.floor(Math.random() * 15)];
				}
				html += tpl.color.replace(new RegExp( '{{color}}', 'g' ), color_string);
			}
			$colors.html(tpl.start + html + tpl.end + tpl.random);

			$random = $('.color-set-random');
			$random.on('click', function(){
				updateColors();
				var $a = $colors.find('a');
				window.location = $a.eq(Math.floor(Math.random() * $a.length)).attr('href');
			});
		};

	return {
		init: function(){
			updateColors();
			listenHash();
		}
	};
});