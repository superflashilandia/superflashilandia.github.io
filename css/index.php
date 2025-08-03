<?php

if(isset($_REQUEST["tag"]))
	$tag = $_REQUEST["tag"];
else
	$tag = "Home";


include ("admin/configurations/connect.php");
include ("admin/configurations/configurations.php");
include ("admin/functions/selects.php");


$tag_id = getTagIdByName($tag);
?>

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="es" lang="es"> 
<head>

<meta name="tipo_contenido"  content="text/html;" http-equiv="content-type" charset="utf-8">
<meta property="og:title" content="Agustin Pontura. videojuegos" />
<meta name=viewport content="width=device-width, initial-scale=0.8">
<link type="text/css" rel="stylesheet" href="css/styles.css" />


<title>Agustin Pontura - Videojuegos - <?php echo $tag?> </title>

</head>
<body>
<div class="all">
	<div class="header">
		<h1>
			<a href="http://www.pontura.com">
			Agustin Pontura
			</a>
		</h1>
		<div class="hamburguer" onclick="Toogle()">
		  <div class="bar1"></div>
		  <div class="bar2"></div>
		  <div class="bar3"></div>
		</div>
	</div>		
	<div class="menu" id = "mainMenu">
		
		<?php
			include("menu.php");
		?>
	</div>
	
	<div id="content">
		<div class="social">
		<ul>
			<li>
			   <a href = "https://www.facebook.com/pontura" target="blank" ><img src="images/interface/facebook.png" border = 0 /></a>
			</li>
			<li>
			   <a href = "http://julianaznar.bandcamp.com/" target="blank" ><img src="images/interface/soundcloud.png" border = 0 /></a>
			</li>
			<li>
			   <a href = "https://www.youtube.com/user/pontura" target="blank" ><img src="images/interface/youtube.png" border = 0 /></a>
			</li>
			<li>
			   <a href = "https://plus.google.com/u/0/117884170360163279003/posts" target="blank" ><img src="images/interface/google.png" border = 0 /></a>
			</li>
			<li>
			   <a href = "https://www.linkedin.com/profile/view?id=160488468&trk=nav_responsive_tab_profile_pic" target="blank" ><img src="images/interface/linkedin.png" border = 0 /></a>
			</li>
		</ul>
		<div class='socialData'>
			<p>
				pontura@gmail.com | cel: 15 3634 7373 | BA - Argentina
			</p>
		</div>
	</div>
		<div id="cols">
		<?php
			include("content.php");
		?>	
		</div>
	</div>
</div>
</body>

<script>
	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
		},
		any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};
	
	if( isMobile.any() ) 
		isAndroid(true);
	else
		isAndroid(false);

	
	function isAndroid(itIs) {		
	  var x = document.getElementById("mainMenu");
	  x.style.display = "none";	
	  if (itIs) {
			document.getElementById("cols").classList.add('colsMobile');	
			document.getElementById("content").classList.add('contentMobile');		  
			var all = document.getElementsByClassName('ContentLine');
			
			while(all.length > 0) {
			   all[0].className = 'ContentLineMobile';  
			}
			
	  } else {
			document.getElementById("cols").classList.add('cols');	
			document.getElementById("content").classList.add('content');
			document.getElementsByClassName("ContentLine").classList.add('ContentLine');		
	  }
	}
	
	function Toogle() {
	  var x = document.getElementById("mainMenu");
	  if (x.style.display === "none") {
		x.style.display = "block";
	  } else {
		x.style.display = "none";
	  }
}

</script>

</html>