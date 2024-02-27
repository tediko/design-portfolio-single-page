# Single-page design portfolio

This time I decided to take on the *Design portfolio challenge*. It seemed like a good place to start learning the **CSS Grid**, which is a very powerful tool and I will definitely use it more often now. I tried a slightly different way of spacing elements. Instead of using multiple media queries for paddings, I tried to use `clamp` for that. There is less code, but in my opinion the readability is a bit worse and it is more difficult to make changes. The biggest challenge was writing an **accessible slider** from scratch.

- Live Site URL: [design-portfolio-tediko.netlify.app](https://design-portfolio-tediko.netlify.app/)

## Table of contents

- [My process](#my-process)
  - [What I learned](#what-i-learned)
  - [Built with](#built-with)
- [Overview](#overview)
  - [Screenshot](#screenshot)
- [Author](#author)

## My process

To create **accessible slider** I used `cloneNode()` JavaScript method to clone the first two and last two slide items. To obtain the effect of an infinite slider when the user changes the slide to cloned one, I turn off the *CSS transition* and restart slider position to either first slide or last slide, depending on direction. Based on the width of the window and the width of the slide, the value for which the slider needs to be moved is calculated to keep the slide in the center of the screen. To keep the slide centered in the container when the user resizes the window, I used the *resize event listener*, which can cause performance issues. To prevent that I used **debounce function**. Debouncing is a performance enhancement technique that is widely used to manage function execution rates. To make slider **accessible**  I followed *W3C WAI* instructions. In short - there's *liveregion container* with `aria-live` and `aria-atomic` attributes that announce which item is currently visible every time slide has changed, and each slide apart from current one is hidden with `aria-hidden` attribute. Slider can be controled with the arrow keys.

### What I learned

- Used [clamp calculator](https://www.marcbacon.com/tools/clamp-calculator/) to find a `clamp()` preferred value expression to perfectly tween a minimum and maximum value between two viewport sizes. 
- Followed [W3C Web Accessibility guidelines](https://www.w3.org/WAI/tutorials/carousels/) to make **accessible slider**
- Implemented [JavaScript Debouning](https://borstch.com/blog/debouncing-and-throttling-in-event-handling) function for resize event listener - Debouncing is a performance enhancement technique that is widely used to manage function execution rates.
- Learned [CSS Grid](https://css-tricks.com/snippets/css/complete-guide-grid/). Grid is a powerful tool for creating two-dimensional layouts on the web.
- I used simple **pseudo-content** [trick](https://inclusive-components.design/cards/) to make entire item clickable for these colorfull tiles. 
- Learned about `:has()` 'parent' selector with some extra superpowers and used it to style an element based on whether one of its children has `:focus-active`. ["focus-visible-within", a pseudo-class that doesn't exist](https://larsmagnus.co/blog/focus-visible-within-the-missing-pseudo-class)

### Built with

- [Sass CSS pre-processor](https://sass-lang.com/). **Sass** is a stylesheet language that’s compiled to CSS. It allows to use variables, nested rules, mixins, functions, and more, all with a fully CSS-compatible syntax. Sass helps keep large stylesheets well-organized and makes it easy to share design within and across projects.
- [Sass file structure](https://gist.github.com/rveitch/84cea9650092119527bc) called **7-1 Pattern**. It offers great way to modularize Sass file structure and help keep things easier to maintain. It's all about having everything in order so it is easier to work with code. 
- Reduced browser inconsistencies in things like default line heights, margins and font sizes of headings, and so on by using [CSS Reset by Andy Bell](https://piccalil.li/blog/a-more-modern-css-reset/)
- [BEM - Block, Element, Modifier](https://getbem.com/) methodology, which is a popular naming convention for classes in HTML and CSS. BEM is useful when it comes to larger, more complex projects when code organization becomes crucial. The idea behind it is to speed up the development process, and ease the teamwork of developers by arranging CSS classes into independent modules.
- **mobile-first** approach. It is one of the best strategies to create either a responsive or adaptive design. Started with the smallest mobile screen and worked my way up.
- `:focus-visible` **pseudo-class** to increase usability for sighted users who use keyboard navigation. The [:focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible) pseudo-class is a native CSS way to style elements that are in focus but only applies when you actually want a visual indicator to help the user see where the focus is.
- Instead of repeating code for reusable elements I write some helper classes to reuse them throughout the project. I created reusable classes for *headings, paragraphs or containers*. This saves time as well as unnecessary code repetition. I will definitely try to improve in this aspect.

## Overview

### Screenshot

![Design preview for the Single-page design portfolio ](./preview.jpg)

## Author

- Frontend Mentor - [@tediko](https://www.frontendmentor.io/profile/tediko)
- Twitter - [@tediko123](https://www.twitter.com/tediko123)
