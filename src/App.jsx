import { useState, useEffect } from 'react';
import WordCard from './components/WordCard';
import PatternPlay from './components/PatternPlay';
import QuizBlock from './components/QuizBlock';
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
            <header className="header">
                <h1>Daily Snap</h1>
                <div className="day-streak">
                    🔥 {streak} Day{streak !== 1 ? 's' : ''}
                </div>
            </header>

            <main className="main-content">
                <section className="word-section">
                    <h2 className="section-title">Word of the Day</h2>
                    <div className="word-cards-container">
                        {DAILY_WORDS.map((word) => (
                            <WordCard key={word.id} wordData={word} />
                        ))}
                    </div>
                </section>

                <section className="pattern-section">
                    <h2 className="section-title">Pattern Play</h2>
                    <PatternPlay />
                </section>

                <section className="quiz-section">
                    <h2 className="section-title">Sentence Quiz</h2>
                    <QuizBlock />
                </section>
            </main>
        </div>
    )
}

export default App
