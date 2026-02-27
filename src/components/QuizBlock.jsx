import { useState, useEffect } from 'react';
import './QuizBlock.css';

const SENTENCE = "I have a green apple .";

export default function QuizBlock() {
    const [targetSentence, setTargetSentence] = useState(SENTENCE.split(' '));
    const [shuffledBlocks, setShuffledBlocks] = useState([]);
    const [selectedBlocks, setSelectedBlocks] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        // Shuffle only once on mount
        const shuffled = [...targetSentence].sort(() => Math.random() - 0.5);
        setShuffledBlocks(shuffled);
    }, [targetSentence]);

    const handleBlockClick = (block, index) => {
        // Prevent clicking same block
        if (selectedBlocks.some(b => b.index === index)) return;

        setIsError(false);
        const newSelected = [...selectedBlocks, { text: block, index }];
        setSelectedBlocks(newSelected);

        // Validate if finished
        if (newSelected.length === targetSentence.length) {
            const isCorrect = newSelected.map(b => b.text).join(' ') === targetSentence.join(' ');

            if (isCorrect) {
                setIsSuccess(true);
                if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    const utterance = new SpeechSynthesisUtterance("Great job!");
                    utterance.pitch = 1.2;
                    utterance.rate = 1.1;
                    window.speechSynthesis.speak(utterance);
                }
            } else {
                setIsError(true);
                setTimeout(() => {
                    setSelectedBlocks([]);
                    setIsError(false);
                }, 1000); // Reset after 1s
            }
        }
    };

    const handleReset = () => {
        setSelectedBlocks([]);
        setIsSuccess(false);
        setIsError(false);
    };

    return (
        <div className="quiz-container">
            <div className={`character-container ${isSuccess ? 'dance-animation' : ''}`}>
                <div className="character">🐶</div>
                {isSuccess && <div className="success-bubble">Great!</div>}
            </div>

            <div className="building-area">
                {selectedBlocks.map((b, i) => (
                    <span key={i} className={`built-block ${isError ? 'error-shake' : ''} ${isSuccess ? 'success' : ''}`}>
                        {b.text}
                    </span>
                ))}
                {Array.from({ length: targetSentence.length - selectedBlocks.length }).map((_, i) => (
                    <span key={`empty-${i}`} className="empty-slot" />
                ))}
            </div>

            {!isSuccess && (
                <div className="scattered-blocks">
                    {shuffledBlocks.map((block, idx) => {
                        const isSelected = selectedBlocks.some(b => b.index === idx);
                        return (
                            <button
                                key={idx}
                                className={`puzzle-block ${isSelected ? 'hidden' : ''}`}
                                onClick={() => handleBlockClick(block, idx)}
                            >
                                {block}
                            </button>
                        )
                    })}
                </div>
            )}

            {isSuccess && (
                <button className="reset-btn" onClick={handleReset}>Play Again ↻</button>
            )}
        </div>
    );
}
