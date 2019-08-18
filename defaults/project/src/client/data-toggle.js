/**
 * data-toggle, set up quick toggle handler on an element to control another.
 * The data-toggle value can be an id reference or a document query string.
 * Usage: 
 * <button data-toggle="toggle-area">Toggle button</button>
 * <div id="toggle-area"></div>
 */

import v4 from 'uuid/v4';

export const setupToggler = (toggleElement, optionalTarget) => {
	try {
		if(!toggleElement) return;
		else if(toggleElement.dataset.initialized) return;
	
		const targetSelector = optionalTarget || toggleElement.dataset.toggle;
		if(!targetSelector) return;
	
		const targetElement = document.getElementById(targetSelector) || document.querySelector(targetSelector);
		if(!targetElement) return;

		// Give target an ID if it doesn have one.
		let targetId = targetElement.getAttribute('id');
		if(!targetId) {
			targetId = v4();
			targetElement.setAttribute('id', targetId)
		}
	
		// Setup attributes etc.
		let isExpanded = (toggleElement.getAttribute('aria-expanded') || 'false') === 'true';
		toggleElement.setAttribute('aria-expanded', isExpanded);
		toggleElement.setAttribute('aria-controls', targetId);
		toggleElement.dataset.initialized = true;
	
		targetElement.dataset.open = isExpanded;
	
		// Set click handler
		toggleElement.addEventListener('click', () => {
			isExpanded = !isExpanded;
			toggleElement.setAttribute('aria-expanded', isExpanded);
			targetElement.dataset.open = isExpanded;
		})
	}catch(e) {
		console.error({
			e
		})
		return;
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const togglers = document.querySelectorAll('[data-toggle]');
	Array.prototype.forEach.call(togglers, toggler => setupToggler(toggler))
})

// Setup a toggler if the toggler is loaded async
document.addEventListener('click', event => {
	const target = event.currentTarget;
	if(target && target.dataset && target.dataset.toggle) {
		setupToggler(target);
	}
})