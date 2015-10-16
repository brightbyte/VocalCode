<?php
if ( !defined( 'VOCAL_CODE' ) ) {
    die( 'nope' );
}

if ( !isset( $_POST['source'] ) || $_POST['source'] === '' ) {
	return;
}

$source = $_POST['source'];
$language = isset( $_POST['lang'] ) ? $_POST['lang'] : 'text';

if ( $code !== '' ) {
	require_once( 'geshi-1.0/src/geshi.php' );

	$geshi = new GeSHi( $source, $language );
	echo '<div class="vcSyntaxBox" id="highlighted-source">';
	echo $geshi->parse_code();
	echo '</div>';
}
?>
<script>
function talkBottonPressed() {
	var sourceElement = document.getElementById( 'highlighted-source' );
	window.vocalcode.walkAndTalk( sourceElement );
}
function stopBottonPressed() {
	window.vocalcode.stop();
}
</script>
<button class="btn" id="talk-button" onclick="talkBottonPressed();">Talk</button>
<button class="btn" id="stop-button" onclick="stopBottonPressed();">Stop</button>