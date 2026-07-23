(function () {
	var SLIDE_MS = 4500;
	var FADE_MS = 900;
	var RESUME_MS = 10000;

	function initHeroCarousel() {
		var root = document.querySelector('[data-hero-carousel]');
		var ui = document.querySelector('[data-hero-carousel-ui]');
		if (!root) return;

		var slides = root.querySelectorAll('.hero-carousel__slide');
		var dots = ui ? ui.querySelectorAll('[data-carousel-dot]') : [];
		var labelEl = ui ? ui.querySelector('[data-carousel-label]') : null;
		if (slides.length < 2) return;

		var index = 0;
		var busy = false;
		var autoTimer = null;
		var resumeTimer = null;
		var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		function updateChrome(i) {
			Array.prototype.forEach.call(dots, function (dot, di) {
				var on = di === i;
				dot.classList.toggle('is-active', on);
				dot.setAttribute('aria-selected', on ? 'true' : 'false');
			});
			if (labelEl) {
				labelEl.textContent = slides[i].getAttribute('data-label') || '';
			}
		}

		function goTo(next, options) {
			options = options || {};
			next = (next + slides.length) % slides.length;
			if (next === index || busy) return;

			var prev = index;
			var outgoing = slides[prev];
			var incoming = slides[next];
			var instant = reduceMotion || options.instant;

			busy = true;
			index = next;
			updateChrome(index);

			incoming.classList.add('is-active', 'is-incoming');
			outgoing.classList.add('is-outgoing');
			outgoing.classList.remove('is-active');

			if (instant) {
				incoming.classList.remove('is-incoming');
				outgoing.classList.remove('is-outgoing');
				busy = false;
				return;
			}

			// Force layout so the opacity transition always runs
			void incoming.offsetWidth;

			incoming.classList.remove('is-incoming');
			outgoing.classList.add('is-hidden');

			window.setTimeout(function () {
				outgoing.classList.remove('is-outgoing', 'is-hidden');
				busy = false;
			}, FADE_MS);
		}

		function stopAuto() {
			if (autoTimer) {
				window.clearInterval(autoTimer);
				autoTimer = null;
			}
		}

		function startAuto() {
			stopAuto();
			autoTimer = window.setInterval(function () {
				goTo(index + 1);
			}, SLIDE_MS);
		}

		function enterManual(next) {
			stopAuto();
			if (resumeTimer) window.clearTimeout(resumeTimer);
			goTo(next);
			resumeTimer = window.setTimeout(function () {
				startAuto();
			}, RESUME_MS);
		}

		Array.prototype.forEach.call(dots, function (dot) {
			dot.addEventListener('click', function () {
				var next = parseInt(dot.getAttribute('data-carousel-dot'), 10);
				if (isNaN(next)) return;
				enterManual(next);
			});
		});

		// Preload remaining images so fades never flash empty frames
		Array.prototype.forEach.call(slides, function (slide, i) {
			if (i === 0) return;
			var img = slide.querySelector('img');
			if (!img) return;
			img.loading = 'eager';
		});

		updateChrome(0);
		startAuto();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initHeroCarousel);
	} else {
		initHeroCarousel();
	}
})();
