import { Directive, Input, HostListener, OnInit, ElementRef } from '@angular/core';

@Directive({
    selector: '[appScrollTo]'
})
export class SmoothScrollToDirective {
    targetElement: any;

    constructor() {}

    @Input() public appScrollTo: string;
    @Input() public duration: number;
    @Input() public offset: number;
    @Input() public easing: string;
    @Input() public callbackBefore: any;
    @Input() public callbackAfter: any;
    @Input() public containerId: string;
    @Input() public middleAlign: any;

    @HostListener('click') onClick() {
        this.targetElement = document.getElementById(this.appScrollTo);
        if (!this.targetElement) {
            return;
        }

        new SmoothScroll(this.targetElement, {
            duration: this.duration,
            offset: this.offset,
            easing: this.easing,
            callbackBefore: this.callbackBefore,
            callbackAfter: this.callbackAfter,
            containerId: this.containerId,
            middleAlign: this.middleAlign
        });
    }

}

@Directive({
    selector: '[appSmoothScroll]'
})
export class SmoothScrollDirective implements OnInit {
    private el;

    constructor(el: ElementRef) {
        this.el = el;
    }

    @Input() public scrollIf: boolean;
    @Input() public duration: number;
    @Input() public offset: number;
    @Input() public easing: string;
    @Input() public callbackBefore: any;
    @Input() public callbackAfter: any;
    @Input() public containerId: string;
    @Input() public scrollOnClick: boolean;
    @Input() public middleAlign: any;

    @HostListener('click', ['$event.target']) onClick(target) {
        if (this.scrollOnClick) {
            this.scroll();
        }
    }

    public ngOnInit() {
        this.scroll();
    }

    private scroll() {
        if (typeof this.scrollIf === 'undefined' || this.scrollIf === true) {
            setTimeout(() => {
                new SmoothScroll(this.el.nativeElement, {
                    duration: this.duration,
                    offset: this.offset,
                    easing: this.easing,
                    callbackBefore: this.callbackBefore,
                    callbackAfter: this.callbackAfter,
                    containerId: this.containerId,
                    middleAlign: this.middleAlign
                });
            }, 0);
        }
    }

}


class SmoothScroll {
    constructor(element: any, options: any) {
        this.smoothScroll(element, options);
    }
    private smoothScroll(element, options) {
        options = options || {};

        // Options
        const duration = options.duration || 800,
            offset = options.offset || 0,
            easing = options.easing || 'easeInOutQuart',
            callbackBefore = options.callbackBefore || function() {},
            callbackAfter = options.callbackAfter || function() {},
            container = document.getElementById(options.containerId) || null,
            containerPresent = (container !== undefined && container != null),
            middleAlign = options.middleAlign || false;

        /**
         * Retrieve current location
         */
        const getScrollLocation = function () {
            if (containerPresent) {
                return container.scrollTop;
            } else {
                if (window.pageYOffset) {
                    return window.pageYOffset;
                } else {
                    return document.documentElement.scrollTop;
                }
            }
        };

        /**
         * Calculate easing pattern.
         *
         * 20150713 edit - zephinzer
         * - changed if-else to switch
         * @see http://archive.oreilly.com/pub/a/server-administration/excerpts/even-faster-websites/writing-efficient-javascript.html
         */
        const getEasingPattern = function (type, time) {
            switch (type) {
                case 'easeInQuad': return time * time; // accelerating from zero velocity
                case 'easeOutQuad': return time * (2 - time); // decelerating to zero velocity
                case 'easeInOutQuad': return time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time; // acceleration until halfway, then deceleration
                case 'easeInCubic': return time * time * time; // accelerating from zero velocity
                case 'easeOutCubic': return (--time) * time * time + 1; // decelerating to zero velocity
                case 'easeInOutCubic': return time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1; // acceleration until halfway, then deceleration
                case 'easeInQuart': return time * time * time * time; // accelerating from zero velocity
                case 'easeOutQuart': return 1 - (--time) * time * time * time; // decelerating to zero velocity
                case 'easeInOutQuart': return time < 0.5 ? 8 * time * time * time * time : 1 - 8 * (--time) * time * time * time; // acceleration until halfway, then deceleration
                case 'easeInQuint': return time * time * time * time * time; // accelerating from zero velocity
                case 'easeOutQuint': return 1 + (--time) * time * time * time * time; // decelerating to zero velocity
                case 'easeInOutQuint': return time < 0.5 ? 16 * time * time * time * time * time : 1 + 16 * (--time) * time * time * time * time; // acceleration until halfway, then deceleration
                default: return time;
            }
        };

        /**
         * Calculate how far to scroll
         */
        const getEndLocation = function (elementIn) {
            let location = 0;
            const elementRect = elementIn.getBoundingClientRect();
            const absoluteElementTop = elementRect.top + window.pageYOffset;

            if (middleAlign) {
                location = (absoluteElementTop + (elementIn.offsetHeight / 2)) - (window.innerHeight / 2);
            } else {
                location = absoluteElementTop;
            }

            if (offset) {
                location = location - offset;
            }

            return Math.max(location, 0);
        };

        // Initialize the whole thing
        setTimeout(function () {
            let currentLocation = null;
            const startLocation = getScrollLocation();
            const endLocation = getEndLocation(element);
            let timeLapsed = 0;
            const distance = endLocation - startLocation;
            let percentage,
                position,
                scrollHeight,
                internalHeight;

            /**
             * Stop the scrolling animation when the anchor is reached (or at the top/bottom of the page)
             */
            const stopAnimation = function () {
                currentLocation = getScrollLocation();
                if (containerPresent) {
                    scrollHeight = container.scrollHeight;
                    internalHeight = container.clientHeight + currentLocation;
                } else {
                    scrollHeight = document.body.scrollHeight;
                    internalHeight = window.innerHeight + currentLocation;
                }

                if (
                    ( // condition 1
                        position === endLocation
                    ) ||
                    ( // condition 2
                        currentLocation === endLocation
                    ) ||
                    ( // condition 3
                        internalHeight > scrollHeight
                    )
                ) { // stop
                    clearInterval(runAnimation);

                    callbackAfter(element);
                }
            };

            /**
             * Scroll the page by an increment, and check if it's time to stop
             */
            const animateScroll = function () {
                timeLapsed += 16;
                percentage = (timeLapsed / duration);
                percentage = (percentage > 1) ? 1 : percentage;
                position = startLocation + (distance * getEasingPattern(easing, percentage));
                if (containerPresent) {
                    container.scrollTop = position;
                } else {
                    window.scrollTo(0, position);
                }
                stopAnimation();
            };

            callbackBefore(element);

            const runAnimation = setInterval(animateScroll, 16);
        }, 0);

    }
}
