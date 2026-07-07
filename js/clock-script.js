// Global state for 24-hour format
let use24HourFormat = true;

// Time zones configuration
const timeZones = [
    { id: 'ny-clock', name: 'America/New_York' },
    { id: 'london-clock', name: 'Europe/London' },
    { id: 'paris-clock', name: 'Europe/Paris' },
    { id: 'tokyo-clock', name: 'Asia/Tokyo' },
    { id: 'sydney-clock', name: 'Australia/Sydney' },
    { id: 'dubai-clock', name: 'Asia/Dubai' },
    { id: 'singapore-clock', name: 'Asia/Singapore' },
    { id: 'sao-paulo-clock', name: 'America/Sao_Paulo' }
];

/**
 * Format time based on format setting
 */
function formatTime(date, is24Hour) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    if (is24Hour) {
        return `${hours}:${minutes}:${seconds}`;
    } else {
        const hour = date.getHours();
        const displayHour = String(hour % 12 || 12).padStart(2, '0');
        const period = hour >= 12 ? 'PM' : 'AM';
        return `${displayHour}:${minutes}:${seconds} ${period}`;
    }
}

/**
 * Format date as "Mon, Jan 01"
 */
function formatDate(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const dateNum = String(date.getDate()).padStart(2, '0');
    
    return `${dayName}, ${monthName} ${dateNum}`;
}

/**
 * Update a single clock
 */
function updateClock(clockId, timeZone, is24Hour) {
    const clockElement = document.getElementById(clockId);
    if (!clockElement) return;

    try {
        // Create date in the specified time zone
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        const parts = formatter.formatToParts(new Date());
        const partsObj = parts.reduce((acc, part) => {
            acc[part.type] = part.value;
            return acc;
        }, {});

        // Create a date object with the timezone time
        const tzDate = new Date(
            `${partsObj.year}-${partsObj.month}-${partsObj.day}T${partsObj.hour}:${partsObj.minute}:${partsObj.second}`
        );

        const timeElement = clockElement.querySelector('.time');
        const dateElement = clockElement.querySelector('.date');

        timeElement.textContent = formatTime(tzDate, is24Hour);
        dateElement.textContent = formatDate(tzDate);
    } catch (error) {
        console.error(`Error updating clock for ${timeZone}:`, error);
    }
}

/**
 * Update all clocks
 */
function updateAllClocks(is24Hour = true) {
    timeZones.forEach(tz => {
        updateClock(tz.id, tz.name, is24Hour);
    });

    // Update local clock
    const localClockElement = document.getElementById('local-clock');
    if (localClockElement) {
        const now = new Date();
        localClockElement.querySelector('.time').textContent = formatTime(now, is24Hour);
        localClockElement.querySelector('.date').textContent = formatDate(now);
    }
}

/**
 * Initialize the clock
 */
function initializeClock() {
    // Update immediately
    updateAllClocks(use24HourFormat);

    // Update every second
    setInterval(() => {
        updateAllClocks(use24HourFormat);
    }, 1000);

    // Event listeners for buttons
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            updateAllClocks(use24HourFormat);
            // Add visual feedback
            refreshBtn.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                refreshBtn.style.transform = 'rotate(0deg)';
            }, 600);
        });
        // Add smooth transition for rotation
        refreshBtn.style.transition = 'transform 0.6s ease';
    }

    const toggleBtn = document.getElementById('toggle-format');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            use24HourFormat = !use24HourFormat;
            toggleBtn.textContent = use24HourFormat ? 'Toggle 12/24 Hour' : 'Toggle 12/24 Hour';
            updateAllClocks(use24HourFormat);
            // Add visual feedback
            toggleBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                toggleBtn.style.transform = 'scale(1)';
            }, 200);
        });
        // Add smooth transition for scale
        toggleBtn.style.transition = 'transform 0.2s ease';
    }
}

/**
 * Handle visibility change to resume updates when tab becomes active
 */
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        updateAllClocks(use24HourFormat);
    }
});

// Start the clock when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeClock);
} else {
    initializeClock();
}
