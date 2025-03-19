const moodCards = document.querySelectorAll(".mood-card");
const displayMood = document.getElementById("selected-mood-text");
const saveMoodBtn = document.getElementById("save-mood");
const moodHistory = document.getElementById("mood-history");
const clearHistoryBtn = document.getElementById("clear-history");
const monthYearElement = document.querySelector(".month-year");
const datesElement = document.getElementById("dates");
const prevBtn = document.getElementById("prev-btn");
const nxtBtn = document.getElementById("next-btn");
const themeToggleBtn = document.querySelector(".toggle-theme");
const body = document.body;

// Check saved theme preference in localStorage
if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
    themeToggleBtn.innerText = "☀ Light Mode";
}

// Toggle theme on button click
themeToggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    // Update button text
    if (body.classList.contains("dark-mode")) {
        themeToggleBtn.innerText = "☀ Light Mode";
        localStorage.setItem("theme", "dark");
    } else {
        themeToggleBtn.innerText = "🌙 Dark Mode";
        localStorage.setItem("theme", "light");
    }
});

let currentDate = new Date();
let moodsByDate = JSON.parse(localStorage.getItem("moodsByDate")) || {}; // Load from local storage
let selectedMood = null;
let selectedEmoji = null;

moodCards.forEach((card) => {
    card.addEventListener("click", () => {
        selectedMood = card.getAttribute("data-mood");
        selectedEmoji = card.querySelector(".emoji").innerText;
        displayMood.innerText = `Selected Mood: ${selectedEmoji}`;
        displayMood.style.fontSize = "2rem";
        card.classList.add("selected");
    });
});

saveMoodBtn.addEventListener("click", () => {
    if (!selectedMood) return;
    let today = new Date();
    let dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    let day = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    
    moodsByDate[dateKey] = { emoji: selectedEmoji, mood: selectedMood, date: day };
    localStorage.setItem("moodsByDate", JSON.stringify(moodsByDate)); // Save to local storage
    updateCalendar();
    displayMoodHistory();
    selectedMood = null;
    selectedEmoji = null;
    displayMood.innerText = "No mood selected yet.";
    displayMood.style.fontSize = "1.5rem";
    moodCards.forEach(c => c.classList.remove("selected"));
});

clearHistoryBtn.addEventListener("click", () => {
    moodHistory.innerHTML = ''; 
});


const updateCalendar = () => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    // Get first and last days of the current month
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    const totalDays = lastDay.getDate(); // Total number of days in the month
    const firstDayIndex = firstDay.getDay(); // Day index (0 = Sunday, 1 = Monday, etc.)

    // Set month and year in the header
    const monthYearString = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    monthYearElement.textContent = monthYearString;

    let datesHTML = "";
    
    // Add previous month's trailing days (for alignment)
    const prevLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
        datesHTML += `<div class="date inactive">${prevLastDay - i}</div>`;
    }

    // Add current month's days
    for (let i = 1; i <= totalDays; i++) {
        const dateKey = `${currentYear}-${currentMonth + 1}-${i}`;
        const mood = moodsByDate[dateKey] ? moodsByDate[dateKey].emoji : ""; // Check if mood exists for this day

        // Highlight today's date
        const isToday = new Date().toDateString() === new Date(currentYear, currentMonth, i).toDateString();
        const activeClass = isToday ? "active" : "";

        datesHTML += `<div class="date ${activeClass}" data-date="${dateKey}">
                        <span>${i}</span>
                        <div class="mood">${mood}</div>
                      </div>`;
    }

    // Add next month's leading days (for alignment)
    const remainingDays = 7 - ((firstDayIndex + totalDays) % 7);
    for (let i = 1; i <= remainingDays; i++) {
        datesHTML += `<div class="date inactive">${i}</div>`;
    }

    // Inject generated HTML into the calendar container
    datesElement.innerHTML = datesHTML;
};

const displayMoodHistory = () => {
    moodHistory.innerHTML = "";
    Object.values(moodsByDate).forEach(({ emoji, mood, date }) => {
        const moodDiv = document.createElement("div");
        moodDiv.className = "mood-Div";
        moodDiv.innerHTML = `<div class="mood-content"><span class="emoji">${emoji}</span><h3 class="mood-text">${mood}</h3></div><div class="mood-info"><span class="mood-day">${date}</span></div>`;
        moodHistory.appendChild(moodDiv);
    });
};

prevBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
});
nxtBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
});

updateCalendar();
displayMoodHistory();
