import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBJH5hH5KMu0_zgbeS3-n-7HpGkcP3SeF8",
    authDomain: "exam-65f1f.firebaseapp.com",
    databaseURL: "https://trail-d2061-default-rtdb.firebaseio.com",
    projectId: "trail-d2061",
    storageBucket: "trail-d2061.firebasestorage.app",
    messagingSenderId: "539626053328",
    appId: "1:539626053328:android:9d2400421cbd35876848d5"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// GLOBAL VARIABLES for Tracking Status
let userExpiryTimestamp = null;
let hasProRexenAccess = false;

// Default avatar and name (no popup)
const defaultGender = 'male';
const defaultName = 'User';

document.addEventListener('DOMContentLoaded', () => {
    
    let deviceId = localStorage.getItem('bunny_device_id');
    
    if (!deviceId) {
        const cookieMatch = document.cookie.match(/(^| )bunny_device_id=([^;]+)/);
        if (cookieMatch) {
            deviceId = cookieMatch[2];
        }
    }

    if(!deviceId) {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        deviceId = Array.from({length: 12}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        
        localStorage.setItem('bunny_device_id', deviceId);
        document.cookie = "bunny_device_id=" + deviceId + "; max-age=315360000; path=/";
    } else {
        localStorage.setItem('bunny_device_id', deviceId);
        document.cookie = "bunny_device_id=" + deviceId + "; max-age=315360000; path=/";
    }
    
    const deviceIdDisplay = document.getElementById('display-device-id');
    const profileDeviceId = document.getElementById('profile-device-id');
    const getSubBtn = document.getElementById('get-sub-btn');
    const landingPage = document.getElementById('landing-page');

    const headerAvatar = document.getElementById('header-avatar-img');
    const profileAvatar = document.getElementById('profile-avatar-img');
    const profileName = document.getElementById('profile-user-name');
    
    // Set default avatar (male style)
    const defaultAvatarUrl = `https://i.ibb.co/rRb31XQc/79dd11a9452a92a1accceec38a45e16a.jpg`;
    if(headerAvatar) headerAvatar.src = defaultAvatarUrl;
    if(profileAvatar) profileAvatar.src = defaultAvatarUrl;
    if(profileName) profileName.innerHTML = `Hello, ${defaultName} ${deviceId.substring(0,4)}`;

    deviceIdDisplay.innerText = deviceId;
    profileDeviceId.innerText = deviceId;

    const copyBtn = document.getElementById('copy-id-btn');
    if(copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(deviceId).then(() => {
                alert("Device ID Copied to Clipboard!\n\nID: " + deviceId);
            }).catch(err => {
                alert("Failed to copy! Your ID is: " + deviceId);
            });
        });
    }

    if(getSubBtn) {
        getSubBtn.addEventListener('click', () => {
            window.location.href = 'https://t.me/+kRVlNNeA6FRjNjQ1';
        });
    }

    const deviceRef = ref(db, 'approved_devices/' + deviceId);
    
    onValue(deviceRef, (snapshot) => {
        const data = snapshot.val();

        if (!data) {
            userExpiryTimestamp = null;
            hasProRexenAccess = false;
            deviceIdDisplay.innerHTML = `${deviceId} <span style='color: #F59E0B; font-size: 11px; margin-left: 5px;'></span>`;
            getSubBtn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="#FFFFFF"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/></svg> Get Subscription`;
            
            landingPage.style.display = 'flex';
            setTimeout(() => { landingPage.style.opacity = '1'; landingPage.style.transform = 'scale(1)'; }, 10);
        } else {
            if (data.status === 'active') {
                
                hasProRexenAccess = (data.pro_rexen_access === true || data.proRexen === true);

                if (data.expiry && Date.now() > data.expiry) {
                    userExpiryTimestamp = null;
                    deviceIdDisplay.innerHTML = `${deviceId} <span style='color: #EF4444; font-size: 11px; margin-left: 5px;'>(Expired)</span>`;
                    getSubBtn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="#FFFFFF"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/></svg> Subscription Expired - Renew`;
                    
                    landingPage.style.display = 'flex';
                    setTimeout(() => { landingPage.style.opacity = '1'; landingPage.style.transform = 'scale(1)'; }, 10);
                } else {
                    userExpiryTimestamp = data.expiry;
                    
                    deviceIdDisplay.innerHTML = `${deviceId} <span style='color: #10B981; font-size: 11px; margin-left: 5px;'></span>`;
                    getSubBtn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="#FFFFFF"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/></svg> Access Granted! Opening...`;
                    
                    setTimeout(() => {
                        landingPage.style.opacity = '0';
                        landingPage.style.transform = 'scale(0.95)';
                        setTimeout(() => { landingPage.style.display = 'none'; }, 400);
                    }, 5000);
                }
            } else {
                userExpiryTimestamp = null;
                hasProRexenAccess = false;
                deviceIdDisplay.innerHTML = `${deviceId} <span style='color: #F59E0B; font-size: 11px; margin-left: 5px;'>(Not Active)</span>`;
                getSubBtn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="#FFFFFF"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/></svg> Contact Admin to Activate`;
                
                landingPage.style.display = 'flex';
                setTimeout(() => { landingPage.style.opacity = '1'; landingPage.style.transform = 'scale(1)'; }, 10);
            }
        }
    });
});

