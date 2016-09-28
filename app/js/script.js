var App = App || {};

App.namespace = function (ns_string) {
	var parts = ns_string.split('.'),
	parent = App,
	i;
	if (parts[0] === "App") {
		parts = parts.slice(1);
	}
	for (i = 0; i < parts.length; i += 1) {
		if (typeof parent[parts[i]] === "undefined") {
			parent[parts[i]] = {};
		}
		parent = parent[parts[i]];
	}
	return parent;
};

App.namespace('utils.class');

App.utils.class = (function (){
	return {
		hasClass: function(el, className) {
		  if (el.classList)
		    return el.classList.contains(className)
		  else
		    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
		},

		addClass: function(el, className) {
		  if (el.classList)
		    el.classList.add(className)
		  else if (!hasClass(el, className)) el.className += " " + className
		},

		removeClass: function(el, className) {
		  if (el.classList)
		    el.classList.remove(className)
		  else if (hasClass(el, className)) {
		    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
		    el.className=el.className.replace(reg, ' ')
		  }
		}
	}
}());

App.accordion = (function(){

	  	var hasClass = App.utils.class.hasClass,
	  	 	addClass = App.utils.class.addClass,
	  	 	removeClass = App.utils.class.removeClass;

	  	var Accordion = function(accordionMenu, accordionItemContent, event){
	  		this.menus = document.getElementsByClassName(accordionMenu);
	  		this.accordionMenu = accordionMenu;
	  		this.accordionItemContent = accordionItemContent;
	  		this.event = event;
	  		that = this;

	  	}

	  	Accordion.prototype = {
			constructor: App.accordion,
			subscribe: function(){
				for (i = 0; i < this.menus.length; i++) {
				    this.menus[i].addEventListener(this.event, this.toggleItem, false);
				}
			},
			unsubscribe: function () {
				for (var i = this.menus.length - 1; i >= 0; i--) {
					this.menus[i].removeEventListener(this.event, this.toggleItem)
				};
			},
			clear: function(elem){
				for (var i = elem.children.length - 1; i >= 0; i--) {
					for (var j = elem.children[i].children.length - 1; j >= 0; j--) {
						if (hasClass(elem.children[i].children[j], this.accordionItemContent) ) {
							removeClass(elem.children[i].children[j], this.accordionItemContent + '_open');
							addClass( elem.children[i].children[j], this.accordionItemContent + '_close');
						};
					};
				};
			},
			toggle: function(item){
				for (var i = item.children.length - 1; i >= 0; i--) {
					if ( hasClass(item.children[i], this.accordionItemContent + '_close') ) {
						removeClass(item.children[i], this.accordionItemContent + '_close');
						addClass( item.children[i], this.accordionItemContent + '_open');
					}
				};
			},
			toggleItem: function(e) {
			  	var elem = e.target,
			  		item = elem.parentNode;
				
				e.preventDefault();

				while (elem != document.body) {

					if ( hasClass(elem, that.accordionMenu) ) {
						that.clear(elem);
						that.toggle(item);
						return;
					}
					elem = elem.parentNode;
				}
			}

		};
		return Accordion;
}());

App.resizing = function(){
	if(document.documentElement.clientWidth < 767) {
		for (var i = 0; i < App.accordions.length; i++) {
			App.accordions[i].unsubscribe();
			App.accordions[i].event = 'click';
			App.accordions[i].subscribe();
		};
	}else{
		for (var i = 0; i < App.accordions.length; i++) {
			App.accordions[i].unsubscribe();
			App.accordions[i].event = 'mouseover';
			App.accordions[i].subscribe();
		};
	}
};

App.accordions = [];
App.accordions.push(new App.accordion('menu', 'menu__content', 'mouseover'));

for (var i = 0; i < App.accordions.length; i++) {
	App.accordions[i].subscribe();
};

window.onload = function(){

	function control(){
		var timeout = false,
			delay = 250;
		return function(){
			clearTimeout(timeout);
			timeout = setTimeout(App.resizing, delay);
		}
	}

	window.addEventListener('resize', control());
	window.addEventListener("orientationchange", control());
};

App.resizing();