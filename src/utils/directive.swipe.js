export default {
	inserted(el, binding) {
		el.swipe = ({ target, movementX, movementY }) => {
			if (target !== el) return;
			const threshold = binding.arg || 10;
			const directions = Object.keys(binding.modifiers);
			el.dX += movementX;
			el.dY += movementY;

			const deltas = {
				left: -el.dX,
				right: el.dX,
				up: -el.dY,
				down: el.dY,
			};

			directions.forEach(direction => {
				if (deltas[direction] > threshold) {
					binding.value({ el, direction });
					el.removeEventListener('mousemove', el.swipe);
				}
			});
		};

		el.addEventListener('mousedown', () => {
			el.dX = 0;
			el.dY = 0;
			el.addEventListener('mousemove', el.swipe);
		}, true);

		['mouseleave', 'mouseup'].forEach(e => {
			el.addEventListener(e, () => {
				el.removeEventListener('mousemove', el.swipe);
			});
		});
	},
};