let currentSelectedGameLink = null;

const navItems = document.querySelectorAll('.nav-item');
const viewSections = {
    'Home': document.getElementById('home-view'),
    'Games': document.getElementById('games-view'),
    'Profile': document.getElementById('profile-view')
};

function switchTab(tabName) {
    navItems.forEach(item => {
        if (item.getAttribute('data-target') === tabName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    Object.keys(viewSections).forEach(key => {
        if (key === tabName) {
            viewSections[key].classList.add('active');
        } else {
            viewSections[key].classList.remove('active');
        }
    });

    if (tabName === 'Games') {
        const noGameEl = document.getElementById('no-game-connected');
        const iframeEl = document.getElementById('game-iframe');
        
        if (currentSelectedGameLink) {
            noGameEl.style.display = 'none';
            iframeEl.style.display = 'block';
            if (iframeEl.src !== currentSelectedGameLink) {
                iframeEl.src = currentSelectedGameLink;
            }
        } else {
            noGameEl.style.display = 'flex';
            iframeEl.style.display = 'none';
        }
    }
}

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const tabName = item.getAttribute('data-target');
        switchTab(tabName);
    });
});

const infoModal = document.getElementById('info-modal-overlay');
const openInfoModalBtn = document.getElementById('open-info-modal');
const closeInfoModalBtn = document.getElementById('close-info-modal');

if(openInfoModalBtn && infoModal && closeInfoModalBtn) {
    openInfoModalBtn.addEventListener('click', () => {
        infoModal.classList.add('show');
    });
    closeInfoModalBtn.addEventListener('click', () => {
        infoModal.classList.remove('show');
    });
}

const dynamicGamesContainer = document.getElementById('dynamic-games-container');
const gamesRef = ref(db, 'games');

onValue(gamesRef, (snapshot) => {
    const data = snapshot.val();
    dynamicGamesContainer.innerHTML = '';

    if (data) {
        Object.keys(data).forEach(key => {
            const game = data[key];

            const gameCard = document.createElement('div');
            gameCard.className = 'game-card';
            
            gameCard.innerHTML = `
                <div class="phone-mockup" style="background: url('${game.image}') center/cover no-repeat;">
                    <div class="phone-notch"></div>
                </div>
                <div class="game-title">${game.name}</div>
            `;

            gameCard.onclick = () => {
                document.querySelectorAll('.game-card').forEach(c => c.classList.remove('selected'));
                gameCard.classList.add('selected');

                if (game.link) {
                    currentSelectedGameLink = game.link;
                    switchTab('Games');
                }
            };

            dynamicGamesContainer.appendChild(gameCard);
        });
    } else {
        dynamicGamesContainer.innerHTML = '<div style="font-size:12px; color:#888; padding: 10px;">No games available. Please add from Admin Panel.</div>';
    }
});

let isServerSelected = false;
let activeServerMode = 'S1';

const pendingResultEl = document.getElementById('pending-result');
const numberResultEl = document.getElementById('number-result');

const statPassEl = document.querySelector('.stat-pass strong');
const statFailEl = document.querySelector('.stat-fail strong');
const statAccuracyEl = document.querySelector('.stat-accuracy strong');
const statBetsEl = document.getElementById('bet-counter');

const wingoTimeDisplay = document.getElementById('wingo-time-display');
const wingoPeriodDisplay = document.getElementById('wingo-period-display');
const wingoItems = document.querySelectorAll('.wingo-item');
const serverBtns = document.querySelectorAll('.server-btn');
const statusIndicator = document.getElementById('status-indicator');

let wingoDuration = 30;
let currentPeriod = "";

let passCount = 0;
let failCount = 0;
let betCount = 0;
let lastPredictionType = null;
let lastPredictionPeriod = null;

