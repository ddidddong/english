import { useState } from 'react';

export default function WordCard({ wordData }) {
    const [flipped, setFlipped] = useState(false);

    const handleSpeak = (e, text) => {
        e.stopPropagation(); // Prevent flipping if we just want to hear it
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.9; // Slightly slower for clarity
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleFlip = () => {
        setFlipped(!flipped);
        if (!flipped) {
            // Play sound on flip to back
            handleSpeak({ stopPropagation: () => { } }, wordData.word);
        }
    };

    return (
        <div className={`word-card-container ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
            <div className="word-card-inner">
                {/* Front Side */}
                <div className="word-card-front">
                    <div className="card-content-front">
                        <h2 className="word-title">{wordData.word}</h2>
                        <p className="word-meaning">{wordData.meaning}</p>
                        <button className="speak-btn" onClick={(e) => handleSpeak(e, wordData.word)}>
                            <span className="icon">🔊</span> Listen
                        </button>
                    </div>
                </div>

                {/* Back Side */}
                <div className="word-card-back">
                    <div className="card-image-bg" style={{ backgroundImage: `url(${wordData.imageUrl})` }}>
                        <div className="card-overlay">
                            <h3 className="word-title-small">{wordData.word}</h3>
                            <p className="word-sentence">"{wordData.sentence}"</p>
                            <button className="speak-btn-back" onClick={(e) => handleSpeak(e, wordData.sentence)}>
                                <span className="icon">🔊</span> Read Sentence
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
