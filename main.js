// ===========================
// Application State & Configuration
// ===========================

const APP_CONFIG = {
    startDate: new Date('2026-02-10'),
    endDate: new Date('2026-02-14'),
    totalDays: 5,
    devMode: false // Developer mode for testing
};

const APP_STATE = {
    currentDay: 1,
    userResponse: [], // Changed to array for multiple choices
    visitedDays: []
};

// ===========================
// Notification System
// ===========================
class NotificationSystem {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `notification-toast ${type}`;

        const iconMap = {
            success: '✅',
            info: 'ℹ️',
            warning: '⚠️',
            error: '❌',
            love: '❤️',
            reminder: '⏰'
        };

        const icon = iconMap[type] || iconMap.info;

        toast.innerHTML = `
            <span class="notification-icon">${icon}</span>
            <span class="notification-message">${message}</span>
        `;

        // Click to dismiss
        toast.addEventListener('click', () => {
            this.dismiss(toast);
        });

        this.container.appendChild(toast);

        // Auto dismiss
        setTimeout(() => {
            this.dismiss(toast);
        }, duration);
    }

    dismiss(toast) {
        if (toast.classList.contains('closing')) return;

        toast.classList.add('closing');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }

    // System Notification methods
    async requestPermission() {
        if (!('Notification' in window)) {
            console.log('This browser does not support desktop notification');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return false;
    }

    showSystem(title, body, icon = '❤️') {
        if (Notification.permission === 'granted') {
            new Notification(title, {
                body: body,
                icon: 'assets/Photo/photo1.jpg', // Using an existing image as icon
                badge: 'assets/Photo/photo1.jpg',
                silent: false
            });
        }
    }
}

const notifications = new NotificationSystem();

// ===========================
// Day Content Data
// ===========================

const DAY_CONTENT = {
    1: {
        theme: "Le point de départ",
        message: `Aujourd'hui, je commence quelque chose juste pour toi.
Rien d'imposé, rien de compliqué.
Juste un petit message chaque jour, jusqu'au 14 février.`,
        type: 'message',
        buttonText: 'Continuer demain'
    },
    2: {
        theme: "La complicité",
        message: "Quand tu es avec moi, qu'est-ce que tu ressens le plus souvent ?",
        type: 'interactive',
        choices: [
            { id: 'tranquillite', text: 'La tranquillité', emoji: '🕊️' },
            { id: 'joie', text: 'La joie', emoji: '😊' },
            { id: 'securite', text: 'La sécurité', emoji: '🛡️' },
            { id: 'liberte', text: 'La liberté d\'être moi-même', emoji: '🦋' },
            { id: 'bonheur', text: 'Le bonheur simple', emoji: '✨' },
            { id: 'amour', text: 'L\'amour', emoji: '❤️' }
        ]
    },
    3: {
        theme: "L'importance",
        message: `Certains passent, d’autres restent.
Toi, tu es de ceux qui comptent,
sans faire de bruit, mais pour toujours.`,
        type: 'message',
        buttonText: 'Merci ❤️'
    },
    4: {
        theme: "L'attente",
        message: `Demain, ce sera le 14 février.
Mais ce que je voulais te dire…
je n'avais pas envie de le dire à la légère.`,
        type: 'countdown',
        buttonText: 'À demain...'
    },
    5: {
        theme: "Le point culminant",
        message: `Ces cinq jours, ce n'était pas juste des messages.
C'était ma façon de te montrer, jour après jour,
que tu comptes vraiment pour moi.

Aujourd'hui, je ne célèbre pas la Saint-Valentin.
Je te célèbre, toi.
Et je suis heureux de t'avoir dans ma vie. ❤️`,
        type: 'final',
        buttonText: 'Revoir tout depuis le début'
    }
};

// ===========================
// Utility Functions
// ===========================

function getCurrentDay() {
    const now = new Date();
    const diffTime = now - APP_CONFIG.startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 0; // Before start date
    if (diffDays >= APP_CONFIG.totalDays) return APP_CONFIG.totalDays; // After end date
    return diffDays + 1; // Current day (1-5)
}

function saveState() {
    localStorage.setItem('romanceAppState', JSON.stringify(APP_STATE));
}

