/**
 * A slideshow system. Will display a single slide (with a description, title and image) at a time,
 * and will fade between the slides based on a duration. You can manually jump to specific slides.
 *
 * @copyright   2010, Blizzard Entertainment, Inc
 * @class       Slideshow
 * @example
 *
 *      Slideshow.initialize('#slideshow', []);
 *
 */

var Slideshow = {

    /**
     * The slide containing element.
     */
    object: null,

    /**
     * The rotation timer.
     */
    timer: null,

    /**
     * Current index.
     */
    index: 0,

    /**
	 * Array of slide data.
	 */
    data: [],

    /**
     * A collection of the slide DOM objects.
     */
    slides: [],

    /**
     * Is rotation currently playing.
     */
    playing: false,

    /**
	 * The last slide index.
	 */
    lastSlide: null,
		
		/**
		* Building basic ui
		*/
		buildup: function() {
			for(var i = 0; i < Slideshow.data.length; i++){
				if(i == 0){
					display = ""
					pageing_class = "class=\"current\"";
				} else {
					display = "display: none;"
					pageing_class = "";
				}
				
				Slideshow.object.find('.container').append("\
					<div class=\"slide\" id=\"slide-" + i + "\" style=\"background-image: url('" + Slideshow.data[i].image + "');"+ display +"\"></div>\
				");
				
				Slideshow.object.find('.paging').append("\
					<a href=\"javascript:;\" id=\"paging-" + i + "\"\
						onclick=\"Slideshow.jump(" + i + ", this);\"\
						onmouseover=\"Slideshow.preview(" + i + ");\" "+ pageing_class + "\
					></a>\
				");
			}
		},
		
    /**
     * Initialize the slider by building the slides based on this.data and starting the rotation.
     *
     * @param object - CSS expression
     * @param data
     * @constructor
     */
    initialize: function(object, data) {
        Slideshow.object = jQuery(object);
        Slideshow.data = data;

				Slideshow.buildup();
				
        Slideshow.slides = Slideshow.object.find('.slide');

        // Apply events
        Slideshow.object.find('.mask').hover(
        function() {
            Slideshow.pause();
        },
        function() {
            Slideshow.play();
        }
        );

        Slideshow.object.find('.paging a').mouseleave(function() {
            Slideshow.object.find('.preview').empty().hide();
        });

        if (Slideshow.slides.length <= 1)
        Slideshow.object.find('.controls, .paging').hide();

        Slideshow.link(0);
        Slideshow.play();
    },

    /**
	 * Fade out the slides and fade in selected.
	 *
	 * @param index
	 */
    fade: function(index) {
        Slideshow.slides.stop(true, true).fadeOut('normal');
        Slideshow.slides.eq(index).fadeIn(1000);
        Slideshow.link(index);

        Slideshow.lastSlide = index;
    },

    /**
     * Manually jump to a specific slide. Pauses rotation.
     *
     * @param index
	 * @param control
     */
    jump: function(index, control) {
        if ((Slideshow.lastSlide == index) || (Slideshow.slides.length <= 1))
        return;

        Slideshow.pause();
        Slideshow.fade(index);
        Slideshow.index = index;

        Slideshow.object.find('.paging a').removeClass('current');
        $(control).addClass('current');
    },

    /**
	 * Link the mask overlay and track the event.
	 *
	 * @param index
	 */
    link: function(index) {
        if (Slideshow.data[index]) {
            Slideshow.object.find('.mask').click(function(){
							window.location = Slideshow.data[index].url;
						});
        }
    },

    /**
     * Play the rotation.
     */
    play: function() {
        if (Slideshow.slides.length <= 1)
        return;

        if (!Slideshow.playing) {
            Slideshow.playing = true;
            Slideshow.timer = window.setInterval(Slideshow.rotate, 5000);
        }
    },

    /**
     * Pause the automatic rotation.
     */
    pause: function() {
        if (Slideshow.slides.length <= 1)
        return;

        window.clearInterval(Slideshow.timer);

        Slideshow.playing = false;
    },

    /**
     * Display a tooltip preview.
	 *
	 * @param index
     */
    preview: function(index) {
        if (Slideshow.data[index]) {
            var tooltip = Slideshow.object.find('.preview'),
            top = (index * 15) + 15;

            if (Slideshow.data[index].image) {
                jQuery('<img/>', {
                    src: Slideshow.data[index].image,
                    width: 100,
                    height: 47,
                    alt: ''
                }).appendTo(tooltip);
            }

            tooltip.append('<span>' + Slideshow.data[index].title + '</span>').css('top', top);
            tooltip.show();
        }
    },

    /**
     * Automatically cycle through all the slides.
     */
    rotate: function() {
        var slideIndex = Slideshow.index + 1;

        if (slideIndex > (Slideshow.slides.length - 1))
        slideIndex = 0;

        if (Slideshow.lastSlide == slideIndex)
        return;

        Slideshow.fade(slideIndex);
        Slideshow.index = slideIndex;

        // Set control to current
        Slideshow.object
        .find('.paging a').removeClass('current').end()
        .find('.paging a:eq(' + slideIndex + ')').addClass('current');
    },

    /**
     * Toggle between play and pause.
     */
    toggle: function() {
        if (Slideshow.playing)
        Slideshow.pause();
        else
        Slideshow.play();
    }

};