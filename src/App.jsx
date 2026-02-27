import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GNB from './components/GNB';
import WordCard from './components/WordCard';
import PatternPlay from './components/PatternPlay';
import QuizBlock from './components/QuizBlock';
import AlphabetWriting from './components/AlphabetWriting';
import EssentialSentences from './components/EssentialSentences';
import './index.css';

const DAILY_WORDS = [
    {
        id: 1,
        word: 'Serene',
        meaning: '고요한, 평온한',
        sentence: 'The lake was serene at sunrise.',
        imageUrl: 'https://images.unsplash.com/photo-1470071131384-001b85755b36?w=600&q=80'
    },
    {
        id: 2,
        word: 'Vibrant',
        meaning: '활기찬, 생동감 있는',
        sentence: 'She wore a vibrant red dress.',
        imageUrl: 'https://images.unsplash.com/photo-1533228876829-65c94e7b502e?w=600&q=80'
    },
    {
        id: 3,
        word: 'Resilient',
        meaning: '회복력 있는, 탄력 있는',
        sentence: 'Children are often remarkably resilient.',
        imageUrl: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=600&q=80'
    },
    {
        id: 4,
        word: 'Luminous',
        meaning: '빛나는, 반짝이는',
        sentence: 'The moon was luminous in the dark sky.',
        imageUrl: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=600&q=80'
    },
    {
        id: 5,
        word: 'Euphoria',
        meaning: '극도의 환희, 희열',
        sentence: 'They were in a state of euphoria after winning.',
        imageUrl: 'https://images.unsplash.com/photo-1518607153673-aee8ebef15b9?w=600&q=80'
    }
];

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

            <header className="header">
                <div className="title-wrapper">
                    <h1>Daily Snap</h1>
                    <p className="subtitle-ko">매일매일 재미있는 영어 습관</p>
                </div>
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
                            <div className="section-header">
                                <h2 className="section-title">Word of the Day</h2>
                                <p className="section-desc-ko">카드를 클릭해 발음을 듣고 뒷면의 예문을 확인해보세요!</p>
                            </div>
                            <div className="word-cards-container">
                                {DAILY_WORDS.map((word) => (
                                    <WordCard key={word.id} wordData={word} />
                                ))}
                            </div>
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