function loadState() {
    const saved = localStorage.getItem('romanceAppState');
    if (saved) {
        const parsedState = JSON.parse(saved);
        // Migration for legacy single response
        if (parsedState.userResponse && !Array.isArray(parsedState.userResponse)) {
            APP_STATE.userResponse = [parsedState.userResponse];
        } else {
            APP_STATE.userResponse = parsedState.userResponse || [];
        }
        APP_STATE.visitedDays = parsedState.visitedDays || [];
    }
}

function markDayVisited(day) {
    if (!APP_STATE.visitedDays.includes(day)) {
        APP_STATE.visitedDays.push(day);
        saveState();
    }
}

// ===========================
// Visual Effects Functions
// ===========================

function typewriterEffect(element, text, speed = 30) {
    element.textContent = '';
    element.style.whiteSpace = 'pre-wrap';
    let i = 0;

    const timer = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);
}

function createHeartExplosion(x, y) {
    const hearts = ['❤️', '💕', '💖', '💗', '💓', '💝'];
    const count = 8;

    for (let i = 0; i < count; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-particle';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';

        // Random direction
        const angle = (Math.PI * 2 * i) / count;
        const distance = 50 + Math.random() * 50;
        heart.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
        heart.style.setProperty('--ty', Math.sin(angle) * distance + 'px');

        document.body.appendChild(heart);

        setTimeout(() => heart.remove(), 1500);
    }
}

// ===========================
// Developer Mode
// ===========================

function toggleDevMode() {
    APP_CONFIG.devMode = !APP_CONFIG.devMode;

    if (APP_CONFIG.devMode) {
        console.log('🔧 Developer Mode ACTIVATED');
        notifications.show('Mode Développeur Activé', 'warning');
        showDevModeUI();
    } else {
        console.log('🔧 Developer Mode DEACTIVATED');
        notifications.show('Mode Développeur Désactivé', 'info');
        hideDevModeUI();
    }

    renderNavigation();
}

