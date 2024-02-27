const slider = document.querySelector('[data-slider]');
const sliderContainer = document.querySelector('[data-slider-container]');
const slides = document.querySelectorAll('[data-slide]');
const controlButtons = document.querySelectorAll('[data-slider-btn]');
const liveregion = document.querySelector('[data-slider-liveregion]');

let sliderWidth, sliderGap, slideWidth;
let counter, slidesWithClones, firstSlideIndex, lastSlideIndex;
let isTransitionOver = true;
let debounceTimer;
let onMouseDownX;
let direction;
const nextDirectionName = 'next';
const prevDirectionName = 'prev';

// Clone the first two and last two slides. 
// Insert them at the beginning/end of the slider. 
// Add a data attribute to mark the cloned node.
const cloneSlides = () => {
    const firstSlideClone = slides[0].cloneNode(true);
    const secondSlideClone = slides[1].cloneNode(true);
    const lastSlideClone = slides[slides.length - 1].cloneNode(true);
    const lastButOneSlideClone = slides[slides.length - 2].cloneNode(true);

    firstSlideClone.setAttribute('data-node', true);
    lastSlideClone.setAttribute('data-node', true);

    slider.append(firstSlideClone, secondSlideClone);
    slider.prepend(lastButOneSlideClone, lastSlideClone);
}

// Return if there is some transition on slider. 
// Assign dir value to direction variable.
// Invoke changeSlide function.
const handleClick = (dir) => {
    if (!isTransitionOver) return;
    isTransitionOver = false;
    direction = dir;
    changeSlide();
}

// Calculates the position of the slider 
// so that the current slide is always in the center of the screen.
// apply CSS transform styles to slider to position it. 
const addSliderOffset = (slideIndex) => {
    counter = slideIndex;
    const slideOffset = (-sliderGap / 2) + (slideWidth * slideIndex) - ((sliderWidth - slideWidth) / 2);
    slider.style.transform = `translateX(${slideOffset > 0 ? '-' : ''}${Math.abs(slideOffset)}px)`;
}

// Toggle CSS transition on slider
const toggleTransition = (canTransition) => {
    slider.style.transition = canTransition ? `transform 250ms ease-in-out` : 'none';
}

// Update liveregion for assistive technologies
const updateLiveregion = () => {
    liveregion.textContent = `Item ${counter - 1} of ${slides.length}`
}

// Hide transitioning slides from assistive technologies and keep only current one
const hideTransitioningSlides = () => {
    let currentSlide = slidesWithClones[counter];

    slidesWithClones.forEach(slide => {
        slide.setAttribute('aria-hidden', `${currentSlide === slide ? 'true' : 'false'}`);
    })
}

// If checkForCloned is false change to next or previous slide.
// If checkForCloned is true, check if current slide is cloned and then
// remove transition from slider and change to first or last slide.
const changeSlide = (checkForCloned = false) => {
    const isCloned = slidesWithClones[counter].dataset.node || false;
    
    if (!checkForCloned) {
        toggleTransition(true);
        if (direction === nextDirectionName) {
            counter++;
            addSliderOffset(counter);
            return;
        } else if (direction === prevDirectionName) {
            counter--;
            addSliderOffset(counter);
        }
    } 

    if (checkForCloned && isCloned) {
        toggleTransition(false)
        if (direction === nextDirectionName) {
            addSliderOffset(firstSlideIndex);
        } else if (direction === prevDirectionName) {
            addSliderOffset(lastSlideIndex);
        }
    }

    hideTransitioningSlides();
}

// Get slider elements dimensions.
const getElementSizes = () => {
    sliderWidth = slider.getBoundingClientRect().width;
    sliderGap = parseFloat(getComputedStyle(slider).gap); //gap between each slide
    slideWidth = slides[0].getBoundingClientRect().width + sliderGap;
}

// Update slider position.
const handleResize = () => {
    getElementSizes()
    addSliderOffset(counter);
}

// Clone slides, then get sizes from them and assign variables based on that data.
const initialLoad = () => {
    cloneSlides();
    getElementSizes();

    slidesWithClones = document.querySelectorAll('[data-slide]');
    firstSlideIndex = 2; // first not cloned slide index
    lastSlideIndex = slidesWithClones.length - 3; // last not cloned slide index
    counter = Math.floor((slidesWithClones.length - 1) / 2); // the slide located middle of the slider
    addSliderOffset(counter);
    hideTransitioningSlides();
}

// Debounce function
// Restricting the rate at which a function is executed
const debounce = (callback, delay) => {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => callback(), delay);
}

// Check where the user clicked/touched on screen
// and assign that value to onMouseDownX variable
const handleMouseDown = (event) => {
    console.log(event.target);
    event.preventDefault();
    onMouseDownX = event.clientX || event.changedTouches[0].pageX;
    slider.style.cursor = "grabbing";
}

// Check when the user released click/touch and save position
// If user moved mouse more than trigger move to the next/prev slide.
const handleMouseUp = (event) => {
    let onMouseUpX = event.clientX || event.changedTouches[0].pageX;
    let offset = onMouseDownX - onMouseUpX;
    let trigger = slideWidth / 2;
    slider.style.cursor = "grab";

    if (offset > trigger) {
        direction = nextDirectionName;
        changeSlide();
    } else if (offset < -trigger) {
        direction = prevDirectionName;
        changeSlide();
    }
}

// ----------------
// Event listeners
// ----------------
addEventListener("load", () => {
    initialLoad();
});

addEventListener("resize", () => {
    debounce(handleResize, 300);
});

addEventListener("keydown", (event) => {
    let pressedKey = event.code;
    let arrowDirection;
    if (pressedKey === 'ArrowLeft') {
        arrowDirection = prevDirectionName;
        handleClick(arrowDirection);
    } else if (pressedKey === 'ArrowRight') {
        arrowDirection = nextDirectionName;
        handleClick(arrowDirection);
    }
})

controlButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        let buttonDirection = event.target.dataset.sliderBtn;
        handleClick(buttonDirection)
    })
})

slider.addEventListener('transitionend', () => {
    isTransitionOver = true;
    changeSlide(true);
    updateLiveregion();
})

slider.addEventListener('touchstart', (event) => handleMouseDown(event));
slider.addEventListener('touchend', (event) => handleMouseUp(event));
slider.addEventListener('mousedown', (event) => handleMouseDown(event));
slider.addEventListener('mouseup', (event) => handleMouseUp(event));
