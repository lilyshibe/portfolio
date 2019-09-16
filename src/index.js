import css from "./style/index.scss";

import anime from "animejs";
import charming from "charming";
import { Z_BLOCK } from "zlib";

/*-------------
	HIGHLIGHTER CURSOR
-------------*/

$(function() {
	var body = document.querySelector("body");
	var light = document.querySelector(".light");
	var lightInner = document.querySelector(".light-inner");
	var shadow = document.querySelector(".shadow");
	var shadowInner = document.querySelector(".shadow-inner");

	var settings = {
		smoothness: 4,
		snapScale: 1.8,
		maxSnapScale: 6,
		defaultScale: 50 // size of the ball in px (needed for calculations)
	};

	var state = {
		movementSmoothness: 4,
		rotation: 0,
		currentX: 0,
		currentY: 0,
		currentScale: 1,
		clientX: 0,
		clientY: 0,
		clientScale: 1,
		target: null,
		targetScaleMultiplier: 0
	};

	function move(e) {
		if (e.clientX) {
			// position of the mouse based on the window
			var mouseX = e.clientX;
			var mouseY = e.clientY;

			if (state.transition) {
				state.clientScale = state.transition;
			} else if (state.target) {
				state.clientScale = state.target.scale;
			} else {
				state.clientScale = 1;
			}

			// get the target position, usualy the mouse position if not snapping
			state.clientX = state.target ? state.target.x : mouseX; // mouse X position or snap target
			state.clientY = state.target ? state.target.y : mouseY; // mouse Y position or snap target
		}
	}

	function moveScroll(e) {
		// get the target position, usualy the mouse position if not snapping
		state.clientX = state.rawClientX; // mouse X position or snap target
		state.clientY = state.rawClientY; // mouse Y position or snap target
	}

	function snap(e) {
		var offset = $(this).offset();

		// how far the page has scrolled
		var scrollX = window.pageXOffset;
		var scrollY = window.pageYOffset;

		var scale = Math.min(
			(Math.max(this.offsetWidth, this.offsetHeight) / settings.defaultScale) *
				settings.snapScale,
			settings.maxSnapScale
		);

		if ($(this).data("snap-scale") !== undefined) {
			scale = $(this).data("snap-scale");
		}

		state.movementSmoothness = settings.smoothness;
		state.target = {
			x: offset.left + this.offsetWidth / 2 - scrollX,
			y: offset.top + this.offsetHeight / 2 - scrollY,
			scale: scale
		};
		state.clientX = state.target.x;
		state.clientY = state.target.y;
		state.clientScale = state.target.scale;
	}

	function unsnap(e) {
		state.target = null;
		setTimeout(function() {
			state.movementSmoothness = 4;
		}, 500);
	}

	setTimeout(function() {
		state.transition = 0;
		state.clientScale = 0.01;
	}, 1500);
	var supportsCssVariables =
		window.CSS && window.CSS.supports && window.CSS.supports("--fake-var", 0);

	function repeatOften() {
		// set state
		state.currentX = +(
			state.currentX +
			(state.clientX - state.currentX) / state.movementSmoothness
		).toFixed(2);
		state.currentY = +(
			state.currentY +
			(state.clientY - state.currentY) / state.movementSmoothness
		).toFixed(2);
		//state.currentScale = +(state.currentScale + (state.clientScale - state.currentScale) / settings.smoothness ).toFixed(2);
		state.currentScale = state.clientScale;
		if (supportsCssVariables) {
			// set the css variables
			light.style.setProperty("--x", state.currentX + "px");
			light.style.setProperty("--y", state.currentY + "px");
			lightInner.style.setProperty("--scale", state.currentScale.toFixed(2));
			//lightInner.style.setProperty('--scaleY', (state.currentScale).toFixed(2));

			shadow.style.setProperty("--x", state.currentX + "px");
			shadow.style.setProperty("--y", state.currentY + "px");
			shadowInner.style.setProperty("--scale", state.currentScale.toFixed(2));
			//shadowInner.style.setProperty('--scaleY', (state.currentScale).toFixed(2));
		} else {
			light.style.transform =
				"translate3d(" + state.currentX + "px," + state.currentY + "px,0)";
			lightInner.style.transform =
				"scale(" + state.currentScale.toFixed(2) + ")";

			shadow.style.transform =
				"translate3d(" + state.currentX + "px," + state.currentY + "px,0)";
			shadowInner.style.transform =
				"scale(" + state.currentScale.toFixed(2) + ")";
		}

		requestAnimationFrame(repeatOften);
	}

	requestAnimationFrame(repeatOften);

	function init() {
		$(".light,.shadow").show();
		if (window.PointerEvent) {
			body.removeEventListener("pointermove", init);
		} else {
			body.removeEventListener("mousemove", init);
		}
	}

	if (window.PointerEvent) {
		body.addEventListener("pointermove", init);
		body.addEventListener("pointermove", move);
	} else {
		body.addEventListener("mousemove", init);
		body.addEventListener("mousemove", move);
	}

	//document.addEventListener("scroll", moveScroll);

	$("body").delegate(".snapCursor", "mouseenter", snap);
	$("body").delegate(".snapCursor", "mouseleave", unsnap);
	$("body").delegate(".snapCursor", "focus", snap);
	$("body").delegate(".snapCursor", "blur", unsnap);

	$(".light,.shadow").one("pointermove", function() {
		this.style.display = "block";
	});

	$("body").bind("unsnap", function(e) {
		unsnap();
	});
});