function renderHistory(last5) {
    const gridEl = document.getElementById('history-number-grid');
    const bsRowEl = document.getElementById('history-bs-row');
    
    if (gridEl) {
        let gridHtml = '';
        for (let row = 9; row >= 0; row--) {
            for (let col = 0; col < 5; col++) {
                const num = last5[col];
                if (num === row) {
                    gridHtml += `<div class="grid-pill solid"></div>`;
                } else {
                    gridHtml += `<div class="grid-pill"></div>`;
                }
            }
        }
        gridEl.innerHTML = gridHtml;
    }

    if (bsRowEl) {
        let bsHtml = '';
        for (let col = 0; col < 5; col++) {
            const num = last5[col];
            let text = '-';
            if (num !== undefined && num >= 0 && !isNaN(num)) {
                text = num >= 5 ? 'B' : 'S';
            }
            bsHtml += `
                <div class="abstract-icon">
                    <svg viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="xGrad-${col}" x1="0" y1="0" x2="0" y2="45" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stop-color="#A486F5" />
                                <stop offset="100%" stop-color="#A486F5" stop-opacity="0" />
                            </linearGradient>
                        </defs>
                        <g fill="url(#xGrad-${col})">
                            <rect x="15.5" y="-2" width="14" height="49" rx="7" transform="rotate(45 22.5 22.5)" />
                            <rect x="15.5" y="-2" width="14" height="49" rx="7" transform="rotate(-45 22.5 22.5)" />
                        </g>
                        <g fill="#FFF" opacity="0.6" transform="translate(32, 10) rotate(45)">
                            <rect x="-1.5" y="-1.5" width="2" height="2" rx="0.5" />
                            <rect x="1.5" y="-1.5" width="2" height="2" rx="0.5" />
                            <rect x="-1.5" y="1.5" width="2" height="2" rx="0.5" />
                            <rect x="1.5" y="1.5" width="2" height="2" rx="0.5" />
                        </g>
                    </svg>
                    <span class="bs-text">${text}</span>
                </div>
            `;
        }
        bsRowEl.innerHTML = bsHtml;
    }
}

async function fetchHistoryAndRender() {
    let timeStr = '30S';
    if (wingoDuration === 60) timeStr = '1M';
    if (wingoDuration === 180) timeStr = '3M';
    if (wingoDuration === 300) timeStr = '5M';

    try {
        const apiUrl = `https://draw.ar-lottery01.com/WinGo/WinGo_${timeStr}/GetHistoryIssuePage.json?ts=${Date.now()}&page=1&size=5`;
        const response = await fetch(apiUrl);
        if (response.ok) {
            const responseData = await response.json();
            let dataList = responseData?.data?.list || [];
            if (dataList.length > 0) {
                let last5 = dataList.slice(0, 5).map(item => parseInt(item.number, 10));
                renderHistory(last5);
            }
        }
    } catch (error) {}
}

fetchHistoryAndRender();

