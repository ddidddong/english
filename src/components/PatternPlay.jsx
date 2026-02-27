import { useState } from 'react';
import './PatternPlay.css';

const PATTERNS = [
    {
        id: 1,
        prefix: 'I like',
        suffix: '.',
        options: ['apple', 'banana', 'reading', 'soccer']
    },
    {
        id: 2,
        prefix: 'I have',
        suffix: '.',
        options: ['a pen', 'two cats', 'a dream', 'no idea']
    },
    {
        id: 3,
        prefix: 'She is',
        suffix: 'today.',
        options: ['happy', 'busy', 'learning', 'here']
    }
];

export default function PatternPlay() {
    const [currentPatternIndex, setCurrentPatternIndex] = useState(0);
    const [selectedWord, setSelectedWord] = useState(null);

    const pattern = PATTERNS[currentPatternIndex];

    const handleWordSelect = (word) => {
        setSelectedWord(word);

        // Read the complete sentence
        const completeSentence = `${pattern.prefix} ${word}${pattern.suffix}`;
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
            <div className="pattern-sentence">
                <span className="static-text">{pattern.prefix}</span>
                <span className={`blank-spot ${selectedWord ? 'filled' : ''}`}>
                    {selectedWord || '[ ___ ]'}
                </span>
                <span className="static-text">{pattern.suffix}</span>
            </div>

            <div className="options-grid">
                {pattern.options.map((word, idx) => (
                    <button
                        key={idx}
                        className={`option-btn ${selectedWord === word ? 'selected' : ''}`}
                        onClick={() => handleWordSelect(word)}
                    >
                        {word}
                    </button>
                ))}
            </div>

            <button className="next-pattern-btn" onClick={nextPattern}>
                Next Pattern ➔
            </button>
        </div>
    );
}
