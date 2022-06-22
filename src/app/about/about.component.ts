import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
        const square = document.querySelector('.square');
        square.classList.remove('square-transition');
        // Create the observer, same as before:
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              square.classList.add('square-transition');
              return;
            }
            square.classList.remove('square-transition');
          });
        });
        observer.observe(document.querySelector('.square-wrapper'));

        // first section animation starts from here
        const firstSectionText = document.querySelector('.firstSectionText');
        firstSectionText.classList.remove('first-section-transition');
        const firstSectionImage = document.querySelector('.firstSectionImage');
        firstSectionImage.classList.remove('first-section-image-transtion');
        // Create the observer, same as before:
        const observerFirstSection = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              firstSectionText.classList.add('first-section-transition');
              firstSectionImage.classList.add('first-section-image-transtion');
              return;
            }
            // firstSectionText.classList.remove('first-section-transition');
          });
        });
        observerFirstSection.observe(document.querySelector('.first-section-animation'));




        // yoda image animation on scroll
        const YodaImg = document.querySelector('.yoda-img');
        YodaImg.classList.remove('yoda-img');
        // // Create the observer, same as before:
        const yoda = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              YodaImg.classList.add('yoda-img');
              return;
            }
            YodaImg.classList.remove('yoda-img');
          });
        });
        yoda.observe(document.querySelector('.third-section-row'));


        // bar chart animation on section scroll
        const chart = document.querySelector('.bar-chart');
        const observerNew = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              animate();
            }
            // square.classList.remove('square-transition');
          });
        });

        observerNew.observe(document.querySelector('.dark'));



(function( $ ){

	$.fn.hoverFlow = function(type, prop, speed, easing, callback) {
		// only allow hover events
		if ($.inArray(type, ['mouseover', 'mouseenter', 'mouseout', 'mouseleave']) == -1) {
			return this;
		}

		// build animation options object from arguments
		// based on internal speed function from jQuery core
		var opt = typeof speed === 'object' ? speed : {
			complete: callback || !callback && easing || $.isFunction(speed) && speed,
			duration: speed,
			easing: callback && easing || easing && !$.isFunction(easing) && easing
		};

		// run immediately
		opt.queue = false;

		// wrap original callback and add dequeue
		var origCallback = opt.complete;
		opt.complete = function() {
			// execute next function in queue
			$(this).dequeue();
			// execute original callback
			if ($.isFunction(origCallback)) {
				origCallback.call(this);
			}
		};

		// keep the chain intact
		return this.each(function() {
			var $this = $(this);

			// set flag when mouse is over element
			if (type == 'mouseover' || type == 'mouseenter') {
				$this.data('jQuery.hoverFlow', true);
			} else {
				$this.removeData('jQuery.hoverFlow');
			}

			// enqueue function
			$this.queue(function() {
				// check mouse position at runtime
				var condition = (type == 'mouseover' || type == 'mouseenter') ?
					// read: true if mouse is over element
					$this.data('jQuery.hoverFlow') !== undefined :
					// read: true if mouse is _not_ over element
					$this.data('jQuery.hoverFlow') === undefined;

				// only execute animation if condition is met, which is:
				// - only run mouseover animation if mouse _is_ currently over the element
				// - only run mouseout animation if the mouse is currently _not_ over the element
				if(condition) {
					$this.animate(prop, opt);
				// else, clear queue, since there's nothing more to do
				} else {
					$this.queue([]);
				}
			});

		});
	};

})( jQuery );


