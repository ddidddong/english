import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import './EssentialSentences.css';
import sentencesData from '../data/sentences500.json';

export default function EssentialSentences() {
    const [activePatternIndex, setActivePatternIndex] = useState(0);
    const [playingSentenceIndex, setPlayingSentenceIndex] = useState(null);
    const scrollContainerRef = useRef(null);

    const activePattern = sentencesData[activePatternIndex];

    const handlePlayAudio = (text, index) => {
        if (!('speechSynthesis' in window)) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        setPlayingSentenceIndex(index);

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;

        utterance.onend = () => {
            setPlayingSentenceIndex(null);
        };

        utterance.onerror = () => {
            setPlayingSentenceIndex(null);
        };

        window.speechSynthesis.speak(utterance);
    };

    // Scroll Progress Bar
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
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

    return (
        <div className="essential-container">
            {/* Scroll Progress Bar at the Top */}
            <motion.div
                className="progress-bar"
                style={{ scaleX }}
            />

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
                            onClick={() => {
                                window.speechSynthesis.cancel();
                                setPlayingSentenceIndex(null);
                                setActivePatternIndex(idx);
                            }}
                        >
                            패턴 {idx + 1}
                        </button>
                    ))}
                </div>
            </div>

            <div className="pattern-header">
                <h3>{activePattern.title}</h3>
                <div className="pattern-count">{activePattern.sentences.length} 문장</div>
            </div>

            <motion.ul
                className="sentences-list"
                key={activePatternIndex} // re-trigger animation on tab change
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {activePattern.sentences.map((item, idx) => (
                    <motion.li
                        key={idx}
                        className="sentence-item"
                        variants={itemVariants}
                    >
                        <div className="sentence-number">{idx + 1}</div>
                        <div className="sentence-content">
                            <div className="sentence-en">{item.en}</div>
                            <div className="sentence-ko">{item.ko}</div>
                        </div>
                        <button
                            className={`audio-btn ${playingSentenceIndex === idx ? 'playing' : ''}`}
                            onClick={() => handlePlayAudio(item.en, idx)}
                            title="듣기"
                            aria-label="Play pronunciation"
                        >
                            {playingSentenceIndex === idx ? '🔊' : '🔈'}
                        </button>
                    </motion.li>
                ))}
            </motion.ul>
        </div>
    );
}