async function fetchWingoPrediction(newPeriod) {
    pendingResultEl.innerText = 'P';
    numberResultEl.innerText = 'P';
    
    let dataList = [];
    try {
        let timeStr = '30S';
        if (wingoDuration === 60) timeStr = '1M';
        if (wingoDuration === 180) timeStr = '3M';
        if (wingoDuration === 300) timeStr = '5M';

        const apiUrl = `https://draw.ar-lottery01.com/WinGo/WinGo_${timeStr}/GetHistoryIssuePage.json?ts=${Date.now()}&page=1&size=10`;
        
        const response = await fetch(apiUrl);
        if (response.ok) {
            const responseData = await response.json();
            dataList = responseData?.data?.list || [];
        }
    } catch (error) {}

    if (dataList.length > 0) {
        let last5 = dataList.slice(0, 5).map(item => parseInt(item.number, 10));
        renderHistory(last5);
    }

    if (lastPredictionType !== null && lastPredictionPeriod !== null) {
        let actualType = null;
        
        if (dataList.length > 0) {
            const actualRecord = dataList.find(r => String(r.issueNumber) === String(lastPredictionPeriod)) || dataList[0];
            const actualNumber = parseInt(actualRecord.number, 10);
            
            if (!isNaN(actualNumber)) {
                actualType = [5, 6, 7, 8, 9].includes(actualNumber) ? 'B' : 'S';
            }
        }

        if (actualType === null) {
            const randomActual = Math.floor(Math.random() * 10);
            actualType = [5, 6, 7, 8, 9].includes(randomActual) ? 'B' : 'S';
        }

        const rings = document.querySelectorAll('.hollow-ring');
        const flashDeepColor = (index, deepClass) => {
            rings[index].classList.add(deepClass);
            rings[index].style.transform = 'scale(1.15)';
            setTimeout(() => {
                rings[index].classList.remove(deepClass);
                rings[index].style.transform = 'scale(1)';
            }, 1500);
        };

        if (lastPredictionType === actualType) {
            passCount++;
            statPassEl.parentElement.style.transform = 'scale(1.05)';
            flashDeepColor(0, 'deep-green');
        } else {
            failCount++;
            statFailEl.parentElement.style.transform = 'scale(1.05)';
            flashDeepColor(1, 'deep-red');
        }
        
        betCount++;
        statBetsEl.parentElement.style.transform = 'scale(1.05)';
        flashDeepColor(3, 'deep-purple');

        statPassEl.innerText = passCount;
        statFailEl.innerText = failCount;
        statBetsEl.innerText = betCount;
        
        const newAccuracy = ((passCount / betCount) * 100).toFixed(0) + '%';
        if (statAccuracyEl.innerText !== newAccuracy) {
            statAccuracyEl.innerText = newAccuracy;
            statAccuracyEl.parentElement.style.transform = 'scale(1.05)';
            flashDeepColor(2, 'deep-gray');
        }

        setTimeout(() => {
            statPassEl.parentElement.style.transform = 'scale(1)';
            statFailEl.parentElement.style.transform = 'scale(1)';
            statAccuracyEl.parentElement.style.transform = 'scale(1)';
            statBetsEl.parentElement.style.transform = 'scale(1)';
        }, 300);
    }
    
    setTimeout(() => {
        let periodNum = parseInt(String(newPeriod).slice(-4), 10) || 0;
        let lastNum = 0;
        if (dataList.length > 0) {
            lastNum = parseInt(dataList[0].number, 10);
            if (isNaN(lastNum)) lastNum = 0;
        }

        let isNextBig = false;

        if (activeServerMode === 'S1') {
            isNextBig = ((periodNum + lastNum) % 2 === 0);
        } 
        else if (activeServerMode === 'S2') {
            isNextBig = ((periodNum + lastNum) % 2 !== 0);
        } 
        else if (activeServerMode === 'S3') {
            let sumDigits = String(periodNum).split('').reduce((a, b) => a + parseInt(b), 0);
            isNextBig = ((sumDigits + lastNum) % 2 === 0);
        } 
        else {
            isNextBig = (((periodNum * 3) + lastNum) % 2 !== 0);
        }

        const predType = isNextBig ? 'B' : 'S';
        
        let predNum;
        const pseudoRandomIndex = (periodNum + lastNum) % 5;
        if (isNextBig) {
            const bigNumbers = [5, 6, 7, 8, 9];
            predNum = bigNumbers[pseudoRandomIndex];
        } else {
            const smallNumbers = [0, 1, 2, 3, 4];
            predNum = smallNumbers[pseudoRandomIndex];
        }

        lastPredictionType = predType;
        lastPredictionPeriod = newPeriod;
        
        pendingResultEl.innerText = predType;
        numberResultEl.innerText = predNum;
    }, 500);
}

function runGameLogic() {
    const now = new Date();
    
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    
    const hours = now.getUTCHours();
    const minutes = now.getUTCMinutes();
    const seconds = now.getUTCSeconds();
    
    const totalSecondsToday = (hours * 3600) + (minutes * 60) + seconds;
    const periodCount = Math.floor(totalSecondsToday / wingoDuration) + 1;
    const remainingSeconds = wingoDuration - (totalSecondsToday % wingoDuration);
    
    let padLength = (wingoDuration < 180) ? 4 : 3;
    const newPeriod = `${year}${month}${day}${String(periodCount).padStart(padLength, '0')}`;
    
    const m = Math.floor(remainingSeconds / 60);
    const s = remainingSeconds % 60;
    wingoTimeDisplay.innerText = (m < 10 ? '0'+m : m) + ':' + (s < 10 ? '0'+s : s);
    
    const maskedPeriod = "XXXXXX" + newPeriod.slice(-4);
    wingoPeriodDisplay.innerText = maskedPeriod;

    if (newPeriod !== currentPeriod) {
        currentPeriod = newPeriod;
        if (isServerSelected) {
            setTimeout(() => {
                fetchWingoPrediction(currentPeriod);
            }, 1500);
        }
    }
}

wingoItems.forEach(item => {
    item.addEventListener('click', () => {
        wingoItems.forEach(w => w.classList.remove('active'));
        item.classList.add('active');
        
        wingoDuration = parseInt(item.getAttribute('data-duration'));
        currentPeriod = "";
        lastPredictionType = null;
        lastPredictionPeriod = null;

        fetchHistoryAndRender();
        runGameLogic();
    });
});

serverBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        let serverName = btn.innerText.trim();
        if(serverName === "") serverName = "PRO REXEN";

        if (btn.id === 'pro-rexen-btn' || serverName.includes("PRO REXEN")) {
            if (!hasProRexenAccess) {
                alert("⚠️ Access Denied!\n\nYou do not have permission to access the PRO REXEN server. Please contact the Admin to grant access to your account.");
                return;
            }
        }

        isServerSelected = true;
        activeServerMode = serverName;
        
        serverBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        statusIndicator.innerText = `Connected to ${serverName}!`;

        lastPredictionType = null; lastPredictionPeriod = null; passCount = 0; failCount = 0; betCount = 0;

        statPassEl.innerText = '0'; statFailEl.innerText = '0'; statAccuracyEl.innerText = '0%'; statBetsEl.innerText = '0';
        pendingResultEl.innerText = 'X'; numberResultEl.innerText = 'N';

        currentPeriod = "";

        fetchHistoryAndRender();
        runGameLogic();
        fetchWingoPrediction(currentPeriod);
    });
});

setInterval(runGameLogic, 1000);
runGameLogic();

function generateDynamicDates() {
    const dateContainer = document.getElementById('dynamic-date-selector');
    if (!dateContainer) return;
    dateContainer.innerHTML = '';
    
    const today = new Date();
    
    for (let i = -2; i <= 2; i++) {
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + i);
        
        const dayName = targetDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
        const dateNum = targetDate.getDate();
        
        const card = document.createElement('div');
        card.className = `date-card ${i === 0 ? 'active' : ''}`;
        
        const spanDay = document.createElement('span'); spanDay.innerText = dayName;
        const spanDate = document.createElement('span'); spanDate.innerText = dateNum;
        
        card.appendChild(spanDay); card.appendChild(spanDate); dateContainer.appendChild(card);
    }
}
generateDynamicDates();

const dEl = document.getElementById('expire-days-main');
const hEl = document.getElementById('expire-hours');
const mEl = document.getElementById('expire-minutes');
const sEl = document.getElementById('expire-seconds');

function updateExpiryTimer() {
    if (!userExpiryTimestamp || userExpiryTimestamp < Date.now()) {
        if(dEl) dEl.innerText = '-';
        if(hEl) hEl.innerText = '00';
        if(mEl) mEl.innerText = '00';
        if(sEl) sEl.innerText = '00';
        return;
    }

    const now = Date.now();
    const diffMs = userExpiryTimestamp - now;

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);

    if(dEl) dEl.innerText = diffDays < 10 ? '0' + diffDays : diffDays;
    if(hEl) hEl.innerText = diffHrs < 10 ? '0' + diffHrs : diffHrs;
    if(mEl) mEl.innerText = diffMins < 10 ? '0' + diffMins : diffMins;
    if(sEl) sEl.innerText = diffSecs < 10 ? '0' + diffSecs : diffSecs;
}

setInterval(updateExpiryTimer, 1000);
updateExpiryTimer();

document.getElementById('profile-status-btn')?.addEventListener('click', () => {
    if(userExpiryTimestamp && userExpiryTimestamp > Date.now()) {
        alert("✅ Account Status: Active\n\nYour subscription is currently active. Keep printing rewards! 📈");
    } else {
        alert("⚠️ Account Status: Inactive / Expired\n\nPlease contact the Admin to activate your subscription.");
    }
});

document.getElementById('profile-channel-btn')?.addEventListener('click', () => {
    window.open('https://t.me/+kRVlNNeA6FRjNjQ1', '_blank');
});

document.getElementById('profile-share-btn')?.addEventListener('click', () => {
    if (navigator.share) {
        navigator.share({
            title: 'ZEROX MODS App',
            text: 'Check out ZEROX MODS for the best smart predictions powered by ZEROX AI!',
            url: window.location.href
        }).catch(console.error);
    } else {
        alert("Share feature is not supported on your current browser.");
    }
});

document.getElementById('profile-server-btn')?.addEventListener('click', () => {
    alert("🌐 Server Information:\n\nStatus: Online & Connected\nLatency: Excellent\nAI Engine: ZEROX AI v2.1 (Active)");
});

document.getElementById('profile-update-btn')?.addEventListener('click', () => {
    alert("🔄 Checking for updates...\n\nYou are already using the latest version of ZEROX MODS!");
});

document.getElementById('profile-version-btn')?.addEventListener('click', () => {
    alert("ℹ️ Version Info:\n\nApp Version: 1.0 babycoder\nBuild Date: Recent\nPlatform: Web App");
});

