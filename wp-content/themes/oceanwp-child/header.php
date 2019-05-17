<?php
/**
 * The Header for our theme.
 *
 * @package OceanWP WordPress theme
 * 
 * my edits: add leaflet files
 */ ?>

<!DOCTYPE html>
<html class="<?php echo esc_attr( oceanwp_html_classes() ); ?>" <?php language_attributes(); ?><?php oceanwp_schema_markup( 'html' ); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	 <link rel="stylesheet" href="/wp-content/themes/oceanwp-child/assets/leaflet/leaflet.css">
	<script type="text/javascript" src="/wp-content/themes/oceanwp-child/assets/leaflet/leaflet.js"></script>
	<script src="/wp-content/themes/oceanwp-child/assets/data/TM_WORLD_BORDERS_SIMPL03_0.js"></script>

	<script type="text/javascript" src="/wp-content/themes/oceanwp-child/assets/js/map.js"></script>


	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

	<?php do_action( 'ocean_before_outer_wrap' ); ?>

	<div id="outer-wrap" class="site clr">

		<?php do_action( 'ocean_before_wrap' ); ?>

		<div id="wrap" class="clr">

			<?php do_action( 'ocean_top_bar' ); ?>

			<?php do_action( 'ocean_header' ); ?>

			<?php do_action( 'ocean_before_main' ); ?>
			
			<main id="main" class="site-main clr"<?php oceanwp_schema_markup( 'main' ); ?>>

				<?php do_action( 'ocean_page_header' ); ?>