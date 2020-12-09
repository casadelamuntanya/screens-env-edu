export default {
	inserted(el, binding) {
		el.scroll = ({ movementX }) => {
			const { arg = 5 } = binding;
			el.dX += movementX;
			el.scrollLeft -= movementX;
			if (Math.abs(el.dX) > arg) el.isScrolling = true;
		};

		el.finish = () => {
			el.removeEventListener('mousemove', el.scroll);
			el.removeEventListener('mouseleave', el.finish);
		};

		el.addEventListener('mousedown', () => {
			el.addEventListener('mousemove', el.scroll);
			el.addEventListener('mouseleave', el.finish);
			el.dX = 0;
			el.isScrolling = false;
		});

		el.addEventListener('mouseup', el.finish, true);

		el.addEventListener('click', event => {
			if (el.isScrolling) event.stopImmediatePropagation();
		}, true);
	},

	componentUpdated(el) {
		el.scrollLeft = 0;
	},
};