(function( $ ){

	var items = new Array(),
		errors = new Array(),
		onComplete = function() {},
		current = 0;

	var jpreOptions = {
		splashVPos: '35%',
		loaderVPos: '75%',
		splashID: '#jpreContent',
		showSplash: true,
		showPercentage: true,
		debugMode: false,
		splashFunction: function() {}
	}

	var getImages = function(element) {
		$(element).find('*:not(script)').each(function() {
			var url = "";

			if ($(this).css('background-image').indexOf('none') == -1) {
				url = $(this).css('background-image');
				if(url.indexOf('url') != -1) {
					var temp = url.match(/url\((.*?)\)/);
					url = temp[1].replace(/\"/g, '');
				}
			} else if ($(this).get(0).nodeName.toLowerCase() == 'img' && typeof($(this).attr('src')) != 'undefined' && $(this).hasClass('preload')) {
				url = $(this).attr('src');
			}
			//console.log(url);

			if (url.length > 0) {
				items.push(url);
			}
		});
	}

	var preloading = function() {
		for (var i = 0; i < items.length; i++) {
			loadImg(items[i]);
		}
	}

	var loadImg = function(url) {
		var imgLoad = new Image();
		$(imgLoad)
		.load(function() {
			completeLoading();
		})
		.error(function() {
			errors.push($(this).attr('src'));
			completeLoading();
		})
		.attr('src', url);
	}

	var completeLoading = function() {
		current++;

		var per = Math.round((current / items.length) * 100);
		$(jBar).stop().animate({
			height: per + '%'
		}, 0, 'linear'); // changed duration from 500 to zero

		if(jpreOptions.showPercentage) {
			$(jPer).text(per+"%");
		}

		if(current >= items.length) {

			current = items.length;

			if (jpreOptions.debugMode) {
				var error = debug();

			}
			loadComplete();
		}
	}

	var loadComplete = function() {
		$(jBar).stop().animate({
			height: '100%'
		}, 0, 'linear', function() { // changed duration from 500 to zero
			$(jOverlay).animate({opacity: '0'},0, function() { // changed duration from 500 to zero
				$(jOverlay).remove();
				onComplete();
			});
		});
	}

	var debug = function() {
		if(errors.length > 0) {
			var str = 'ERROR - IMAGE FILES MISSING!!!\n\r'
			str	+= errors.length + ' image files cound not be found. \n\r';
			str += 'Please check your image paths and filenames:\n\r';
			for (var i = 0; i < errors.length; i++) {
				str += '- ' + errors[i] + '\n\r';
			}
			return true;
		} else {
			return false;
		}
	}

	// create the splash screen overlay
	var createContainer = function(tar) {

		jOverlay = $('<div></div>')
		.attr('id', 'jpreOverlay')
		.appendTo('body');

		if(jpreOptions.showSplash) {
			jContent = $('<div></div>')
			.attr('id', 'jpreSlide')
			.appendTo(jOverlay);

			var conWidth = $(window).width() - $(jContent).width();
			$(jContent).html($(jpreOptions.splashID).wrap('<div/>').parent().html());
			$(jpreOptions.splashID).remove();
			jpreOptions.splashFunction()
		}

		jLoader = $('<div></div>')
		.attr('id', 'jpreLoader')
		.appendTo(jOverlay);

		jBar = $('<div></div>')
		.attr('id', 'jpreBar')
		.appendTo(jLoader);

		if(jpreOptions.showPercentage) {
			jPer = $('<div></div>')
			.attr('id', 'jprePercentage')
			.appendTo(jLoader)
			.html('Loading...');
		}
	}

	$.fn.jpreLoader = function(options, callback) {
        if(options) {
            $.extend(jpreOptions, options );
        }
		if(typeof callback == 'function') {
			onComplete = callback;
		}

		createContainer(this);
		getImages(this);
		preloading();
        return this;
    };

})( jQuery );


// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});




        function animate() {
          // Animate Chart
          $('.bar-chart')
          $('#yoda-img').css({'visibility':'visible', 'left': '50%'}).stop().animate({'opacity':'1', 'left':'0%'}, 1000, 'easeOutExpo');

              $('#aqua').css({'visibility':'visible', 'height': '0%'}).stop().delay(200).animate({'opacity':'1', 'height':'95%'}, 1000, 'easeOutExpo');
              $('#pink').css({'visibility':'visible', 'height': '0%'}).stop().delay(400).animate({'opacity':'1', 'height':'90%'}, 1000, 'easeOutExpo');
              $('#yellow').css({'visibility':'visible', 'height': '0%'}).stop().delay(600).animate({'opacity':'1', 'height':'95%'}, 1000, 'easeOutExpo');
              $('#brown').css({'visibility':'visible', 'height': '0%'}).stop().delay(800).animate({'opacity':'1', 'height':'75%'}, 1000, 'easeOutExpo');
              $('#red').css({'visibility':'visible', 'height': '0%'}).stop().delay(1000).animate({'opacity':'1', 'height':'40%'}, 1000, 'easeOutExpo');
              // $('#yoda-img').css({'visibility':'visible', 'height': '0%'}).stop().delay(400).animate({'opacity':'1', 'height':'100%'}, 1000, 'easeInQuad');
            }

        function animateYoda(){
        }
          // $('#top').click(function() {
          //   $('html, body').animate({
          //       scrollTop: $("#top-section").offset().top
          //   }, 1000)})
     }
     top(){
      $('html, body').animate({
        scrollTop: $("#top-section").offset().top
    }, 1000)}
}