const textAlerts = {
    'profile-policy-btn': "📜 Application Policy:\n\nPlease use this app responsibly. Sharing your Device ID with others is strictly prohibited and will lead to an automatic ban.",
    'profile-terms-btn': "🤝 Terms and Conditions:\n\nBy using this application, you agree to follow the standard terms of service. Predictions are based on AI algorithms and probabilities.",
    'profile-disclaimer-btn': "⚠️ Disclaimer:\n\nWe are not responsible for any financial loss. Always play with discipline and at your own risk.",
    'profile-agreement-btn': "📝 User Agreement:\n\nThe standard user agreement applies. Do not attempt to reverse engineer or manipulate the app data.",
    'profile-copyright-btn': "© Copyright:\n\nAll rights reserved by ZEROX MODS. Unauthorized reproduction is prohibited."
};

for (let id in textAlerts) {
    document.getElementById(id)?.addEventListener('click', () => {
        alert(textAlerts[id]);
    });
}

document.getElementById('profile-logout-btn')?.addEventListener('click', () => {
    if(confirm("Are you sure you want to logout?\n\nNote: Your Device ID is permanently bound to this device, so you will retain the same ID.")) {
        const landingPage = document.getElementById('landing-page');
        landingPage.style.display = 'flex';
        landingPage.style.opacity = '1';
        landingPage.style.transform = 'scale(1)';
        
        switchTab('Home');
        
        setTimeout(() => {
            window.location.reload();
        }, 300);
    }
});

const slogans = [
    "📊 Trade Calm, Win Bright Today",
    "✨ Let your patience print rewards",
    "💰 May your trades bring solid profits",
    "📈 Smart analysis brings real results",
    "🧠 Trust your logic — profits will follow",
    "🤝 Steady hands, strong profits ahead",
    "🚀 Stay focused. Stay disciplined. Stay profitable."
];
let sloganIndex = 0;
const sloganEl = document.getElementById('header-slogan');

if (sloganEl) {
    setInterval(() => {
        sloganEl.style.opacity = '0';
        setTimeout(() => {
            sloganIndex = (sloganIndex + 1) % slogans.length;
            sloganEl.innerText = slogans[sloganIndex];
            sloganEl.style.opacity = '1';
        }, 300);
    }, 5000);
}

const disclaimerTexts = [
    "ZEROX MODS is for entertainment and educational use only.",
    "We are not responsible for any loss or misuse of the app."
];
let discIndex = 0;
const discEl = document.getElementById('disclaimer-text');

if (discEl) {
    setInterval(() => {
        discEl.style.transform = 'translateX(-100%)';
        discEl.style.opacity = '0';
        
        setTimeout(() => {
            discIndex = (discIndex + 1) % disclaimerTexts.length;
            discEl.innerText = disclaimerTexts[discIndex];
            
            discEl.style.transition = 'none';
            discEl.style.transform = 'translateX(100%)';
            
            setTimeout(() => {
                discEl.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s ease';
                discEl.style.transform = 'translateX(0)';
                discEl.style.opacity = '1';
            }, 50);
        }, 500);
    }, 5000);
}

// SWEEG THEME SWITCHER LOGIC
const themeBtn = document.getElementById('profile-theme-btn');
const rootEl = document.documentElement;

// Check saved theme on load
const currentSavedTheme = localStorage.getItem('bunny_theme');
if (currentSavedTheme === 'green') {
    rootEl.setAttribute('data-theme', 'green');
}

if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        if (rootEl.getAttribute('data-theme') === 'green') {
            rootEl.removeAttribute('data-theme');
            localStorage.setItem('bunny_theme', 'purple');
        } else {
            rootEl.setAttribute('data-theme', 'green');
            localStorage.setItem('bunny_theme', 'green');
        }
    });
}

// ===============================================
// ADDED: Advanced Prediction System
// ===============================================

// DOM Elements for new features
const predictionPanel = document.getElementById('prediction-enhancement-panel');
const actualResultInput = document.getElementById('actualResultInput');
const verifyBtn = document.getElementById('verifyResultBtn');
const jackpotBanner = document.getElementById('jackpotBanner');
const historyListEl = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const toastContainer = document.getElementById('toastContainer');
const darkModeToggle = document.getElementById('darkModeToggle');
const modeBtns = document.querySelectorAll('.mode-btn');

// Prediction System Variables
let currentPredictionMode = 'random';
let lastPredictions = [];
let predictionHistory = [];

// Load history from localStorage
function loadPredictionHistory() {
    const saved = localStorage.getItem('zerox_prediction_history');
    if (saved) {
        predictionHistory = JSON.parse(saved);
        renderHistory();
    }
}

// Save history to localStorage
function savePredictionHistory() {
    localStorage.setItem('zerox_prediction_history', JSON.stringify(predictionHistory.slice(-10)));
    renderHistory();
}