function showDevModeUI() {
    const devPanel = document.createElement('div');
    devPanel.id = 'dev-panel';
    devPanel.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.9);
        color: #fff;
        padding: 15px;
        border-radius: 12px;
        border: 2px solid var(--primary-pink);
        z-index: 10000;
        font-size: 0.9rem;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    `;

    devPanel.innerHTML = `
        <div style="margin-bottom: 10px; font-weight: 600; color: var(--primary-pink);">🔧 Mode Développeur</div>
        <button onclick="localStorage.clear(); location.reload();" style="
            background: var(--primary-red);
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.85rem;
            margin-right: 5px;
        ">Reset Data</button>
        <button onclick="toggleDevMode();" style="
            background: var(--deep-red);
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.85rem;
        ">Désactiver</button>
    `;

    document.body.appendChild(devPanel);
}

function hideDevModeUI() {
    const devPanel = document.getElementById('dev-panel');
    if (devPanel) devPanel.remove();
}

// Keyboard shortcut: Ctrl+Shift+D
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        toggleDevMode();
    }
});

// ===========================
// Easter Egg - Secret Message
// ===========================

let titleClickCount = 0;
let titleClickTimer = null;

function activateEasterEgg() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'easter-egg-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 99999;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.5s ease;
        cursor: pointer;
    `;

    const secretMessage = document.createElement('div');
    secretMessage.style.cssText = `
        text-align: center;
        padding: 3rem;
        max-width: 600px;
        animation: fadeInUp 1s ease;
    `;

    secretMessage.innerHTML = `
        <div style="font-size: 4rem; margin-bottom: 2rem; animation: heartbeat 2s ease-in-out infinite;">
            💝
        </div>
        <h2 style="
            font-family: var(--font-display);
            font-size: 2rem;
            background: var(--valentine-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 1.5rem;
        ">Message Secret Découvert !</h2>
        <p style="
            font-family: var(--font-body);
            font-size: 1.2rem;
            line-height: 1.8;
            color: var(--text-secondary);
            margin-bottom: 2rem;
        ">
            Tu as trouvé le message caché... 🎉<br><br>
            Chaque moment avec toi est un trésor,<br>
            chaque jour une nouvelle découverte,<br>
            et chaque sourire que tu m'offres<br>
            est un cadeau que je chéris. ❤️
        </p>
        <p style="
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.5);
            font-style: italic;
        ">Clique n'importe où pour fermer</p>
    `;

    overlay.appendChild(secretMessage);
    document.body.appendChild(overlay);

    // Create heart rain effect
    for (let i = 0; i < 20; i++) { // Reduced from 30 to 20 for better performance
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = ['❤️', '💕', '💖', '💗', '💓', '💝'][Math.floor(Math.random() * 6)];
            heart.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}%;
                top: -50px;
                font-size: ${1 + Math.random() * 2}rem;
                pointer-events: none;
                z-index: 100000;
                animation: heartRain ${3 + Math.random() * 2}s linear forwards;
            `;
            overlay.appendChild(heart);
            setTimeout(() => heart.remove(), 5000);
        }, i * 100);
    }

    // Close on click
    overlay.addEventListener('click', () => {
        overlay.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => overlay.remove(), 500);
    });
}

// Add click counter to title
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const title = document.querySelector('.app-title');
        if (title) {
            title.style.cursor = 'pointer';
            title.addEventListener('click', () => {
                titleClickCount++;

                // Reset counter after 2 seconds of inactivity
                clearTimeout(titleClickTimer);
                titleClickTimer = setTimeout(() => {
                    titleClickCount = 0;
                }, 2000);

                // Activate easter egg after 5 clicks
                if (titleClickCount === 5) {
                    titleClickCount = 0;
                    activateEasterEgg();
                }
            });
        }
    }, 2000); // Wait for app to load
});

// ===========================
// UI Rendering Functions
// ===========================

function createFloatingHearts() {
    const container = document.getElementById('hearts-background');
    const heartCount = 8; // Reduced from 15 for better performance

    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = '❤️';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.animationDelay = `${Math.random() * 15}s`;
        heart.style.animationDuration = `${15 + Math.random() * 10}s`;
        container.appendChild(heart);
    }
}

function renderNavigation() {
    const nav = document.getElementById('navigation');
    nav.innerHTML = '';

    const maxAccessibleDay = APP_CONFIG.devMode ? APP_CONFIG.totalDays : getCurrentDay();

    for (let i = 1; i <= APP_CONFIG.totalDays; i++) {
        const dot = document.createElement('div');
        dot.className = 'nav-dot';

        if (i === APP_STATE.currentDay) {
            dot.classList.add('active');
        }

        if (i > maxAccessibleDay) {
            dot.classList.add('locked');
            dot.title = 'Pas encore disponible';
        } else {
            dot.title = `Jour ${i}`;
            dot.title = `Jour ${i}`;
            dot.addEventListener('click', () => {
                if (APP_STATE.currentDay !== i) {
                    APP_STATE.currentDay = i;
                    transitionToDay(i);
                    renderNavigation();
                }
            });
        }

        nav.appendChild(dot);
    }
}

function renderDateIndicator() {
    const indicator = document.getElementById('date-indicator');
    const dates = [
        '10 février 2026',
        '11 février 2026',
        '12 février 2026',
        '13 février 2026',
        '14 février 2026 - Saint-Valentin'
    ];
    indicator.textContent = dates[APP_STATE.currentDay - 1] || '';
}

function renderDay(dayNumber) {
    const content = document.getElementById('content-area');
    const dayData = DAY_CONTENT[dayNumber];

    if (!dayData) return;

    markDayVisited(dayNumber);
    renderDateIndicator();

    let html = `
        <div class="day-card">
            <div class="day-number">Jour ${dayNumber}</div>
            <h2 class="day-theme">${dayData.theme}</h2>
            <p class="day-message">${dayData.message}</p>
    `;

    switch (dayData.type) {
        case 'message':
            html += `<button class="primary-btn" onclick="handleContinue()">${dayData.buttonText}</button>`;
            break;

        case 'interactive':
            html += '<div class="choice-buttons">';
            dayData.choices.forEach((choice, index) => {
                const isSelected = Array.isArray(APP_STATE.userResponse) && APP_STATE.userResponse.includes(choice.id);
                const selectedClass = isSelected ? 'selected' : '';
                // Add staggered animation delay
                const delayClass = `stagger-delay-${index + 1}`;
                html += `
                    <button id="choice-${choice.id}" class="choice-btn ${selectedClass} fade-in ${delayClass}" style="opacity: 0; animation-fill-mode: forwards;" onclick="handleChoice('${choice.id}')">
                        ${choice.emoji} ${choice.text}
                    </button>
                `;
            });
            html += '</div>';

            // Validation button (initially hidden if no selection)
            const hasSelection = Array.isArray(APP_STATE.userResponse) && APP_STATE.userResponse.length > 0;
            const btnStyle = hasSelection ? '' : 'display: none;';

            html += `
                <div id="validate-container" style="text-align: center; margin-top: 2rem; ${btnStyle}">
                    <button class="primary-btn fade-in" onclick="submitChoices()">
                        Valider mes choix ❤️
                    </button>
                </div>
            `;
            break;

        case 'countdown':
            html += renderCountdown();
            html += `<button class="primary-btn mt-lg" onclick="handleContinue()">${dayData.buttonText}</button>`;
            break;

        case 'quiz':
            html += renderQuiz(dayData);
            break;

        case 'final':
            html += renderFinalDay();
            break;
    }

    html += '</div>';
    content.innerHTML = html;

    // Add typewriter effect to message
    setTimeout(() => {
        const card = content.querySelector('.day-card');
        card.classList.add('fade-in');

        const messageEl = content.querySelector('.day-message');
        if (messageEl && dayData.type !== 'countdown') {
            const originalText = messageEl.textContent;
            typewriterEffect(messageEl, originalText, 15);
        }
    }, 50);
}

function transitionToDay(dayNumber) {
    const content = document.getElementById('content-area');
    const oldCard = content.querySelector('.day-card');

    if (oldCard) {
        // Exit animation
        oldCard.classList.remove('fade-in');
        oldCard.classList.add('fade-out-up');

        // Wait for animation to finish before rendering new content
        setTimeout(() => {
            renderDay(dayNumber);
            // Scroll to top of content area to ensure visibility
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 400); // Matches fadeOutUp duration
    } else {
        // First render
        renderDay(dayNumber);
    }
}

function renderCountdown() {
    const valentinesDay = new Date('2026-02-14T00:00:00');

    function updateCountdown() {
        const now = new Date();
        const diff = valentinesDay - now;

        if (diff <= 0) {
            return '<div class="countdown-container"><p class="day-message">C\'est aujourd\'hui ! ❤️</p></div>';
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return `
            <div class="countdown-container">
                <div class="countdown-timer">
                    <div class="countdown-item">
                        <div class="countdown-value">${hours}</div>
                        <div class="countdown-label">Heures</div>
                    </div>
                    <div class="countdown-item">
                        <div class="countdown-value">${minutes}</div>
                        <div class="countdown-label">Minutes</div>
                    </div>
                    <div class="countdown-item">
                        <div class="countdown-value">${seconds}</div>
                        <div class="countdown-label">Secondes</div>
                    </div>
                </div>
            </div>
        `;
    }

    // Initial render
    const countdownHtml = updateCountdown();

    // Update every second
    setInterval(() => {
        const container = document.querySelector('.countdown-container');
        if (container) {
            container.outerHTML = updateCountdown();
        }
    }, 1000);

    return countdownHtml;
}

function renderFinalDay() {
    let html = '<div class="final-message">';

    // Show user's response from Day 2 if available
    if (APP_STATE.userResponse && APP_STATE.userResponse.length > 0) {
        const responseText = {
            'tranquillite': 'la tranquillité',
            'joie': 'la joie',
            'securite': 'la sécurité',
            'liberte': 'la liberté d\'être toi-même',
            'bonheur': 'le bonheur simple',
            'amour': 'l\'amour'
        };

        const selectedTexts = APP_STATE.userResponse.map(id => responseText[id]).filter(Boolean);

        let formattedText = '';
        if (selectedTexts.length === 1) {
            formattedText = selectedTexts[0];
        } else if (selectedTexts.length > 1) {
            const last = selectedTexts.pop();
            formattedText = selectedTexts.join(', ') + ' et ' + last;
        }

        html += `
            <p class="day-message" style="font-size: 1rem; opacity: 0.8; margin-bottom: 2rem;">
                je suis heureux que tu ressentes ${formattedText} quand tu es avec moi. ❤️
            </p>
        `;
    }

    html += `
        <div class="final-heart">❤️</div>
        <button class="review-btn" onclick="reviewAllDays()">
            ${DAY_CONTENT[5].buttonText}
        </button>
    `;

    html += '</div>';
    return html;
}

// ===========================
// Quiz Game Functions
// ===========================

let quizState = {
    currentQuestion: 0,
    score: 0,
    answers: []
};

function renderQuiz(dayData) {
    if (!dayData.questions || quizState.currentQuestion >= dayData.questions.length) {
        return renderQuizResults(dayData);
    }

    const question = dayData.questions[quizState.currentQuestion];
    const progress = ((quizState.currentQuestion) / dayData.questions.length) * 100;

    let html = `
        <div class="quiz-container">
            <div class="quiz-progress">
                <div class="quiz-progress-bar" style="width: ${progress}%"></div>
            </div>
            <div class="quiz-question-number">Question ${quizState.currentQuestion + 1}/${dayData.questions.length}</div>
            <div class="quiz-emoji">${question.emoji}</div>
            <h3 class="quiz-question">${question.question}</h3>
            <div class="quiz-options">
    `;

    question.options.forEach((option, index) => {
        html += `
            <button class="quiz-option" onclick="handleQuizAnswer(${index})">
                ${option}
            </button>
        `;
    });

    html += `
            </div>
        </div>
    `;

    return html;
}

function handleQuizAnswer(answerIndex) {
    const dayData = DAY_CONTENT[3];
    const question = dayData.questions[quizState.currentQuestion];

    // Save answer
    quizState.answers.push(answerIndex);

    // Check if correct
    if (answerIndex === question.correct) {
        quizState.score++;
    }

    // Move to next question
    quizState.currentQuestion++;

    // Re-render
    renderDay(3);
}

function renderQuizResults(dayData) {
    const percentage = (quizState.score / dayData.questions.length) * 100;
    let message, emoji;

    if (percentage === 100) {
        emoji = "🏆";
        message = "Parfait ! Tu me connais par cœur ! On est vraiment connectés. ❤️";
    } else if (percentage >= 80) {
        emoji = "⭐";
        message = "Excellent ! Tu me connais vraiment bien. C'est beau de voir à quel point on se comprend. 💕";
    } else if (percentage >= 60) {
        emoji = "😊";
        message = "Pas mal ! On apprend encore à se découvrir, et c'est ce qui rend tout ça magique. ✨";
    } else {
        emoji = "💖";
        message = "On a encore plein de choses à découvrir l'un sur l'autre, et j'adore ça ! 🌟";
    }

    let html = `
        <div class="quiz-results">
            <div class="quiz-result-emoji">${emoji}</div>
            <h3 class="quiz-result-title">Résultat : ${quizState.score}/${dayData.questions.length}</h3>
            <div class="quiz-result-bar">
                <div class="quiz-result-fill" style="width: ${percentage}%"></div>
            </div>
            <p class="quiz-result-message">${message}</p>
            <button class="primary-btn" onclick="finishQuiz()">Continuer ❤️</button>
        </div>
    `;

    return html;
}

function finishQuiz() {
    // Reset quiz state for next time
    quizState = {
        currentQuestion: 0,
        score: 0,
        answers: []
    };
    handleContinue();
}

// ===========================
// Photo Gallery (Hidden Feature)
// ===========================

function showPhotoGallery() {
    // Prevent multiple overlays
    if (document.getElementById('gallery-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'gallery-overlay';
    overlay.className = 'gallery-overlay';

    // Lock body scroll
    document.body.style.overflow = 'hidden';
    notifications.show('Galerie de souvenirs ouverte 📸', 'info');

    const photos = [
        'photo1.jpg',
        'photo2.jpg',
        'photo3.jpg',
        'photo4.jpg',
        'photo5.jpg'
    ];

    let photosHtml = '';
    photos.forEach((photo, index) => {
        photosHtml += `
            <div class="photo-item" style="animation: fadeInUp 0.5s ease ${index * 0.1}s forwards; opacity: 0; transform: translateY(20px);">
                <img src="assets/Photo/${photo}" alt="Souvenir ${index + 1}" loading="lazy">
            </div>
        `;
    });

    overlay.innerHTML = `
        <button class="gallery-close-btn" onclick="closePhotoGallery()">×</button>
        <div class="gallery-container">
            <div class="gallery-header">
                <h2 class="gallery-title">Nos Souvenirs 📸</h2>
                <p class="gallery-subtitle">
                    Chaque moment avec toi est précieux ❤️
                </p>
            </div>

            <div class="photo-grid">
                ${photosHtml}
            </div>

            <div class="gallery-footer">
                <button class="review-btn" onclick="closePhotoGallery()">
                    Fermer la galerie
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
}

