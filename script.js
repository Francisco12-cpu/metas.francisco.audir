// Application State
let appState = {
    goals: [],
    dailyReports: {},
    currentDate: new Date(),
    startDate: new Date(2025, 7, 3), // August 3, 2025 (month is 0-indexed)
    endDate: null,
    currentWeek: 1,
    selectedDate: null,
    selectedGoal: null
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Feather icons
    feather.replace();
    
    // Calculate end date (12 weeks from start date)
    appState.endDate = new Date(appState.startDate);
    appState.endDate.setDate(appState.endDate.getDate() + (12 * 7) - 1);
    
    // Load data from localStorage
    loadData();
    
    // Initialize components
    initializeNavigation();
    initializeCalendar();
    initializeGoals();
    initializeProgress();
    initializeModals();
    
    // Update current week
    updateCurrentWeek();
    
    // Initial render
    renderAll();
    
    console.log('Sistema de 12 semanas inicializado!');
});

// Data Management Functions
function saveData() {
    const dataToSave = {
        goals: appState.goals,
        dailyReports: appState.dailyReports,
        lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('goals12weeks', JSON.stringify(dataToSave));
}

function loadData() {
    const savedData = localStorage.getItem('goals12weeks');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            appState.goals = data.goals || [];
            appState.dailyReports = data.dailyReports || {};
            console.log('Dados carregados do localStorage');
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    }
}

// Navigation Functions
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.dataset.section;
            showSection(section);
            
            // Update active nav button
            navButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function showSection(sectionName) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Re-render content when switching sections
        if (sectionName === 'progress') {
            renderProgress();
        }
    }
}

// Calendar Functions
function initializeCalendar() {
    renderCalendar();
}

function renderCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.innerHTML = '';
    
    const totalWeeks = 12;
    let currentDate = new Date(appState.startDate);
    
    for (let week = 1; week <= totalWeeks; week++) {
        // Add week header
        const weekHeader = document.createElement('div');
        weekHeader.className = 'week-header';
        weekHeader.textContent = `Semana ${week}`;
        calendarGrid.appendChild(weekHeader);
        
        // Add 7 days for this week
        for (let day = 0; day < 7; day++) {
            const dayElement = createCalendarDay(new Date(currentDate), week);
            calendarGrid.appendChild(dayElement);
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }
    
    updateCalendarStats();
}

function createCalendarDay(date, week) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    
    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = date.getDate();
    
    const dateKey = formatDateKey(date);
    const hasReport = appState.dailyReports[dateKey];
    
    if (hasReport) {
        dayElement.classList.add('has-report');
        const indicator = document.createElement('div');
        indicator.className = 'day-indicator';
        dayElement.appendChild(indicator);
    }
    
    // Highlight current week
    if (week === appState.currentWeek) {
        dayElement.classList.add('current-week');
    }
    
    dayElement.appendChild(dayNumber);
    
    // Add click event
    dayElement.addEventListener('click', function() {
        openDailyReportModal(date);
    });
    
    return dayElement;
}

function updateCurrentWeek() {
    const today = new Date();
    const diffTime = today - appState.startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays >= 0 && diffDays < 84) {
        appState.currentWeek = Math.floor(diffDays / 7) + 1;
    } else if (diffDays >= 84) {
        appState.currentWeek = 12;
    } else {
        appState.currentWeek = 1;
    }
    
    const currentWeekElement = document.getElementById('currentWeekNumber');
    if (currentWeekElement) {
        currentWeekElement.textContent = appState.currentWeek;
    }
}

function updateCalendarStats() {
    const daysWithReports = Object.keys(appState.dailyReports).length;
    const daysWithReportsElement = document.getElementById('daysWithReports');
    
    if (daysWithReportsElement) {
        daysWithReportsElement.textContent = daysWithReports;
    }
}

// Goals Functions
function initializeGoals() {
    setupGoalFilters();
    renderGoals();
}

function setupGoalFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', renderGoals);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', renderGoals);
    }
    
    // Populate week selector in goal modal
    const goalWeekSelect = document.getElementById('goalWeek');
    if (goalWeekSelect) {
        for (let i = 1; i <= 12; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Semana ${i}`;
            goalWeekSelect.appendChild(option);
        }
    }
}

function renderGoals() {
    const goalsList = document.getElementById('goals-list');
    if (!goalsList) return;
    
    const categoryFilter = document.getElementById('categoryFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    let filteredGoals = appState.goals;
    
    if (categoryFilter !== 'all') {
        filteredGoals = filteredGoals.filter(goal => goal.category === categoryFilter);
    }
    
    if (statusFilter !== 'all') {
        filteredGoals = filteredGoals.filter(goal => goal.status === statusFilter);
    }
    
    goalsList.innerHTML = '';
    
    if (filteredGoals.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <p style="text-align: center; color: var(--text-secondary); padding: 2rem;">
                ${appState.goals.length === 0 ? 'Nenhuma meta cadastrada ainda.' : 'Nenhuma meta encontrada com os filtros aplicados.'}
            </p>
        `;
        goalsList.appendChild(emptyState);
        return;
    }
    
    filteredGoals.forEach(goal => {
        const goalElement = createGoalElement(goal);
        goalsList.appendChild(goalElement);
    });
}

