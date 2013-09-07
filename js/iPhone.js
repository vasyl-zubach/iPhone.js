define( [
	'jquery',
	'text!../tpl/iphone.html',
	'text!../tpl/sounds.html'
], function ( $, tpl_iphone, tpl_sounds ){

	var animation_time = 400,
		identify = 'data-iphone',
		container = '.iphone-container',
		slider_width = 69,
		slide_container_width = 275 - 3,
		slide_zone = slide_container_width - slider_width,
		week_days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
		year_month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],

		class_alert_on = 'iphone-alert-on',
		class_alert_off = 'iphone-alert-off',
		class_slide_animation = 'iphone-slide2unlock-animation__on';


	var iPhone = function (){
		if ( !(this instanceof iPhone) ) {
			return new iPhone();
		}

		var self = this;

		self.id = 'tj' + (new Date()).getTime() + Math.floor( Math.random() * 1000 );

		self.is_mobile = (function (){
			var userAgent = navigator.userAgent.toString().toLowerCase();
			return (userAgent.indexOf( 'mobile' ) != -1) ? true : false;
		})();

		self.inited = false;
		return self.init();
	};
	var _proto = iPhone.prototype;

	_proto.init = function (){
		var self = this,
			el = '[' + identify + '="' + self.id + '"]';
		if ( self.inited ) {
			return self.destroy().init();
		}

		if ( $( el ).length == 0 ) {
			$( container ).append( $( tpl_iphone ).attr( identify, self.id ) );
		}

		if ( $( '.iphone-sounds' ).length == 0 ) {
			$( 'body' ).append( tpl_sounds );
		}

		self.$el = $( el );

		self.element = {
			btn_power    : self.$el.find( '.iphone-power-button' ),
			btn_home     : self.$el.find( '.iphone-home' ),
			unlock_slider: self.$el.find( '.iphone-slider' ),
			slide2unlock : self.$el.find( '.iphone-slide2unlock' ),

			alert           : self.$el.find( '.iphone-alert' ),
			alert_btn_cancel: self.$el.find( '.btn-alert-cancel' ),

			header_time: self.$el.find( '.iphone-header-time' ),
			header_date: self.$el.find( '.iphone-header-date' ),

			headline_time: self.$el.find( '.iphone-headline-time' ),
			icon_day     : self.$el.find( '#iphone_icon_day' ),
			icon_day_num : self.$el.find( '#iphone_icon_day_num' ),
		};

		self.volume = 0.5; // 0 >= voice <= 1
		self.color = '#000';

		self.status = 'lock'; // 'off', 'lock', 'on'

		self.element.btn_home.off( 'click' ).on( 'click', function (){
			if ( self.status == 'off' ) {
				self.lock();
			}
		} );

		// Power button click
		self.element.btn_power.off( 'click' ).on( 'click', function (){
			switch ( self.status ) {
				case 'off':
					self.lock();
					break;

				case 'lock':
				case 'on':
					self.off();
					break;
			}
		} );

		self.time();

		// First initiate status
		self[self.status]();

		setTimeout( function (){
			self.alert();
		}, 1000 );

		self.slideInitiate();

		self.inited = true;
		return self;
	};

	_proto.destroy = function (){
		var self = this;

		return self;
	};

	_proto.off = function (){
		var self = this;
		if ( self.status == 'on' ) {
			self.soundOff();
		}
		self.animateLetters( false );
		self.status = 'off';
		self.$el.removeClass( 'iphone-on iphone-lock' ).addClass( 'iphone-off' );
		return self;
	};

	_proto.lock = function (){
		var self = this;
		self.status = 'lock';
		self.$el.removeClass( 'iphone-on iphone-off' ).addClass( 'iphone-lock' );
		self.animateLetters();
		return self;
	};

	_proto.on = function (){
		var self = this;
		self.status = 'on';
		self.soundOn();
		self.animateLetters( false );
		self.$el.removeClass( 'iphone-lock iphone-off' ).addClass( 'iphone-on' );
		return self;
	};


	_proto.soundOff = function (){
		var self = this,
			sound = $( '#iphone-sound-off' )[0];
		if ( self.is_mobile || !sound ) {
			return self;
		}
		sound.pause();
		sound.currentTime = 0;
		sound.volume = self.volume;
		sound.play();
		return self;
	};

	_proto.soundOn = function (){
		var self = this,
			sound = $( '#iphone-sound-on' )[0];
		if ( self.is_mobile || !sound ) {
			return self;
		}
		sound.pause();
		sound.currentTime = 0;
		sound.volume = self.volume;
		sound.play();
		return self;
	};


	_proto.animateLetters = function ( animate ){
		var self = this,
			$slide2unlock = $( self.element.slide2unlock );

		$slide2unlock.removeClass( class_slide_animation );

		if ( animate !== false ) {
			$slide2unlock.addClass( class_slide_animation );
		}
	},

		_proto.time = function (){
			var self = this,
				el = self.element,
				date = new Date(),
				minutes = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes(),
				hours = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours();

			el.header_time.html( hours + '<span>:</span>' + minutes );
			el.header_date.html( week_days[date.getDay()] + ', ' + year_month[date.getMonth()] + ' ' + date.getDate() );

			el.headline_time.html( hours + ':' + minutes );

			el.icon_day.html( week_days[date.getDay()] );
			el.icon_day_num.html( date.getDate() );

			setTimeout( function (){
				self.time();
			}, (1000 * (60 - date.getSeconds())) );
		};

	/**
	 * @param text
	 */
	_proto.alert = function ( text ){
		var self = this,
			$alert = self.element.alert;
		if ( text ) {
			$alert.find( '.text' ).html( text );
		}
		$alert.addClass( class_alert_on );
		self.element.alert_btn_cancel.off( 'click' ).on( 'click', function (){
			self.hide_alert();
		} );
	};

	_proto.hide_alert = function (){
		var self = this,
			$alert = self.element.alert;
		$alert.addClass( class_alert_off );
		setTimeout( function (){
			$alert.removeClass( class_alert_on ).removeClass( class_alert_off );
		}, 300 );
	};


	_proto.slideInitiate = function (){
		var self = this,
			iphone = this,
			move_slider,
			up_on_slider,
			events = {
				start: 'mousedown',
				move : 'mousemove',
				end  : 'mouseup mouseleave'
			},
			events_mobile = {
				start: 'touchstart',
				move : 'touchmove',
				end  : 'touchend touchleave'
			},
			evnt = iphone.is_mobile ? events_mobile : events;

		self.element.unlock_slider.off( evnt.start ).on( evnt.start, function ( e ){
			e.preventDefault();
			var $slider = $( this ),
				mouse_left = iphone.is_mobile ? e.originalEvent.touches[0].clientX : e.clientX;

			self.animateLetters( false );

			self.$el.off( evnt.move, move_slider ).on( evnt.move, function move_slider ( e ){
				var diff = (iphone.is_mobile ? e.originalEvent.touches[0].clientX : e.clientX) - mouse_left;

				if ( diff < 0 ) {
					diff = 0;
				}
				if ( diff > slide_zone ) {
					diff = slide_zone;
				}

				$slider.css( 'left', diff );

				var opacity_k = (slide_zone - diff * 3) / (slide_zone);
				self.element.slide2unlock.css( {
					'opacity': opacity_k
				} );
			} );

		} );

		self.$el.off( evnt.end, up_on_slider ).on( evnt.end, function up_on_slider (){
			self.$el.off( evnt.move, move_slider );
			self.endSlide();
			self.animateLetters( true );
		} );
	};

	_proto.endSlide = function (){
		var self = this,
			$slider = self.element.unlock_slider,
			$slide2unlock = self.element.slide2unlock,
			slider_left = parseInt( $slider.css( 'left' ), 10 ),
			time_k = slider_left / slide_zone;

		if ( slider_left + 30 > slide_zone ) {
			self.on();
			self.animateLetters( false );
		} else {
			self.animateLetters();
			$slider.animate( {
				'left': '0'
			}, (animation_time * time_k) * 2 / 3 );
			$slide2unlock.stop().animate( {
				'opacity': '1'
			}, (animation_time * time_k) * 2 / 3 );
		}
		setTimeout( function (){
			$slider.css( 'left', 0 );
			$slide2unlock.css( 'opacity', 1 );
		}, animation_time / 3 );
	};

	return iPhone;
} );