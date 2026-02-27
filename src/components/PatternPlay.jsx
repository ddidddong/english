import { useState } from 'react';
import './PatternPlay.css';

const PATTERNS = [
    {
        id: 1,
        prefix: 'I like',
        suffix: '.',
        options: [
            { en: 'apples', ko: '사과' },
            { en: 'bananas', ko: '바나나' },
            { en: 'reading', ko: '독서' },
            { en: 'soccer', ko: '축구' }
        ],
        getTranslation: (koWord) => `나는 ${koWord ? `[${koWord}]` : '[ ___ ]'}(을)를 좋아해요.`
    },
    {
        id: 2,
        prefix: 'I have',
        suffix: '.',
        options: [
            { en: 'a pen', ko: '펜' },
            { en: 'two cats', ko: '고양이 두 마리' },
            { en: 'a dream', ko: '꿈' },
            { en: 'a question', ko: '질문' }
        ],
        getTranslation: (koWord) => `나는 ${koWord ? `[${koWord}]` : '[ ___ ]'}(이)가 있어요.`
    },
    {
        id: 3,
        prefix: 'She is',
        suffix: 'today.',
        options: [
            { en: 'happy', ko: '행복해' },
            { en: 'busy', ko: '바빠' },
            { en: 'learning', ko: '배우고 있어' },
            { en: 'here', ko: '여기에 있어' }
        ],
        getTranslation: (koWord) => `그녀는 오늘 ${koWord ? `[${koWord}]` : '[ ___ ]'}요.`
    }
];

export default function PatternPlay() {
    const [currentPatternIndex, setCurrentPatternIndex] = useState(0);
    const [selectedWord, setSelectedWord] = useState(null);

    const pattern = PATTERNS[currentPatternIndex];

    const handleWordSelect = (option) => {
        setSelectedWord(option);

        // Read the complete sentence
        const completeSentence = `${pattern.prefix} ${option.en}${pattern.suffix}`;
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Cancel any ongoing speech
            const utterance = new SpeechSynthesisUtterance(completeSentence);
            utterance.lang = 'en-US';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    };

    const nextPattern = () => {
        setCurrentPatternIndex((prev) => (prev + 1) % PATTERNS.length);
        setSelectedWord(null);
    };

    return (
        <div className="pattern-play-container">
            <div className="pattern-sentence-wrapper">
                <div className="pattern-sentence">
                    <span className="static-text">{pattern.prefix}</span>
                    <span className={`blank-spot ${selectedWord ? 'filled' : ''}`}>
                        {selectedWord ? selectedWord.en : '[ ___ ]'}
                    </span>
                    <span className="static-text">{pattern.suffix}</span>
                </div>
                <div className="pattern-translation">
                    {pattern.getTranslation(selectedWord?.ko)}
                </div>
            </div>

            <div className="options-grid">
                {pattern.options.map((opt, idx) => (
                    <button
                        key={idx}
                        className={`option-btn ${selectedWord?.en === opt.en ? 'selected' : ''}`}
                        onClick={() => handleWordSelect(opt)}
                    >
                        {opt.en}
                    </button>
                ))}
            </div>

            <button className="next-pattern-btn" onClick={nextPattern}>
                Next Pattern ➔
            </button>
        </div>
    );
}