/*-------------
	SMALL CURSOR
-------------*/

let clientX = -100;
let clientY = -100;
const innerCursor = document.querySelector(".cursor--small");

document.addEventListener("mousemove", e => {
	clientX = e.clientX;
	clientY = e.clientY;
	// console.log(clientX);
	// console.log(clientY);
});

const render = () => {
	innerCursor.style.transform = `translate(${clientX}px, ${clientY}px)`;
	requestAnimationFrame(render);
};

requestAnimationFrame(render);

window.addEventListener("touchstart", function() {
	light.style.display = none;
	shadow.style.display = none;
	innerCursor.style.display = none;
});

/*
	ENTER
*/

const DOM = {};
DOM.intro = document.querySelector("#top-wrapper");
DOM.shape = DOM.intro.querySelector("svg.shape");
DOM.path = DOM.shape.querySelector("path");
DOM.enter = document.querySelector(".enter");
DOM.links = document.querySelectorAll(".link");
DOM.lightInner = document.querySelector(".light-inner");
DOM.light = document.querySelector(".light");
charming(DOM.enter);
DOM.enterLetters = Array.from(DOM.enter.querySelectorAll("span"));
DOM.shape.style.transformOrigin = "50% 0%";

const init = () => {
	DOM.enter.addEventListener("click", navigate);
	DOM.enter.addEventListener("touchenter", navigate);
	DOM.enter.addEventListener("mouseenter", enterHoverInFn);
	DOM.enter.addEventListener("mouseleave", enterHoverOutFn);
};

let loaded;
const navigate = () => {
	if (loaded) return;
	loaded = true;

	var tl = anime
		.timeline({
			targets: DOM.intro,
			duration: 1100,
			easing: "easeInOutSine",
			translateY: "-200vh"
		})
		.add({
			targets: "#about-text",
			duration: 1100,
			easing: "easeOutSine",
			translateY: ["20vh", 0],
			opacity: [0, 1],
			complete: function() {
				$(".link").css("visibility", "visible");
				$("body").css("overflow-y", "scroll");
			}
		})
		.add({
			targets: DOM.links,
			duration: 1100,
			easing: "easeOutSine",
			opacity: [0, 1]
		});

	anime({
		targets: DOM.shape,
		scaleY: [
			{ value: [0, 3], duration: 550, easing: "easeOutQuad" },
			{ value: 1, duration: 550, easing: "easeOutQuad" }
		]
	});

	anime({
		targets: DOM.path,
		duration: 1100,
		easing: "easeOutQuad",
		d: DOM.path.getAttribute("pathdata:id")
	});

	anime({
		targets: DOM.lightInner,
		duration: 1100,
		easing: "easeOutQuad",
		background: "#FAEFDD"
	});

	anime({
		targets: innerCursor,
		duration: 1100,
		easing: "easeOutQuad",
		background: "#FAEFDD"
	});
};

let isActive;
let enterTimeout;

$(function() {
	var hash = location.hash;
	if (hash !== "") DOM.enter.click();
});

const enterHoverInFn = () =>
	(enterTimeout = setTimeout(() => {
		isActive = true;
		anime.remove(DOM.enterLetters);
		anime({
			targets: DOM.enterLetters,
			delay: (t, i) => i * 15,
			translateY: [
				{ value: 10, duration: 150, easing: "easeInQuad" },
				{ value: [-10, 0], duration: 150, easing: "easeOutQuad" }
			],
			opacity: [
				{ value: 0, duration: 150, easing: "linear" },
				{ value: 1, duration: 150, easing: "linear" }
			],
			color: {
				value: "#2c4160",
				duration: 1,
				delay: (t, i, l) => i * 15 + 150
			}
		});
	}, 50));

const enterHoverOutFn = () => {
	clearTimeout(enterTimeout);
	if (!isActive) return;
	isActive = false;

	anime.remove(DOM.enterLetters);
	anime({
		targets: DOM.enterLetters,
		delay: (t, i, l) => (l - i - 1) * 15,
		translateY: [
			{ value: 10, duration: 150, easing: "easeInQuad" },
			{ value: [-10, 0], duration: 150, easing: "easeOutQuad" }
		],
		opacity: [
			{ value: 0, duration: 150, easing: "linear" },
			{ value: 1, duration: 150, easing: "linear" }
		],
		color: {
			value: "#863b42",
			duration: 1,
			delay: (t, i, l) => (l - i - 1) * 15 + 150
		}
	});
};

init();
