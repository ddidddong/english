import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GNB from './components/GNB';
import VocabularyBook from './components/VocabularyBook';
import PatternPlay from './components/PatternPlay';
import QuizBlock from './components/QuizBlock';
import AlphabetWriting from './components/AlphabetWriting';
import EssentialSentences from './components/EssentialSentences';
import './index.css';


function App() {
    const [streak, setStreak] = useState(0);
    const [activeTab, setActiveTab] = useState('word');

    // Simple Streak implementation
    useEffect(() => {
        const lastLogin = localStorage.getItem('lastLogin');
        const today = new Date().toDateString();

        if (lastLogin !== today) {
            let currentStreak = parseInt(localStorage.getItem('streak') || '0', 10);

            if (lastLogin) {
                let yesterdayDate = new Date();
                yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                if (lastLogin === yesterdayDate.toDateString()) {
                    currentStreak += 1; // Consecutive login
                } else {
                    currentStreak = 1; // Streak broken
                }
            } else {
                currentStreak = 1; // First login ever
            }

            localStorage.setItem('streak', currentStreak.toString());
            localStorage.setItem('lastLogin', today);
            setStreak(currentStreak);
        } else {
            // Already logged in today
            setStreak(parseInt(localStorage.getItem('streak') || '1', 10));
        }
    }, []);

    return (
        <div className="app-container">
            <GNB activeTab={activeTab} setActiveTab={setActiveTab} />

            <header className="header" style={{ justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <div className="day-streak">
                    🔥 {streak} Day{streak !== 1 ? 's' : ''}
                </div>
            </header>

            <main className="main-content">
                <AnimatePresence mode="wait">
                    {activeTab === 'word' && (
                        <motion.section
                            key="word"
                            className="feature-section"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <VocabularyBook />
                        </motion.section>
                    )}

                    {activeTab === 'pattern' && (
                        <motion.section
                            key="pattern"
                            className="feature-section"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="section-header">
                                <h2 className="section-title">Pattern Play</h2>
                                <p className="section-desc-ko">빈칸에 알맞은 단어를 넣어 문장을 완성해보세요!</p>
                            </div>
                            <PatternPlay />
                        </motion.section>
                    )}

                    {activeTab === 'quiz' && (
                        <motion.section
                            key="quiz"
                            className="feature-section"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="section-header">
                                <h2 className="section-title">Sentence Quiz</h2>
                                <p className="section-desc-ko">흩어진 단어 블록을 순서대로 눌러서 문장을 조립해보세요!</p>
                            </div>
                            <QuizBlock />
                        </motion.section>
                    )}

                    {activeTab === 'alphabet' && (
                        <motion.section
                            key="alphabet"
                            className="feature-section"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="section-header">
                                <h2 className="section-title">Alphabet Writing</h2>
                                <p className="section-desc-ko">화면을 드래그하여 대문자와 소문자 알파벳을 적어보세요!</p>
                            </div>
                            <AlphabetWriting />
                        </motion.section>
                    )}

                    {activeTab === 'essential' && (
                        <motion.section
                            key="essential"
                            className="feature-section"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <EssentialSentences />
                        </motion.section>
                    )}
                </AnimatePresence>
            </main>
        </div>
    )
}

export default App
