// game.js - Add this file and link it in your HTML

document.addEventListener('DOMContentLoaded', function() {
    // Game elements
    const scrambledWordEl = document.getElementById('scrambled-word');
    const wordInputEl = document.getElementById('word-input');
    const submitBtn = document.getElementById('submit-btn');
    const nextBtn = document.getElementById('next-btn');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const hintBtn = document.getElementById('hint-btn');
    const hintTextEl = document.getElementById('hint-text');
    const hintValueEl = document.getElementById('hint-value');
    const gameMessageEl = document.getElementById('game-message');
    const timerEl = document.getElementById('timer');
    const scoreEl = document.getElementById('score');
    const correctCountEl = document.getElementById('correct-count');
    const wrongCountEl = document.getElementById('wrong-count');
    const difficultyEl = document.getElementById('difficulty');
    
    // Audio elements
    const successSound = document.getElementById('success-sound');
    const errorSound = document.getElementById('error-sound');
    
    // Game state
    let currentWord = '';
    let scrambledWord = '';
    let score = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let timeLeft = 60;
    let timerInterval;
    let isGameActive = false;
    let words = {
        easy: ['play', 'game', 'word', 'time', 'hint', 'easy', 'work', 'fast', 'slow', 'home'],
        medium: ['scramble', 'puzzle', 'keyboard', 'player', 'challenge', 'difficulty', 'computer', 'solution'],
        hard: ['javascript', 'developer', 'algorithm', 'programming', 'application', 'dictionary', 'vocabulary']
    };
    
    // Initialize game
    function initGame() {
        // Reset game state
        score = 0;
        correctCount = 0;
        wrongCount = 0;
        timeLeft = parseInt(document.getElementById('time-limit').value) || 60;
        
        // Update UI
        scoreEl.textContent = score;
        correctCountEl.textContent = correctCount;
        wrongCountEl.textContent = wrongCount;
        timerEl.textContent = timeLeft;
        
        // Hide/show appropriate buttons
        submitBtn.style.display = 'inline-block';
        nextBtn.style.display = 'none';
        
        // Clear input and message
        wordInputEl.value = '';
        gameMessageEl.textContent = '';
        gameMessageEl.className = 'game-message';
        
        // Hide hint
        hintTextEl.classList.add('hidden');
        
        // Get a new word
        getNewWord();
        
        // Start timer
        startTimer();
        
        // Set game as active
        isGameActive = true;
        
        // Focus on input
        wordInputEl.focus();
    }
    
    // Get a new word based on difficulty
    function getNewWord() {
        const difficulty = difficultyEl.value;
        const wordList = words[difficulty];
        currentWord = wordList[Math.floor(Math.random() * wordList.length)];
        scrambledWord = scrambleWord(currentWord);
        scrambledWordEl.textContent = scrambledWord.toUpperCase();
        hintTextEl.classList.add('hidden');
    }
    
    // Scramble a word
    function scrambleWord(word) {
        const wordArray = word.split('');
        for (let i = wordArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
        }
        // Make sure the scrambled word is different from the original
        const scrambled = wordArray.join('');
        return scrambled === word ? scrambleWord(word) : scrambled;
    }
    
    // Start the timer
    function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(function() {
            timeLeft--;
            timerEl.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }
    
    // End the game
    function endGame() {
        clearInterval(timerInterval);
        isGameActive = false;
        
        // Disable inputs
        wordInputEl.disabled = true;
        submitBtn.disabled = true;
        
        // Show game over message
        gameMessageEl.textContent = `Game Over! Your final score is ${score}`;
        gameMessageEl.className = 'game-message game-over';
        
        // Update best scores
        updateBestScores();
        
        // Show reset button, hide submit and next
        submitBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    }
    
    // Check the answer
    function checkAnswer() {
        if (!isGameActive) return;
        
        const userAnswer = wordInputEl.value.trim().toLowerCase();
        
        if (userAnswer === currentWord) {
            // Correct answer
            gameMessageEl.textContent = 'Correct!';
            gameMessageEl.className = 'game-message correct';
            
            // Update score and stats
            score += calculateScore();
            correctCount++;
            scoreEl.textContent = score;
            correctCountEl.textContent = correctCount;
            
            // Play sound if enabled
            if (document.getElementById('sound-toggle').checked) {
                successSound.play();
            }
            
            // Show next button, hide submit
            submitBtn.style.display = 'none';
            nextBtn.style.display = 'inline-block';
            
            // Disable input
            wordInputEl.disabled = true;
        } else {
            // Wrong answer
            gameMessageEl.textContent = 'Try again!';
            gameMessageEl.className = 'game-message wrong';
            wrongCount++;
            wrongCountEl.textContent = wrongCount;
            
            // Play sound if enabled
            if (document.getElementById('sound-toggle').checked) {
                errorSound.play();
            }
        }
    }
    
    // Calculate score based on difficulty
    function calculateScore() {
        const difficulty = difficultyEl.value;
        const baseScore = 10;
        
        switch (difficulty) {
            case 'easy':
                return baseScore;
            case 'medium':
                return baseScore * 2;
            case 'hard':
                return baseScore * 3;
            default:
                return baseScore;
        }
    }
    
    // Update best scores
    function updateBestScores() {
        const difficulty = difficultyEl.value;
        const bestScoreEl = document.getElementById(`${difficulty}-best`);
        const currentBest = parseInt(bestScoreEl.textContent);
        
        if (score > currentBest) {
            bestScoreEl.textContent = score;
            // Save to localStorage
            localStorage.setItem(`${difficulty}-best`, score);
        }
    }
    
    // Load best scores from localStorage
    function loadBestScores() {
        const difficulties = ['easy', 'medium', 'hard'];
        
        difficulties.forEach(difficulty => {
            const bestScore = localStorage.getItem(`${difficulty}-best`) || 0;
            document.getElementById(`${difficulty}-best`).textContent = bestScore;
        });
    }
    
    // Show hint
    function showHint() {
        if (!isGameActive) return;
        
        // Penalty for using hint
        score = Math.max(0, score - 5);
        scoreEl.textContent = score;
        
        // Show first letter as hint
        hintValueEl.textContent = currentWord.charAt(0);
        hintTextEl.classList.remove('hidden');
    }
    
    // Event listeners
    startBtn.addEventListener('click', initGame);
    
    resetBtn.addEventListener('click', function() {
        clearInterval(timerInterval);
        wordInputEl.disabled = false;
        initGame();
    });
    
    submitBtn.addEventListener('click', checkAnswer);
    
    wordInputEl.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });
    
    nextBtn.addEventListener('click', function() {
        getNewWord();
        wordInputEl.value = '';
        wordInputEl.disabled = false;
        gameMessageEl.textContent = '';
        gameMessageEl.className = 'game-message';
        submitBtn.style.display = 'inline-block';
        nextBtn.style.display = 'none';
        wordInputEl.focus();
    });
    
    hintBtn.addEventListener('click', showHint);
    
    // Settings
    document.getElementById('time-limit').addEventListener('input', function() {
        document.getElementById('time-value').textContent = this.value;
    });
    
    // Settings modal
    const settingsModal = document.getElementById('settings-modal');
    const settingsLink = document.getElementById('settings-link');
    const closeBtn = document.querySelector('.close');
    const saveSettingsBtn = document.getElementById('save-settings');
    
    settingsLink.addEventListener('click', function() {
        settingsModal.style.display = 'block';
    });
    
    closeBtn.addEventListener('click', function() {
        settingsModal.style.display = 'none';
    });
    
    saveSettingsBtn.addEventListener('click', function() {
        // Save settings
        timeLeft = parseInt(document.getElementById('time-limit').value);
        timerEl.textContent = timeLeft;
        
        // Theme
        const theme = document.getElementById('theme-select').value;
        document.body.className = theme;
        
        // Close modal
        settingsModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });
    
    // Init
    loadBestScores();
    
    // Apply theme from settings if saved
    const savedTheme = localStorage.getItem('theme') || 'default';
    document.getElementById('theme-select').value = savedTheme;
    document.body.className = savedTheme;
});