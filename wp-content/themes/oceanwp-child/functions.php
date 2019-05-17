<?php
add_action( 'wp_enqueue_scripts', 'my_theme_enqueue_styles' );

function my_theme_enqueue_styles() {

    $parent_style = 'parent-style';

    wp_enqueue_style( $parent_style, get_template_directory_uri() . '/style.css' );
    wp_enqueue_style( 'child-style',
        get_stylesheet_directory_uri() . '/style.css',
        array( $parent_style ),
        wp_get_theme()->get('Version')
    );
}


// increase max per page sincer there are ~200 countries
add_filter( "rest_country_query", function ($args, $request) {
	if (! isset($_GET['per_page'])) {
		// new default to overwrite the default 10
		$args['posts_per_page'] = 220; 
	}
	return $args;
}, 15, 2);