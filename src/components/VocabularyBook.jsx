import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import WordCard from './WordCard';
import wordsData from '../data/words1000.json';
import './VocabularyBook.css';

export default function VocabularyBook() {
    const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
    const scrollContainerRef = useRef(null);

    const activeCategory = wordsData[activeCategoryIndex];

    // Auto-scroll the pattern tabs to the active item
    useEffect(() => {
        if (scrollContainerRef.current) {
            const activeTab = scrollContainerRef.current.children[activeCategoryIndex];
            if (activeTab) {
                activeTab.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        }
    }, [activeCategoryIndex]);

    const handleCategoryChange = (idx) => {
        window.speechSynthesis.cancel();
        setActiveCategoryIndex(idx);
    };

    // Stagger animation for Word Cards
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
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300 } }
    };

    return (
        <section className="feature-section vocabulary-section">
            <div className="section-header">
                <h2 className="section-title">
                    필수 영단어 1000
                </h2>
                <p className="section-desc-ko">일상 회화에 가장 많이 쓰이는 1000개의 단어장입니다.</p>
            </div>

            {/* Horizontal Scroll Tabs (using same CSS pattern from EssentialSentences) */}
            <div className="pattern-tabs-wrapper" style={{ marginBottom: 0 }}>
                <div className="pattern-tabs" ref={scrollContainerRef}>
                    {wordsData.map((category, idx) => {
                        // Extracting just the Korean part or a short title for the tab
                        // E.g., from "1. 필수 동사 100 (Essential Verbs)" -> "필수 동사 100"
                        const match = category.title.match(/(\\S+\\s*\\S+\\s*100)/);
                        const shortTitle = match ? match[0] : `카테고리 ${idx + 1}`;

                        return (
                            <button
                                key={idx}
                                className={`pattern-tab ${idx === activeCategoryIndex ? 'active' : ''}`}
                                onClick={() => handleCategoryChange(idx)}
                            >
                                {shortTitle}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="category-full-title">
                <h3>{activeCategory.title}</h3>
            </div>

            <motion.div
                className="word-cards-container custom-scrollbar"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                key={activeCategoryIndex} // Re-trigger animation on category change
            >
                {activeCategory.words.map((word, index) => (
                    <motion.div key={index} variants={itemVariants}>
                        <WordCard wordData={word} />
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
