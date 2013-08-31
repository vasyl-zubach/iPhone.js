require.config( {
	baseUrl: 'js',
	urlArgs: "",
	paths  : {
		jquery: 'jquery',
		iphone: 'iPhone',
		iphone_color: 'iPhone.color'
	}
} );



require( ['iphone', 'iphone_color'], function ( iPhone, iPhone_color ){
	iPhone();
	iPhone_color.init();
});
