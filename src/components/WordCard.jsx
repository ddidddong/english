import { useState } from 'react';

export default function WordCard({ wordData }) {
    const [flipped, setFlipped] = useState(false);

    const hasImage = !!wordData.imageUrl;
    const hasSentence = !!wordData.sentence;

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
                    <div
                        className="card-image-bg"
                        style={hasImage ? { backgroundImage: `url(${wordData.imageUrl})` } : {
                            background: 'linear-gradient(135deg, var(--secondary) 0%, #B5C18E 100%)'
                        }}
                    >
                        <div className="card-overlay" style={!hasImage ? { background: 'transparent', justifyContent: 'center' } : {}}>
                            <h3 className="word-title-small" style={!hasImage ? { fontSize: '2.5rem', marginBottom: '1.5rem', color: '#fff' } : {}}>
                                {wordData.word}
                            </h3>

                            {hasSentence ? (
                                <>
                                    <p className="word-sentence">"{wordData.sentence}"</p>
                                    <button className="speak-btn-back" onClick={(e) => handleSpeak(e, wordData.sentence)}>
                                        <span className="icon">🔊</span> Read Sentence
                                    </button>
                                </>
                            ) : (
                                <p className="word-sentence" style={{ fontSize: '1.5rem', fontStyle: 'normal', color: 'rgba(255,255,255,0.9)' }}>
                                    {wordData.meaning}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