// Toast Notification System
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Copy Device ID with Toast
const originalCopyIdBtn = document.getElementById('copy-id-btn');
if (originalCopyIdBtn) {
    const newCopyBtn = originalCopyIdBtn.cloneNode(true);
    originalCopyIdBtn.parentNode.replaceChild(newCopyBtn, originalCopyIdBtn);
    
    newCopyBtn.addEventListener('click', async () => {
        const deviceIdSpan = document.getElementById('display-device-id');
        const deviceId = deviceIdSpan.innerText.split(' ')[0];
        try {
            await navigator.clipboard.writeText(deviceId);
            showToast('✅ Device ID copied to clipboard!', 'success');
        } catch (err) {
            showToast('❌ Failed to copy Device ID', 'error');
        }
    });
}

// Sound System
function playSound(type) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        if (type === 'win') {
            oscillator.frequency.value = 880;
            gainNode.gain.value = 0.3;
            oscillator.type = 'sine';
            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 1);
            setTimeout(() => oscillator.stop(), 1000);
        } else if (type === 'prediction') {
            oscillator.frequency.value = 440;
            gainNode.gain.value = 0.2;
            oscillator.type = 'sine';
            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.5);
            setTimeout(() => oscillator.stop(), 500);
        }
    } catch (e) {
        // Silent fail if audio context fails
    }
}

// Prediction Logic: Trend Based
function getTrendPrediction() {
    if (lastPredictions.length < 3) return Math.floor(Math.random() * 10);
    
    const lastThree = lastPredictions.slice(-3);
    const avg = lastThree.reduce((a, b) => a + b, 0) / 3;
    const trend = Math.round(avg);
    let prediction = trend;
    
    prediction += Math.floor(Math.random() * 3) - 1;
    return Math.max(0, Math.min(9, prediction));
}

// Prediction Logic: Random Smart (non-repetitive)
let lastRandomPrediction = -1;
function getRandomSmartPrediction() {
    let prediction;
    do {
        prediction = Math.floor(Math.random() * 10);
    } while (prediction === lastRandomPrediction && lastRandomPrediction !== -1);
    lastRandomPrediction = prediction;
    return prediction;
}

// Prediction Logic: Pattern Memory
function getPatternPrediction() {
    if (lastPredictions.length < 4) return Math.floor(Math.random() * 10);
    
    const lastFour = lastPredictions.slice(-4);
    const pattern = lastFour.join('');
    
    for (let i = 0; i < lastPredictions.length - 4; i++) {
        const prevPattern = lastPredictions.slice(i, i + 4).join('');
        if (prevPattern === pattern && i + 4 < lastPredictions.length) {
            return lastPredictions[i + 4];
        }
    }
    
    const lastThree = lastPredictions.slice(-3);
    const avg = lastThree.reduce((a, b) => a + b, 0) / 3;
    return Math.min(9, Math.max(0, Math.round(avg)));
}

// Main Prediction Function
function getPrediction() {
    let prediction;
    switch(currentPredictionMode) {
        case 'trend':
            prediction = getTrendPrediction();
            break;
        case 'pattern':
            prediction = getPatternPrediction();
            break;
        default:
            prediction = getRandomSmartPrediction();
    }
    
    playSound('prediction');
    
    const pendingCircle = document.getElementById('pending-result');
    pendingCircle.classList.add('number-animate');
    setTimeout(() => pendingCircle.classList.remove('number-animate'), 300);
    
    return prediction;
}

// Show Jackpot Banner
function showJackpot() {
    jackpotBanner.style.display = 'flex';
    playSound('win');
    
    const numberCircle = document.getElementById('number-result');
    numberCircle.style.animation = 'none';
    numberCircle.offsetHeight;
    numberCircle.style.animation = 'numberPop 0.5s ease';
    
    setTimeout(() => {
        jackpotBanner.style.display = 'none';
    }, 3000);
}

// Verify Result against Prediction
function verifyResult() {
    const actualValue = parseInt(actualResultInput.value);
    const predictedValue = parseInt(document.getElementById('number-result').innerText);
    
    if (isNaN(actualValue) || actualValue < 0 || actualValue > 9) {
        showToast('❌ Please enter a valid number (0-9)', 'error');
        return;
    }
    
    if (isNaN(predictedValue) || predictedValue === 'N') {
        showToast('⚠️ Please select a server first to get a prediction', 'error');
        return;
    }
    
    const isWin = actualValue === predictedValue;
    const status = isWin ? 'WIN' : 'LOSS';
    
    const historyEntry = {
        predicted: predictedValue,
        actual: actualValue,
        status: status,
        timestamp: Date.now(),
        mode: currentPredictionMode
    };
    
    predictionHistory.unshift(historyEntry);
    if (predictionHistory.length > 10) predictionHistory.pop();
    savePredictionHistory();
    
    lastPredictions.push(actualValue);
    if (lastPredictions.length > 10) lastPredictions.shift();
    
    if (isWin) {
        showToast(`🎉 JACKPOT! You won with ${predictedValue}! 🎉`, 'success');
        showJackpot();
    } else {
        showToast(`💀 Loss! Predicted: ${predictedValue} | Actual: ${actualValue}`, 'error');
    }
    
    actualResultInput.value = '';
}