function createGoalElement(goal) {
    const goalElement = document.createElement('div');
    goalElement.className = `goal-item ${goal.status}`;
    
    goalElement.innerHTML = `
        <div class="goal-header">
            <div>
                <div class="goal-title">${goal.title}</div>
                <div class="goal-category">${getCategoryDisplayName(goal.category)}</div>
                ${goal.week ? `<div class="goal-week">Semana ${goal.week}</div>` : ''}
            </div>
            <div class="goal-actions">
                <button class="btn-secondary" onclick="editGoal('${goal.id}')">
                    <i data-feather="edit-2"></i>
                </button>
                <button class="btn-${goal.status === 'completed' ? 'secondary' : 'success'}" 
                        onclick="toggleGoalStatus('${goal.id}')">
                    ${goal.status === 'completed' ? 'Desfazer' : 'Concluir'}
                </button>
                <button class="btn-danger" onclick="deleteGoal('${goal.id}')">
                    <i data-feather="trash-2"></i>
                </button>
            </div>
        </div>
        <div class="goal-description">${goal.description}</div>
    `;
    
    // Re-initialize feather icons for the new elements
    setTimeout(() => feather.replace(), 0);
    
    return goalElement;
}

function getCategoryDisplayName(category) {
    const categories = {
        'saude': 'Saúde',
        'carreira': 'Carreira',
        'pessoal': 'Pessoal',
        'financeiro': 'Financeiro',
        'aprendizado': 'Aprendizado'
    };
    return categories[category] || category;
}

function addGoal() {
    const title = document.getElementById('goalTitle').value.trim();
    const description = document.getElementById('goalDescription').value.trim();
    const category = document.getElementById('goalCategory').value;
    const week = document.getElementById('goalWeek').value;
    
    if (!title) {
        alert('Por favor, insira um título para a meta.');
        return;
    }
    
    const goal = {
        id: Date.now().toString(),
        title,
        description,
        category,
        week: week ? parseInt(week) : null,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    if (appState.selectedGoal) {
        // Edit existing goal
        const index = appState.goals.findIndex(g => g.id === appState.selectedGoal);
        if (index !== -1) {
            appState.goals[index] = { ...appState.goals[index], ...goal, id: appState.selectedGoal };
        }
        appState.selectedGoal = null;
    } else {
        // Add new goal
        appState.goals.push(goal);
    }
    
    saveData();
    renderGoals();
    renderProgress();
    closeModal('goalModal');
    clearGoalForm();
}

function editGoal(goalId) {
    const goal = appState.goals.find(g => g.id === goalId);
    if (!goal) return;
    
    appState.selectedGoal = goalId;
    
    document.getElementById('goalTitle').value = goal.title;
    document.getElementById('goalDescription').value = goal.description;
    document.getElementById('goalCategory').value = goal.category;
    document.getElementById('goalWeek').value = goal.week || '';
    document.getElementById('goalModalTitle').textContent = 'Editar Meta';
    
    openModal('goalModal');
}

function deleteGoal(goalId) {
    if (confirm('Tem certeza que deseja excluir esta meta?')) {
        appState.goals = appState.goals.filter(g => g.id !== goalId);
        saveData();
        renderGoals();
        renderProgress();
    }
}

function toggleGoalStatus(goalId) {
    const goal = appState.goals.find(g => g.id === goalId);
    if (!goal) return;
    
    goal.status = goal.status === 'completed' ? 'pending' : 'completed';
    saveData();
    renderGoals();
    renderProgress();
}

function clearGoalForm() {
    document.getElementById('goalTitle').value = '';
    document.getElementById('goalDescription').value = '';
    document.getElementById('goalCategory').value = 'saude';
    document.getElementById('goalWeek').value = '';
    document.getElementById('goalModalTitle').textContent = 'Nova Meta';
}

// Progress Functions
function initializeProgress() {
    renderProgress();
}

function renderProgress() {
    updateGoalsProgress();
    updateConsistencyProgress();
    updateWeeklyProgress();
}

function updateGoalsProgress() {
    const totalGoals = appState.goals.length;
    const completedGoals = appState.goals.filter(g => g.status === 'completed').length;
    const percentage = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
    
    document.getElementById('totalGoals').textContent = totalGoals;
    document.getElementById('completedGoals').textContent = completedGoals;
    document.getElementById('goalsPercentage').textContent = `${percentage}%`;
    
    const progressCircle = document.getElementById('goalsProgress');
    updateCircularProgress(progressCircle, percentage);
}

function updateConsistencyProgress() {
    const totalDays = 84;
    const reportDays = Object.keys(appState.dailyReports).length;
    const percentage = Math.round((reportDays / totalDays) * 100);
    
    document.getElementById('totalDaysProgress').textContent = totalDays;
    document.getElementById('reportDays').textContent = reportDays;
    document.getElementById('consistencyPercentage').textContent = `${percentage}%`;
    
    const progressCircle = document.getElementById('consistencyProgress');
    updateCircularProgress(progressCircle, percentage);
}

function updateCircularProgress(element, percentage) {
    const degrees = (percentage / 100) * 360;
    element.style.background = `conic-gradient(var(--primary-color) ${degrees}deg, var(--bg-tertiary) ${degrees}deg)`;
}

function updateWeeklyProgress() {
    const weeklyChart = document.getElementById('weekly-chart');
    if (!weeklyChart) return;
    
    weeklyChart.innerHTML = '';
    
    for (let week = 1; week <= 12; week++) {
        const weekProgress = calculateWeekProgress(week);
        const weekElement = createWeekProgressElement(week, weekProgress);
        weeklyChart.appendChild(weekElement);
    }
}

function calculateWeekProgress(weekNumber) {
    // Calculate progress based on completed goals assigned to this week
    // and daily reports for this week
    const weekGoals = appState.goals.filter(g => g.week === weekNumber);
    const completedWeekGoals = weekGoals.filter(g => g.status === 'completed');
    
    const weekStart = new Date(appState.startDate);
    weekStart.setDate(weekStart.getDate() + (weekNumber - 1) * 7);
    
    let weekReports = 0;
    for (let day = 0; day < 7; day++) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + day);
        const dateKey = formatDateKey(date);
        if (appState.dailyReports[dateKey]) {
            weekReports++;
        }
    }
    
    const goalsProgress = weekGoals.length > 0 ? (completedWeekGoals.length / weekGoals.length) * 50 : 0;
    const reportsProgress = (weekReports / 7) * 50;
    
    return Math.round(goalsProgress + reportsProgress);
}

