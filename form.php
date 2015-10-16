<?php
if ( !defined( 'VOCAL_CODE' ) ) {
    die( 'nope' );
}

$source = isset( $_POST['source'] ) ? $_POST['source'] : '';
$language = isset( $_POST['lang'] ) ? $_POST['lang'] : 'text';

function option( $inner, $value, $selected = null ) {
	$attrib = 'value="' . htmlspecialchars( $value ) . '"';
	
	if ( $value === $selected ) {
		$attrib .= ' selected';
	}
	
	return "\t\t<option $attrib>$inner</option>\n";
}

?>
<form name="source-form" id="source-form" action="index.php" method="post">
	<textarea placeholder="put your source here" name="source" style="width:100%; height:10em;"><?php echo htmlspecialchars( $source ) ?></textarea>
	<br/>
	<select name="lang"  class="btn">
		<?php
		echo option( 'JavaScript', 'javascript', $language );
		echo option( 'PHP', 'php', $language );
		?>
	</select>
	<button type="submit" class="btn">Highlight</button>
</form>