function closePhotoGallery() {
    const overlay = document.getElementById('gallery-overlay');
    if (overlay) {
        overlay.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            overlay.remove();
            document.body.style.overflow = '';
            // Remove escape listener
            // Note: This won't work perfectly because handleEscape is local scope. 
            // Ideally we'd name the function or attach it to the element.
            // But for this simple app, it's okay, or we can improve it.
        }, 300);
    }
}

// Add keyboard shortcut for gallery: Ctrl+Shift+G
document.addEventListener('keydown', (e) => {
    // Check if gallery is open and Escape is pressed (handled in showPhotoGallery but good to have backup or centralized)
    if (e.key === 'Escape') {
        closePhotoGallery();
    }

    if (e.ctrlKey && e.shiftKey && e.key === 'G') {
        e.preventDefault();
        showPhotoGallery();
    }
});

// ===========================
// Event Handlers
// ===========================

function handleChoice(choiceId) {
    // Initialize if null (legacy)
    if (!APP_STATE.userResponse) APP_STATE.userResponse = [];

    // Toggle selection
    const index = APP_STATE.userResponse.indexOf(choiceId);
    if (index > -1) {
        APP_STATE.userResponse.splice(index, 1);
        // Visual update
        document.getElementById(`choice-${choiceId}`).classList.remove('selected');
    } else {
        APP_STATE.userResponse.push(choiceId);
        // Visual update
        const btn = document.getElementById(`choice-${choiceId}`);
        btn.classList.add('selected');
        btn.classList.add('btn-clicked');

        // Heart explosion effect for selection
        const rect = btn.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        createHeartExplosion(x, y);
    }

    saveState();

    // Show/Hide Validate Button
    const validateContainer = document.getElementById('validate-container');
    if (APP_STATE.userResponse.length > 0) {
        validateContainer.style.display = 'block';
    } else {
        validateContainer.style.display = 'none';
    }
}

