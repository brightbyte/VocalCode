<!DOCTYPE html>
<?php
define( 'VOCAL_CODE', 'alpha' );
?>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>Vocal Code - Sing Your Source</title>
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="Description" lang="en" content="Sing your Source">
		<meta name="author" content="Daniel Kinzler">
		<meta name="robots" content="index, follow">

		<link rel="shortcut icon" href="favicon.ico">
		<link rel="stylesheet" href="skin/assets/css/styles.css">
		<link rel="stylesheet" href="styles.css">
		
		<script src="mespeak/mespeak.js"></script>
		<script src="vocalcode.js"></script>
	</head>
	<body>
		<div class="container">
			<div class="header">
				<h1 class="header-heading">Vocal Code</h1>
			</div>
			<!--<div class="nav-bar">
				<ul class="nav">
					<li><a href="#">Nav item 1</a></li>
					<li><a href="#">Nav item 2</a></li>
					<li><a href="#">Nav item 3</a></li>
				</ul>
			</div>-->
			<div class="content">
				<div class="main">
					<p>
						<?php include( 'form.php' ) ?>
					</p>
					<p>
						<?php include( 'highlight.php' ) ?>
					</p>
				</div>
			<!-- <div class="footer">
				<b>Vocal Code</b> by Daniel Kinzler &emsp;&mdash;&emsp; <b>meSpeak.js</b> by Norbert Landsteiner, mass:werk <br/>
				<b>jQuery</b> by jQuery Foundation &emsp;&mdash;&emsp; Skin by Russ Weakley, Max Design
			</div> -->
		</div>
	</body>
</html>