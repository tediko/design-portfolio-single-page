const slider = document.querySelector('[data-slider]');
const sliderContainer = document.querySelector('[data-slider-container]');
const slides = document.querySelectorAll('[data-slide]');
const controlButtons = document.querySelectorAll('[data-slider-btn]');
const liveregion = document.querySelector('[data-slider-liveregion]');

let bodyWidth, bodyPadding, sliderGap, slideWidth;
let counter, slidesWithClones, firstSlideIndex, lastSlideIndex;
let isTransitionOver = true;
let direction;

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

// If there is some transition on slider return function. 
// Assign event.dataset value to direction variable.
// Invoke changeSlide function.
const handleClick = (event) => {
    if (!isTransitionOver) return;
    isTransitionOver = false;
    direction = event.target.dataset.sliderBtn;
    changeSlide();
}

// Calculates the position of the slider 
// so that the current slide is always in the center of the screen.
// apply CSS transform styles to slider to position it. 
const addSliderOffset = (slideIndex) => {
    counter = slideIndex;
    const slideOffset = (-bodyPadding / 2 ) + (slideWidth * slideIndex) - ((bodyWidth - slideWidth) / 2);
    slider.style.transform = `translateX(${slideOffset > 0 ? '-' : ''}${Math.abs(slideOffset)}px)`;
}

// Toggle CSS transition on slider
const toggleTransition = (canTransition) => {
    slider.style.transition = canTransition ? `transform 200ms ease-in-out` : 'none';
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
        if (direction === "next") {
            counter++;
            addSliderOffset(counter);
            return;
        } else if (direction === "prev") {
            counter--;
            addSliderOffset(counter);
        }
    } 

    if (checkForCloned && isCloned) {
        toggleTransition(false)
        if (direction === "next") {
            addSliderOffset(firstSlideIndex);
        } else if (direction === "prev") {
            addSliderOffset(lastSlideIndex);
        }
    }

    hideTransitioningSlides();
}

// Get document and slider elements dimensions.
const getElementSizes = () => {
    bodyWidth = document.body.getBoundingClientRect().width;
    bodyPadding = parseFloat(getComputedStyle(document.body).paddingLeft);
    sliderGap = parseFloat(getComputedStyle(slider).gap); //gap between each slide
    slideWidth = slides[0].getBoundingClientRect().width + sliderGap;
}

// Update slider position.
const handleResize = () => {
    getElementSizes()
    sliderContainer.style.left = `-${bodyPadding}px`;
    addSliderOffset(counter);
}

// Clone slides, then get sizes from them and assign variables based on that data.
const initialLoad = () => {
    cloneSlides();
    getElementSizes();

    sliderContainer.style.left = `-${bodyPadding}px`;
    slidesWithClones = document.querySelectorAll('[data-slide]');
    firstSlideIndex = 2; // first not cloned slide index
    lastSlideIndex = slidesWithClones.length - 3; // last not cloned slide index
    counter = Math.floor((slidesWithClones.length - 1) / 2); // the slide located middle of the slider
    addSliderOffset(counter);
    hideTransitioningSlides();
}

// Debounce function
// Restricting the rate at which a function is executed
let debounceTimer;
const debounce = (callback, delay) => {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => callback(), delay);
}

// Event listeners
addEventListener("load", () => {
    initialLoad();
});

addEventListener("resize", () => {
    debounce(handleResize, 300);
});

controlButtons.forEach(button => {
    button.addEventListener('click', (event) => handleClick(event))
})

slider.addEventListener('transitionend', () => {
    isTransitionOver = true;
    changeSlide(true);
    updateLiveregion();
})