function submitChoices() {
    notifications.show('Réponses sauvegardées avec amour', 'love');

    // Show confirmation message
    const card = document.querySelector('.day-card');

    // Hide choices and button to prevent changes (optional, but cleaner)
    document.querySelector('.choice-buttons').style.pointerEvents = 'none';
    document.getElementById('validate-container').style.display = 'none';

    const confirmMsg = document.createElement('p');
    confirmMsg.className = 'day-message fade-in';
    confirmMsg.style.marginTop = '2rem';
    confirmMsg.textContent = 'Merci pour tes réponses. Elles comptent beaucoup pour moi. ❤️';
    card.appendChild(confirmMsg);

    // Add continue button
    const continueBtn = document.createElement('button');
    continueBtn.className = 'primary-btn mt-lg';
    continueBtn.textContent = 'Continuer demain';
    continueBtn.onclick = handleContinue;
    card.appendChild(continueBtn);
}

function handleContinue() {
    const maxDay = APP_CONFIG.devMode ? APP_CONFIG.totalDays : getCurrentDay();
    const nextDay = APP_STATE.currentDay + 1;

    if (nextDay <= maxDay && nextDay <= APP_CONFIG.totalDays) {
        APP_STATE.currentDay = nextDay;
        transitionToDay(nextDay);
        renderNavigation();
    } else if (nextDay > APP_CONFIG.totalDays) {
        // Already at the end
        return;
    } else {
        // Next day not yet available
        showComingSoonMessage();
    }
}

