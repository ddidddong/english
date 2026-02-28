import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WordCard from './WordCard';
import wordsData from '../data/words1000.json';
import './VocabularyBook.css';

export default function VocabularyBook() {
    const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Refs for scrolling
    const scrollContainerRef = useRef(null);
    const wordsContainerRef = useRef(null);

    const activeCategory = wordsData && wordsData.length > 0 ? wordsData[activeCategoryIndex] : null;

    // Filter words based on search query
    const filteredWords = activeCategory ? activeCategory.words.filter(word =>
        word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        word.meaning.includes(searchQuery)
    ) : [];

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
        setSearchQuery('');

        // Reset horizontal scroll of words to start
        if (wordsContainerRef.current) {
            wordsContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        }
    };

    const scrollWords = (direction) => {
        if (wordsContainerRef.current) {
            const scrollAmount = 340; // Approx card width + gap
            wordsContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
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

    if (!activeCategory) {
        return <section className="feature-section vocabulary-section"><div className="section-header">Loading Vocabulary...</div></section>;
    }

    return (
        <section className="feature-section vocabulary-section">
            <div className="section-header">
                <h2 className="section-title">
                    필수 영단어 1000
                </h2>
                <p className="section-desc-ko">일상 회화에 가장 많이 쓰이는 1000개의 단어장입니다.</p>
            </div>

            {/* Horizontal Scroll Tabs */}
            <div className="pattern-tabs-wrapper" style={{ marginBottom: 0 }}>
                <div className="pattern-tabs" ref={scrollContainerRef}>
                    {wordsData.map((category, idx) => {
                        const match = category.title.match(/(.+100)/);
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

            <div className="category-header-area">
                <h3 className="category-full-title">{activeCategory.title}</h3>
                <button
                    className="view-all-btn"
                    onClick={() => setIsModalOpen(true)}
                >
                    ⊞ 전체 단어장 모아보기
                </button>
            </div>

            {/* Carousel display area with arrows */}
            <div className="word-cards-viewport">
                <button
                    className="nav-arrow left-arrow"
                    onClick={() => scrollWords('left')}
                    aria-label="Scroll Left"
                >
                    ◀
                </button>

                <motion.div
                    className="word-cards-container custom-scrollbar"
                    ref={wordsContainerRef}
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    key={activeCategoryIndex}
                >
                    {activeCategory.words.map((word, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <WordCard wordData={word} />
                        </motion.div>
                    ))}
                </motion.div>

                <button
                    className="nav-arrow right-arrow"
                    onClick={() => scrollWords('right')}
                    aria-label="Scroll Right"
                >
                    ▶
                </button>
            </div>

            {/* View All Modal Overlay */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="modal-content"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1, transition: { type: 'spring', damping: 25 } }}
                            exit={{ y: 50, opacity: 0 }}
                        >
                            <div className="modal-header">
                                <h3>{activeCategory.title} 전체보기</h3>
                                <button className="close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
                            </div>

                            <div className="modal-search">
                                <div className="search-input-wrapper">
                                    <input
                                        type="text"
                                        placeholder="단어 또는 뜻으로 검색..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    {searchQuery && (
                                        <button
                                            className="search-clear-btn"
                                            onClick={() => setSearchQuery('')}
                                            aria-label="Clear search"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="modal-list">
                                {filteredWords.length === 0 ? (
                                    <div className="no-results">검색 결과가 없습니다.</div>
                                ) : (
                                    filteredWords.map((word, index) => (
                                        <div key={index} className="modal-list-item">
                                            <div className="modal-word-en">{word.word}</div>
                                            <div className="modal-word-ko">{word.meaning}</div>
                                            <button
                                                className="modal-audio-btn"
                                                onClick={() => {
                                                    if ('speechSynthesis' in window) {
                                                        const u = new SpeechSynthesisUtterance(word.word);
                                                        u.lang = 'en-US';
                                                        window.speechSynthesis.speak(u);
                                                    }
                                                }}
                                            >
                                                🔊
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
