var $j = jQuery.noConflict();

var MAX = {};

/*---------------------------------------------------------------------------------------------------
MAX.initRollOverImg // Créer des rollover selon le nom d'une classe et l'extension des images rollover, preload les images également
---------------------------------------------------------------------------------------------------*/
MAX.initRollOverImg = function (containerElement,startClassName,endClassName,rollOverSuffix, activateName){
	"use strict";
	
	var els = $j(containerElement).find('.' + startClassName+'[src]');
	for(var i=0; i< els.length; i++){
		var rollOverImg = $j(els[i]);
			
		var startSrc    = rollOverImg.attr("src");
		var startSrcLen = startSrc.length;
		var filePath    = startSrc.substring(0,startSrcLen-4);
		var fileExt     = startSrc.substring(startSrcLen-4); 
		var rollSrc     = filePath + rollOverSuffix + fileExt; // on créer le chemin du rollover
		//rollOverImg.activateName = activateName;
		rollOverImg.data('rollSrc', rollSrc); // on assigne le chemin de départ à l'objet image
		rollOverImg.data('startSrc', startSrc); // on assigne le chemin rollover à l'objet image

		//Activate state
		if(rollOverImg.attr("class").indexOf(activateName) != -1){
			rollOverImg.attr("src",rollOverImg.data('rollSrc')); // assigne le chemin rollover
			rollOverImg.addClass(endClassName);
		}
		
		//MouseOver
		rollOverImg.bind("mouseover", mouseover);
				
		//MouseOver
		rollOverImg.bind("mouseout", mouseout);

		//Preloading
		if (!document.createElement) return false;
		var refPreloadImg = $j(document.createElement("img")); // crée un élément img qui n'est pas dans le document (donc invisible)
		refPreloadImg.attr("src", rollSrc); // assigne le chemin du rollover
		
	}

	function mouseover(){
		rollOverImg = $j(this);
		if(rollOverImg.hasClass(activateName))return;
		rollOverImg.attr("src",rollOverImg.data('rollSrc'));
		rollOverImg.addClass(endClassName);
	}

	function mouseout(){
		rollOverImg = $j(this);
		if(rollOverImg.hasClass(activateName))return;
		rollOverImg.attr("src",rollOverImg.data('startSrc'));
		rollOverImg.removeClass(endClassName);
	}


};