function showComingSoonMessage() {
    const content = document.getElementById('content-area');
    const nextDayDate = new Date(APP_CONFIG.startDate);
    nextDayDate.setDate(nextDayDate.getDate() + APP_STATE.currentDay);

    content.innerHTML = `
        <div class="day-card text-center">
            <div class="final-heart" style="font-size: 3rem;">⏰</div>
            <h2 class="day-theme">À demain...</h2>
            <p class="day-message">
                Le prochain message sera disponible demain.
                Reviens me voir ! ❤️
            </p>
            <button class="review-btn" onclick="reviewAllDays()">
                Revoir les jours précédents
            </button>
            <button class="review-btn" onclick="handleNotifyMe()" style="margin-top: 10px; font-size: 0.9rem; opacity: 0.8;">
                🔔 M'avertir pour la suite
            </button>
        </div>
    `;

    // Trigger reminder notification (in-app)
    setTimeout(() => {
        notifications.show('Rappel : Reviens demain pour la suite ! ⏰', 'reminder', 5000);
    }, 1000);
}

function handleNotifyMe() {
    notifications.requestPermission().then(granted => {
        if (granted) {
            notifications.show('Notifications activées ! Tu seras prévenu. ✅', 'success');
            setTimeout(() => {
                notifications.showSystem('Rappel activé 🔔', 'Tu recevras une notification quand la suite sera disponible !');
            }, 1000);
        } else {
            notifications.show('Notifications refusées. Tu ne recevras pas d\'alerte. ❌', 'error');
        }
    });
}

