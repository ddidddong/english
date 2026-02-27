import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './EssentialSentences.css';
import sentencesData from '../data/sentences500.json';

export default function EssentialSentences() {
    const [activePatternIndex, setActivePatternIndex] = useState(0);
    const [activeSentenceIndex, setActiveSentenceIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(false);
    const [playingSentenceIndex, setPlayingSentenceIndex] = useState(null);
    const [direction, setDirection] = useState(1); // 1 = down (next), -1 = up (prev)

    const scrollContainerRef = useRef(null);
    const autoPlayTimeoutRef = useRef(null);

    const activePattern = sentencesData[activePatternIndex];
    const totalSentences = activePattern.sentences.length;

    // Handle Manual Audio Playback
    const handlePlayAudio = (text, index) => {
        if (!('speechSynthesis' in window)) return;

        window.speechSynthesis.cancel();
        if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);

        // If clicking a different button while auto-playing, stop auto-play
        if (isAutoPlaying && index !== activeSentenceIndex) {
            setIsAutoPlaying(false);
        }

        setPlayingSentenceIndex(index);

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;

        utterance.onend = () => {
            setPlayingSentenceIndex(null);

            // If Auto-Play is ON, move to next sentence
            if (isAutoPlaying) {
                autoPlayTimeoutRef.current = setTimeout(() => {
                    handleNext();
                }, 800); // 0.8s pause between sentences
            }
        };

        utterance.onerror = () => {
            setPlayingSentenceIndex(null);
            setIsAutoPlaying(false);
        };

        window.speechSynthesis.speak(utterance);
    };

    // Auto-scroll the pattern tabs to the active item
    useEffect(() => {
        if (scrollContainerRef.current) {
            const activeTab = scrollContainerRef.current.children[activePatternIndex];
            if (activeTab) {
                activeTab.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        }
    }, [activePatternIndex]);

    // Triggers when sentence index changes during Auto-Play
    useEffect(() => {
        if (isAutoPlaying) {
            const currentSentence = activePattern.sentences[activeSentenceIndex];
            // Small delay to allow the slide animation to start before speaking
            const initialDelay = setTimeout(() => {
                handlePlayAudio(currentSentence.en, activeSentenceIndex);
            }, 300);
            return () => clearTimeout(initialDelay);
        }
    }, [activeSentenceIndex, isAutoPlaying, activePatternIndex]);

    // Clean up on unmount or pattern change
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
            if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
        };
    }, []);

    const handlePatternChange = (idx) => {
        window.speechSynthesis.cancel();
        setIsAutoPlaying(false);
        setPlayingSentenceIndex(null);
        setActivePatternIndex(idx);
        setActiveSentenceIndex(0);
        setDirection(1);
    };

    const toggleAutoPlay = () => {
        if (isAutoPlaying) {
            setIsAutoPlaying(false);
            window.speechSynthesis.cancel();
            setPlayingSentenceIndex(null);
            if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
        } else {
            setIsAutoPlaying(true);
            // Effect will trigger playback
        }
    };

    const handleNext = () => {
        if (activeSentenceIndex < totalSentences - 1) {
            setDirection(1);
            setActiveSentenceIndex(prev => prev + 1);
        } else {
            // Reached the end of the pattern
            setIsAutoPlaying(false);
            window.speechSynthesis.cancel();
        }
    };

    const handlePrev = () => {
        if (activeSentenceIndex > 0) {
            setDirection(-1);
            setActiveSentenceIndex(prev => prev - 1);
        }
        setIsAutoPlaying(false); // Manual navigation stops auto-play
        window.speechSynthesis.cancel();
    };

    // Framer Motion Variants for Flashcards
    const flashcardVariants = {
        enter: (direction) => {
            return {
                y: direction > 0 ? 100 : -100,
                opacity: 0,
                scale: 0.95,
                zIndex: 0
            };
        },
        center: {
            y: 0,
            opacity: 1,
            scale: 1,
            zIndex: 1,
            transition: {
                y: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
            }
        },
        exit: (direction) => {
            return {
                y: direction < 0 ? 100 : -100,
                opacity: 0,
                scale: 0.95,
                zIndex: 0,
                transition: {
                    y: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                }
            };
        }
    };

    // Render Previous, Current, and Next cards for visual context using absolute positioning
    const prevItem = activeSentenceIndex > 0 ? activePattern.sentences[activeSentenceIndex - 1] : null;
    const currentItem = activePattern.sentences[activeSentenceIndex];
    const nextItem = activeSentenceIndex < totalSentences - 1 ? activePattern.sentences[activeSentenceIndex + 1] : null;

    // Calculate progress fraction for the top bar
    const progressPercent = ((activeSentenceIndex + 1) / totalSentences) * 100;

    return (
        <div className="essential-container no-scroll">
            {/* Index Progress Bar at the Top */}
            <div
                className="progress-bar-container"
            >
                <motion.div
                    className="progress-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                />
            </div>

            {/* Top Fixed Area */}
            <div className="essential-header-fixed">
                <h2 className="section-title">
                    필수 문장 500
                    <span className="subtitle">Essential 500</span>
                </h2>

                <div className="pattern-tabs-wrapper">
                    <div className="pattern-tabs" ref={scrollContainerRef}>
                        {sentencesData.map((pattern, idx) => (
                            <button
                                key={idx}
                                className={`pattern-tab ${idx === activePatternIndex ? 'active' : ''}`}
                                onClick={() => handlePatternChange(idx)}
                            >
                                패턴 {idx + 1}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pattern-header-card">
                    <div className="pattern-title">
                        <h3>{activePattern.title}</h3>
                        <div className="pattern-count">{activeSentenceIndex + 1} / {totalSentences}</div>
                    </div>

                    <button
                        className={`autoplay-btn ${isAutoPlaying ? 'active' : ''}`}
                        onClick={toggleAutoPlay}
                    >
                        {isAutoPlaying ? '⏸ 자동 재생 중' : '▶ 자동 연속 듣기'}
                    </button>
                </div>
            </div>

            {/* Flashcard Carousel Area */}
            <div className="flashcard-viewport">
                {/* Visual hint for previous card (Top faded) */}
                {prevItem && (
                    <div className="flashcard-hint prev" onClick={handlePrev}>
                        <div className="sentence-en hint-text">{prevItem.en}</div>
                    </div>
                )}

                <div className="flashcard-carousel">
                    <AnimatePresence initial={false} custom={direction} mode="popLayout">
                        <motion.div
                            key={activeSentenceIndex}
                            custom={direction}
                            variants={flashcardVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="flashcard active-card"
                            drag="y"
                            dragConstraints={{ top: 0, bottom: 0 }}
                            dragElastic={1}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = offset.y;
                                if (swipe < -50 || velocity.y < -500) {
                                    handleNext();
                                } else if (swipe > 50 || velocity.y > 500) {
                                    handlePrev();
                                }
                            }}
                        >
                            <div className="card-top">
                                <div className="sentence-number">#{activeSentenceIndex + 1}</div>
                                <button
                                    className={`audio-btn large ${playingSentenceIndex === activeSentenceIndex ? 'playing' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePlayAudio(currentItem.en, activeSentenceIndex);
                                    }}
                                    title="듣기"
                                    aria-label="Play pronunciation"
                                >
                                    {playingSentenceIndex === activeSentenceIndex ? '🔊' : '🔈'}
                                </button>
                            </div>

                            <div className="sentence-content large">
                                <div className="sentence-en large">{currentItem.en}</div>
                                <div className="sentence-ko large">{currentItem.ko}</div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Visual hint for next card (Bottom faded) */}
                {nextItem && (
                    <div className="flashcard-hint next" onClick={handleNext}>
                        <div className="sentence-en hint-text">{nextItem.en}</div>
                    </div>
                )}
            </div>

            {/* Bottom Nav Controls */}
            <div className="flashcard-controls">
                <button
                    className="nav-btn prev-btn"
                    onClick={handlePrev}
                    disabled={activeSentenceIndex === 0}
                >
                    ◀ 이전
                </button>
                <div className="progress-dots">
                    {[...Array(totalSentences)].map((_, i) => (
                        i === activeSentenceIndex ? <span key={i} className="dot active"></span> :
                            (i > activeSentenceIndex - 3 && i < activeSentenceIndex + 3) ? <span key={i} className="dot"></span> : null
                    ))}
                </div>
                <button
                    className="nav-btn next-btn"
                    onClick={handleNext}
                    disabled={activeSentenceIndex === totalSentences - 1}
                >
                    다음 ▶
                </button>
            </div>
        </div>
    );
}
