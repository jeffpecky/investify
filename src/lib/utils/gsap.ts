/**
 * GSAP animation utilities for Svelte — use:animate directive and helpers.
 *
 * Usage in Svelte components:
 *   <div use:animate={{ type: 'fadeUp' }}>   — fades up on scroll
 *   <div use:animate={{ type: 'fadeUp', delay: 0.2 }}>
 *   <div use:animate={{ type: 'stagger', stagger: 0.1 }}>  — staggers children
 *   <div use:animate={{ type: 'parallax', speed: 0.3 }}>   — parallax on scroll
 *   <div use:animate={{ type: 'reveal' }}>   — clip-path reveal
 *   <div use:animate={{ type: 'counter', target: 4200 }}>  — number counter
 *   <h1 use:splitText>   — per-word staggered reveal
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ────────────────── Shared defaults ────────────────── */
const EASE = 'power3.out';
const DURATION = 1;

/* ────────────────── use:animate action ────────────────── */
export interface AnimateOptions {
    type?: 'fadeUp' | 'fadeDown' | 'fadeLeft' | 'fadeRight' | 'fade' | 'scale' | 'stagger' | 'parallax' | 'reveal' | 'counter' | 'slideIn';
    delay?: number;
    duration?: number;
    stagger?: number;
    speed?: number; // parallax speed
    target?: number; // counter target
    once?: boolean;
}

export function animate(node: HTMLElement, opts: AnimateOptions = {}) {
    const {
        type = 'fadeUp',
        delay = 0,
        duration = DURATION,
        stagger = 0.1,
        speed = 0.3,
        target = 0,
        once = true,
    } = opts;

    let ctx: gsap.Context;

    // Small delay to ensure DOM is painted
    requestAnimationFrame(() => {
        ctx = gsap.context(() => {
            switch (type) {
                case 'fadeUp':
                    gsap.from(node, {
                        y: 60,
                        opacity: 0,
                        duration,
                        delay,
                        ease: EASE,
                        scrollTrigger: { trigger: node, start: 'top 90%', once },
                    });
                    break;

                case 'fadeDown':
                    gsap.from(node, {
                        y: -60,
                        opacity: 0,
                        duration,
                        delay,
                        ease: EASE,
                        scrollTrigger: { trigger: node, start: 'top 90%', once },
                    });
                    break;

                case 'fadeLeft':
                    gsap.from(node, {
                        x: -80,
                        opacity: 0,
                        duration,
                        delay,
                        ease: EASE,
                        scrollTrigger: { trigger: node, start: 'top 90%', once },
                    });
                    break;

                case 'fadeRight':
                    gsap.from(node, {
                        x: 80,
                        opacity: 0,
                        duration,
                        delay,
                        ease: EASE,
                        scrollTrigger: { trigger: node, start: 'top 90%', once },
                    });
                    break;

                case 'fade':
                    gsap.from(node, {
                        opacity: 0,
                        duration,
                        delay,
                        ease: EASE,
                        scrollTrigger: { trigger: node, start: 'top 90%', once },
                    });
                    break;

                case 'scale':
                    gsap.from(node, {
                        scale: 0.85,
                        opacity: 0,
                        duration,
                        delay,
                        ease: EASE,
                        scrollTrigger: { trigger: node, start: 'top 90%', once },
                    });
                    break;

                case 'slideIn':
                    gsap.from(node, {
                        x: '100%',
                        opacity: 0,
                        duration: duration * 1.2,
                        delay,
                        ease: 'power4.out',
                        scrollTrigger: { trigger: node, start: 'top 90%', once },
                    });
                    break;

                case 'stagger':
                    gsap.from(node.children, {
                        y: 40,
                        opacity: 0,
                        duration: duration * 0.8,
                        delay,
                        stagger,
                        ease: EASE,
                        scrollTrigger: { trigger: node, start: 'top 85%', once },
                    });
                    break;

                case 'parallax':
                    gsap.to(node, {
                        y: () => -100 * speed,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: node,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true,
                        },
                    });
                    break;

                case 'reveal':
                    gsap.from(node, {
                        clipPath: 'inset(100% 0% 0% 0%)',
                        duration: duration * 1.2,
                        delay,
                        ease: 'power4.inOut',
                        scrollTrigger: { trigger: node, start: 'top 85%', once },
                    });
                    break;

                case 'counter':
                    const proxy = { val: 0 };
                    gsap.to(proxy, {
                        val: target,
                        duration: 2,
                        delay,
                        ease: 'power2.out',
                        scrollTrigger: { trigger: node, start: 'top 85%', once },
                        onUpdate: () => {
                            node.textContent = Math.round(proxy.val).toLocaleString();
                        },
                    });
                    break;
            }
        }, node);
    });

    return {
        destroy() {
            ctx?.revert();
        },
    };
}

/* ────────────────── use:splitText action — per-word stagger ────────────────── */
export function splitText(node: HTMLElement, opts: { delay?: number } = {}) {
    const { delay = 0 } = opts;
    let ctx: gsap.Context;

    requestAnimationFrame(() => {
        const text = node.textContent || '';
        const words = text.split(/\s+/).filter(Boolean);

        node.innerHTML = words
            .map(
                (word) =>
                    `<span style="display:inline-block;overflow:hidden;"><span class="split-word" style="display:inline-block;">${word}</span></span>`
            )
            .join(' ');

        const wordEls = node.querySelectorAll('.split-word');

        ctx = gsap.context(() => {
            gsap.from(wordEls, {
                y: '110%',
                opacity: 0,
                duration: 0.8,
                delay,
                stagger: 0.04,
                ease: 'power3.out',
                scrollTrigger: { trigger: node, start: 'top 90%', once: true },
            });
        }, node);
    });

    return {
        destroy() {
            ctx?.revert();
        },
    };
}

/* ────────────────── Magnetic hover effect for buttons ────────────────── */
export function magnetic(node: HTMLElement, strength: number = 0.3) {
    const onMouseMove = (e: MouseEvent) => {
        const rect = node.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(node, { x: x * strength, y: y * strength, duration: 0.3, ease: 'power2.out' });
    };
    const onMouseLeave = () => {
        gsap.to(node, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    };

    node.addEventListener('mousemove', onMouseMove);
    node.addEventListener('mouseleave', onMouseLeave);

    return {
        destroy() {
            node.removeEventListener('mousemove', onMouseMove);
            node.removeEventListener('mouseleave', onMouseLeave);
        },
    };
}

/* ────────────────── Smooth image parallax for hero backgrounds ────────────────── */
export function heroParallax(node: HTMLElement, speed: number = 0.4) {
    let ctx: gsap.Context;

    requestAnimationFrame(() => {
        ctx = gsap.context(() => {
            gsap.to(node, {
                yPercent: speed * 30,
                ease: 'none',
                scrollTrigger: {
                    trigger: node.parentElement,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                },
            });
        }, node);
    });

    return {
        destroy() {
            ctx?.revert();
        },
    };
}