function reviewAllDays() {
    APP_STATE.currentDay = 1;
    renderDay(1);
    renderNavigation();
}

// ===========================
// Initialization
// ===========================

function init() {
    // Load saved state
    loadState();

    // Determine current day based on date
    const actualDay = getCurrentDay();

    if (actualDay === 0) {
        // Before start date
        document.getElementById('content-area').innerHTML = `
            <div class="day-card text-center">
                <div class="final-heart" style="font-size: 3rem;">🗓️</div>
                <h2 class="day-theme">Bientôt...</h2>
                <p class="day-message">
                    Cette expérience commence le 10 février 2026.
                    Reviens à cette date ! ❤️
                </p>
            </div>
        `;
    } else {
        // Set current day to the actual day (or last visited if reviewing)
        APP_STATE.currentDay = actualDay;
        renderDay(APP_STATE.currentDay);
    }

    // Render navigation
    renderNavigation();

    // Initialize Audio
    initAudio();

    // Create floating hearts
    createFloatingHearts();

    // Hide loading screen and show app
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('fade-out');
        document.getElementById('app').classList.remove('hidden');
    }, 1500);
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// ===========================
// Audio System
// ===========================

function initAudio() {
    const audio = document.getElementById('bg-music');
    const controlBtn = document.getElementById('music-control');

    if (!audio || !controlBtn) return;

    // Set initial volume
    audio.volume = 0.5;

    function updateIcon() {
        if (audio.paused) {
            controlBtn.textContent = '🔇';
            controlBtn.classList.remove('playing');
        } else {
            controlBtn.textContent = '🎵';
            controlBtn.classList.add('playing');
        }
    }

    // Manual Toggle
    controlBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().then(() => {
                updateIcon();
                notifications.show('Musique activée 🎵', 'info');
            }).catch(e => {
                console.error("Audio play failed:", e);
                notifications.show('Impossible de lire l\'audio', 'error');
            });
        } else {
            audio.pause();
            updateIcon();
            notifications.show('Musique en pause 🔇', 'info');
        }
    });

    // Aggressive Autoplay Logic
    const attemptPlay = () => {
        audio.play().then(() => {
            updateIcon();
            // Success! Remove all interaction listeners
            ['click', 'mousemove', 'keydown', 'touchstart', 'scroll'].forEach(event => {
                document.body.removeEventListener(event, attemptPlay);
            });
        }).catch(error => {
            // Autoplay prevented, waiting for interaction...
            updateIcon();
        });
    };

    // Try immediately
    attemptPlay();

    // Add listeners for ANY interaction to start music
    ['click', 'mousemove', 'keydown', 'touchstart', 'scroll'].forEach(event => {
        document.body.addEventListener(event, attemptPlay, { once: true });
    });
}
