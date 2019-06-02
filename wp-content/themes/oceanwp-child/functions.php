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

/**********
increase max countries per page since there are ~200 countries
**********/

add_filter( "rest_country_query", function ($args, $request) {
	if (! isset($_GET['per_page'])) {
		// new default to overwrite the default 10
		$args['posts_per_page'] = 220; 
	}
	return $args;
}, 15, 2);

/**********
show custom post types for a given tag
**********/

function my_post_queries( $query ) {
  if (!is_admin() && $query->is_main_query()){
    // alter the query for the archive and category pages 
    if( is_category() || is_archive() ){
            $query->set('post_type', array('community_question', 'post', 'use_case') );
            $query->set('post_status', 'publish');
            $query->set('orderby', 'date');
    }
  }
}
add_action( 'pre_get_posts', 'my_post_queries' );