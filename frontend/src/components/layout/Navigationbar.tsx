'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function Navigationbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isPromoVisible, setIsPromoVisible] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();

    // Handle Scroll Logic
    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 50) {
            setIsScrolled(true);
            // Optional: Auto-hide promo on scroll
            if (latest > 100 && isPromoVisible) setIsPromoVisible(false);
        } else {
            setIsScrolled(false);
            setIsPromoVisible(true);
        }
    });

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen]);

    return (
        <>
            {/* --- Promo Banner --- */}
            <AnimatePresence>
                {isPromoVisible && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white relative z-[60] overflow-hidden"
                    >
                        <div className="container mx-auto px-4 py-2">
                            <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-medium">
                                <span>Unlock unlimited potential.</span>
                                <span className="bg-white/10 border border-white/20 px-2 py-0.5 rounded-full text-purple-200">
                                    ₹19/year
                                </span>
                                <Link href="/register" className="underline hover:text-purple-300 transition-colors">
                                    Get Started &rarr;
                                </Link>

                                <button
                                    onClick={() => setIsPromoVisible(false)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- Main Navigation --- */}
            <div className="container mx-auto px-4">
                <header className=" fixed top-0 left-0 right-0 z-50 flex justify-center pt-0 md:pt-4 px-0 md:px-4 pointer-events-none">
                    <motion.nav
                        layout
                        initial={{ y: 0, width: '100%' }}
                        animate={{
                            y: isScrolled ? 0 : 0, // Keep vertical position consistent or adjust
                            width: isScrolled ? '90%' : '100%',
                            maxWidth: isScrolled ? '1024px' : '100%',
                            borderRadius: isScrolled ? '50px' : '0px',
                            marginTop: isScrolled ? (isPromoVisible ? '0px' : '10px') : '0px',
                        }}
                        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }}
                        className={`
            pointer-events-auto
            flex flex-col relative transition-all duration-300
            ${isScrolled
                                ? 'bg-[#0a0a0a]/30 backdrop-blur-xl border border-white/10 shadow-2xl shadow-purple-500/10'
                                : 'bg-transparent md:bg-gradient-to-b md:from-black/50 md:to-transparent'
                            }
          `}
                    >
                        <div className={`flex items-center justify-between px-6 ${isScrolled ? 'py-4' : 'py-12'}`}>

                            {/* Logo */}
                            <Link href="/" className="flex items-center gap-2 group">
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-lg  group-hover:scale-105 transition-transform duration-300">
                                    <Image src="/proomptify.png" alt="Proomptify Logo" width={84} height={24} className="" />
                                </div>
                            </Link>

                            {/* Desktop Menu */}
                            <div className="hidden md:flex items-center gap-8">
                                {['Home', 'Prompts', 'Pricing'].map((item) => (
                                    <Link
                                        key={item}
                                        href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                        className="text-lg font-medium text-white/70 hover:text-white transition-colors relative group lxgw-mono"
                                    >
                                        {item}
                                        <span className="absolute -bottom-4 left-1/2 w-0 h-[2px] bg-purple-500 group-hover:w-full group-hover:left-0 transition-all duration-300 rounded-full opacity-0 group-hover:opacity-100" />
                                    </Link>
                                ))}
                            </div>

                            {/* Desktop Auth Buttons */}
                            <div className="hidden md:flex items-center gap-3">
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-white/80 hover:text-white px-4 py-2 transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/register"
                                    className="group relative px-5 py-2 rounded-full bg-white text-black text-sm font-semibold overflow-hidden transition-transform hover:scale-105 active:scale-95"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                                    <span>Get Started</span>
                                </Link>
                            </div>

                            {/* Mobile Toggle Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden text-white p-2 focus:outline-none"
                                aria-label="Toggle menu"
                            >
                                <div className="w-6 h-5 relative flex flex-col justify-between">
                                    <motion.span
                                        animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                                        className="w-full h-0.5 bg-white rounded-full origin-center"
                                    />
                                    <motion.span
                                        animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                                        className="w-full h-0.5 bg-white rounded-full"
                                    />
                                    <motion.span
                                        animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                                        className="w-full h-0.5 bg-white rounded-full origin-center"
                                    />
                                </div>
                            </button>
                        </div>

                        {/* Mobile Menu Dropdown */}
                        <AnimatePresence>
                            {isMobileMenuOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="md:hidden overflow-hidden bg-black/95 backdrop-blur-md border-t border-white/10"
                                >
                                    <div className="flex flex-col p-6 space-y-4">
                                        {['Home', 'Prompts', 'Pricing'].map((item) => (
                                            <Link
                                                key={item}
                                                href={`/${item.toLowerCase()}`}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="text-lg text-white/70 hover:text-white font-medium border-b border-white/5 pb-2"
                                            >
                                                {item}
                                            </Link>
                                        ))}
                                        <div className="flex flex-col gap-3 pt-4">
                                            <Link
                                                href="/login"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="w-full py-3 text-center rounded-xl bg-white/5 border border-white/10 text-white font-medium active:bg-white/10"
                                            >
                                                Log in
                                            </Link>
                                            <Link
                                                href="/register"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="w-full py-3 text-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold shadow-lg shadow-purple-900/20 active:scale-[0.98] transition-transform"
                                            >
                                                Get Started Free
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.nav>
                </header>
            </div>
        </>
    );
};