// Render History Panel
function renderHistory() {
    if (!historyListEl) return;
    
    if (predictionHistory.length === 0) {
        historyListEl.innerHTML = '<div class="empty-history">No predictions yet. Make your first prediction!</div>';
        return;
    }
    
    historyListEl.innerHTML = predictionHistory.map(entry => `
        <div class="history-item ${entry.status === 'WIN' ? 'win' : 'loss'}">
            <div class="history-prediction">
                <span>🎯 PRED:</span> ${entry.predicted}
            </div>
            <div class="history-actual">
                <span>🎲 ACTUAL:</span> ${entry.actual}
            </div>
            <div class="history-status ${entry.status === 'WIN' ? 'win' : 'loss'}">
                ${entry.status === 'WIN' ? '🏆 WIN' : '💔 LOSS'}
            </div>
            <div class="history-mode" style="font-size: 10px; color: #888;">
                ${entry.mode}
            </div>
        </div>
    `).join('');
}

// Clear History
function clearHistory() {
    if (confirm('Are you sure you want to clear all prediction history?')) {
        predictionHistory = [];
        savePredictionHistory();
        showToast('📜 History cleared successfully!', 'success');
    }
}

// Dark Mode Toggle
function initDarkMode() {
    const savedDarkMode = localStorage.getItem('zerox_dark_mode');
    if (savedDarkMode === 'enabled') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (darkModeToggle) darkModeToggle.textContent = '☀️';
    }
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('zerox_dark_mode', 'disabled');
                darkModeToggle.textContent = '🌙';
                showToast('🌞 Light mode activated', 'success');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('zerox_dark_mode', 'enabled');
                darkModeToggle.textContent = '☀️';
                showToast('🌙 Dark mode activated', 'success');
            }
        });
    }
}

// Intercept original prediction to use enhanced system
const originalFetchWingoPrediction = window.fetchWingoPrediction || fetchWingoPrediction;
window.fetchWingoPrediction = async function(newPeriod) {
    await originalFetchWingoPrediction(newPeriod);
    if (typeof isServerSelected !== 'undefined' && isServerSelected) {
        const enhancedPrediction = getPrediction();
        setTimeout(() => {
            const numEl = document.getElementById('number-result');
            const penEl = document.getElementById('pending-result');
            if (numEl) numEl.innerText = enhancedPrediction;
            if (penEl) penEl.innerText = enhancedPrediction >= 5 ? 'B' : 'S';
        }, 100);
    }
};

// Mode Selection
modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentPredictionMode = btn.getAttribute('data-mode');
        showToast(`🎮 Prediction mode switched to ${currentPredictionMode.toUpperCase()}`, 'success');
        
        if (typeof isServerSelected !== 'undefined' && isServerSelected) {
            const newPrediction = getPrediction();
            const numEl = document.getElementById('number-result');
            const penEl = document.getElementById('pending-result');
            if (numEl) numEl.innerText = newPrediction;
            if (penEl) penEl.innerText = newPrediction >= 5 ? 'B' : 'S';
        }
    });
});

// Show/Hide Enhancement Panel based on server selection
const statusIndicatorEl = document.getElementById('status-indicator');
if (statusIndicatorEl && predictionPanel) {
    const observer = new MutationObserver(function() {
        if (typeof isServerSelected !== 'undefined' && isServerSelected && predictionPanel) {
            predictionPanel.style.display = 'block';
        } else if (predictionPanel) {
            predictionPanel.style.display = 'none';
        }
    });
    observer.observe(statusIndicatorEl, { childList: true, characterData: true, subtree: true });
}

// Event Listeners for new features
if (verifyBtn) verifyBtn.addEventListener('click', verifyResult);
if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', clearHistory);
if (actualResultInput) {
    actualResultInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') verifyResult();
    });
}

// Initialize systems
loadPredictionHistory();
initDarkMode();

console.log('%c✅ ADVANCED PREDICTION SYSTEM ACTIVATED', 'color: #00ff41; font-size: 14px; font-weight: bold;');

