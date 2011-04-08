<?php
class WowSlideshow {
	const CACHE_FILE = 'cache.js';
	const CACHE_TIME_IN_S = 10;
	const SLIDESHOW_SELECTOR = '#slideshow';
	
	private $data = Array();
	private $code = "";
	
	public $cached = null;
	public $cacheAge = null;
	
	public function __construct($data){
		header('Content-Type: text/javascript');
		$this->data = $data;
		$this->cached = $this->isCacheUpToDate();
		if($this->cached){
			$this->readAndLoadCache();
		} else {
			$this->writeAndLoadCache();
		} 
	}
	
	public function getCode(){ 
		return $this->code;
	}
	
	public function isCached(){
		return $this->cached;
	}
	
	public function getCacheAge(){
		return $this->cacheAge;
	}
	
	private function isCacheUpToDate() {
		$this->cacheAge = filemtime(WowSlideshow::CACHE_FILE);
		$currentTime = time();
		
		$isUpToDate = ($this->cacheAge + WowSlideshow::CACHE_TIME_IN_S) > $currentTime;
		$isNotEmpty = filesize(WowSlideshow::CACHE_FILE) > 0;
		
		return $isUpToDate && $isNotEmpty;
	}

	private function readAndLoadCache() {
		$this->code = file_get_contents(WowSlideshow::CACHE_FILE);
	}

	private function writeAndLoadCache() {
		$this->generateCode();
		file_put_contents(WowSlideshow::CACHE_FILE, $this->code);
	}

	private function generateCode(){
		$jsonData = json_encode($this->data);
		$selector = WowSlideshow::SLIDESHOW_SELECTOR;
		$this->code = "$(function() { Slideshow.initialize( '{$selector}', {$jsonData} ); });";
		$this->code = str_replace("\\/", '/', $this->code); //dirty hack to fix the urls. json_encode brackes it with his escaping
	}
	
}