function createWeekProgressElement(weekNumber, percentage) {
    const weekElement = document.createElement('div');
    weekElement.className = 'week-progress';
    
    weekElement.innerHTML = `
        <div class="week-number">Semana ${weekNumber}</div>
        <div class="week-bar">
            <div class="week-bar-fill" style="height: ${percentage}%"></div>
        </div>
        <div class="week-percentage">${percentage}%</div>
    `;
    
    return weekElement;
}

// Modal Functions
function initializeModals() {
    // Add Goal Button
    const addGoalBtn = document.getElementById('addGoalBtn');
    if (addGoalBtn) {
        addGoalBtn.addEventListener('click', function() {
            clearGoalForm();
            openModal('goalModal');
        });
    }
    
    // Save Goal Button
    const saveGoalBtn = document.getElementById('saveGoalBtn');
    if (saveGoalBtn) {
        saveGoalBtn.addEventListener('click', addGoal);
    }
    
    // Save Report Button
    const saveReportBtn = document.getElementById('saveReportBtn');
    if (saveReportBtn) {
        saveReportBtn.addEventListener('click', saveDailyReport);
    }
    
    // Modal close buttons
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal.id);
        });
    });
    
    // Close modal when clicking outside
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function openDailyReportModal(date) {
    appState.selectedDate = date;
    const dateKey = formatDateKey(date);
    const existingReport = appState.dailyReports[dateKey];
    
    // Set modal title
    const modalDate = document.getElementById('modalDate');
    modalDate.textContent = `Relatório - ${formatDateDisplay(date)}`;
    
    // Load existing data
    const reportTextarea = document.getElementById('dailyReport');
    reportTextarea.value = existingReport ? existingReport.content : '';
    
    // Set mood selector
    const moodButtons = document.querySelectorAll('.mood-btn');
    moodButtons.forEach(btn => {
        btn.classList.remove('selected');
        btn.addEventListener('click', function() {
            moodButtons.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    if (existingReport && existingReport.mood) {
        const selectedMoodBtn = document.querySelector(`[data-mood="${existingReport.mood}"]`);
        if (selectedMoodBtn) {
            selectedMoodBtn.classList.add('selected');
        }
    }
    
    openModal('dailyReportModal');
}

function saveDailyReport() {
    if (!appState.selectedDate) return;
    
    const content = document.getElementById('dailyReport').value.trim();
    const selectedMoodBtn = document.querySelector('.mood-btn.selected');
    const mood = selectedMoodBtn ? selectedMoodBtn.dataset.mood : null;
    
    if (!content && !mood) {
        alert('Por favor, escreva um relatório ou selecione como você se sentiu.');
        return;
    }
    
    const dateKey = formatDateKey(appState.selectedDate);
    
    appState.dailyReports[dateKey] = {
        content,
        mood: mood ? parseInt(mood) : null,
        date: appState.selectedDate.toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    saveData();
    renderCalendar();
    renderProgress();
    closeModal('dailyReportModal');
}

// Utility Functions
function formatDateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatDateDisplay(date) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('pt-BR', options);
}

function renderAll() {
    renderCalendar();
    renderGoals();
    renderProgress();
}

// Global functions for onclick handlers
window.editGoal = editGoal;
window.deleteGoal = deleteGoal;
window.toggleGoalStatus = toggleGoalStatus;

// Auto-save functionality
setInterval(function() {
    if (Object.keys(appState.dailyReports).length > 0 || appState.goals.length > 0) {
        saveData();
    }
}, 30000); // Auto-save every 30 seconds

console.log('Script de 12 semanas carregado com sucesso!');