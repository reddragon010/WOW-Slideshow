<?php
require_once('wow_slideshow_data.php');
require_once('wow_slideshow.class.php');
$wowss = new WowSlideshow($data);
?>
//Cached: <?php echo $wowss->isCached() ? 'YES' : 'NO'; ?> Age: <?php echo $wowss->getCacheAge() ?>

//<![CDATA[
<?php echo $wowss->getCode(); ?>
//]]>