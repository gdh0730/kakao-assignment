const STORAGE_KEY = 'daily-todo-items';
const FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
};
const MIN_YEAR = 1900;
const MAX_YEAR = 2100;

const todoForm = document.querySelector('#todoForm');
const todoInput = document.querySelector('#todoInput');
const todoList = document.querySelector('#todoList');
const emptyState = document.querySelector('#emptyState');
const emptyStateTitle = document.querySelector('#emptyStateTitle');
const emptyStateDescription = document.querySelector('#emptyStateDescription');
const message = document.querySelector('#message');
const todayLabel = document.querySelector('#todayLabel');
const selectedDateText = document.querySelector('#selectedDateText');
const previousDateButton = document.querySelector('#previousDateButton');
const nextDateButton = document.querySelector('#nextDateButton');
const todayButton = document.querySelector('#todayButton');
const previousYearButton = document.querySelector('#previousYearButton');
const previousMonthButton = document.querySelector('#previousMonthButton');
const yearInput = document.querySelector('#yearInput');
const monthSelect = document.querySelector('#monthSelect');
const nextMonthButton = document.querySelector('#nextMonthButton');
const nextYearButton = document.querySelector('#nextYearButton');
const previousWeekButton = document.querySelector('#previousWeekButton');
const nextWeekButton = document.querySelector('#nextWeekButton');
const weekRangeText = document.querySelector('#weekRangeText');
const weekList = document.querySelector('#weekList');
const filterTabs = document.querySelectorAll('.filter-tab');
const viewTabs = document.querySelectorAll('.view-tab');
const sortSelect = document.querySelector('#sortSelect');
const pagination = document.querySelector('#pagination');
const pageSizeSelect = document.querySelector('#pageSizeSelect');
const previousPageButton = document.querySelector('#previousPageButton');
const nextPageButton = document.querySelector('#nextPageButton');
const pageInfo = document.querySelector('#pageInfo');

let todoItems = loadTodoItems();
let selectedDate = formatDateKey(new Date());
let displayedWeekStart = getWeekStartDate(selectedDate);
let currentFilter = FILTERS.ALL;
let currentView = 'daily';
let currentSort = 'date-asc';
let currentPage = 1;
let pageSize = Number(pageSizeSelect.value);
let editingTodoId = null;

initializeApp();

function initializeApp() {
  renderApp();

  todoForm.addEventListener('submit', handleTodoSubmit);
  previousDateButton.addEventListener('click', () => moveSelectedDate(-1));
  nextDateButton.addEventListener('click', () => moveSelectedDate(1));
  todayButton.addEventListener('click', moveToToday);
  previousYearButton.addEventListener('click', () => moveSelectedYear(-1));
  previousMonthButton.addEventListener('click', () => moveSelectedMonth(-1));
  yearInput.addEventListener('change', changeSelectedYearMonth);
  monthSelect.addEventListener('change', changeSelectedYearMonth);
  nextMonthButton.addEventListener('click', () => moveSelectedMonth(1));
  nextYearButton.addEventListener('click', () => moveSelectedYear(1));
  previousWeekButton.addEventListener('click', () => moveDisplayedWeek(-7));
  nextWeekButton.addEventListener('click', () => moveDisplayedWeek(7));
  sortSelect.addEventListener('change', () => changeSortOrder(sortSelect.value));
  pageSizeSelect.addEventListener('change', () => changePageSize(pageSizeSelect.value));
  previousPageButton.addEventListener('click', () => movePage(-1));
  nextPageButton.addEventListener('click', () => movePage(1));

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => changeFilter(tab.dataset.filter));
  });

  viewTabs.forEach((tab) => {
    tab.addEventListener('click', () => changeViewMode(tab.dataset.view));
  });
}

function handleTodoSubmit(event) {
  event.preventDefault();

  const todoText = todoInput.value.trim();
  if (!todoText) {
    showMessage('할 일을 입력한 뒤 추가해주세요.');
    todoInput.focus();
    return;
  }

  const newTodo = {
    id: createTodoId(),
    text: todoText,
    completed: false,
    date: selectedDate,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  todoItems.push(newTodo);
  todoInput.value = '';
  editingTodoId = null;
  currentPage = 1;
  saveAndRender('Todo가 추가되었습니다.', true);
}

function renderApp() {
  todayLabel.textContent = `오늘: ${formatReadableDate(formatDateKey(new Date()))}`;
  selectedDateText.textContent = formatReadableDate(selectedDate);
  displayedWeekStart = getWeekStartDate(selectedDate);

  renderDateJumpControls();
  renderViewTabs();
  renderFilterTabs();
  renderWeekView();
  renderTodoList();
}

function renderDateJumpControls() {
  const date = parseDateKey(selectedDate);
  yearInput.value = String(date.getFullYear());
  monthSelect.value = String(date.getMonth() + 1);
}

function renderViewTabs() {
  viewTabs.forEach((tab) => {
    const isActive = tab.dataset.view === currentView;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });
}

function renderFilterTabs() {
  filterTabs.forEach((tab) => {
    const isActive = tab.dataset.filter === currentFilter;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });
}

function renderWeekView() {
  const weekDates = getWeekDates(displayedWeekStart);
  const firstDate = weekDates[0];
  const lastDate = weekDates[weekDates.length - 1];

  weekRangeText.textContent = `${formatMonthDay(firstDate)} - ${formatMonthDay(lastDate)}`;
  weekList.innerHTML = '';

  weekDates.forEach((dateKey) => {
    const dateTodos = todoItems.filter((todo) => todo.date === dateKey);
    const weekDayButton = document.createElement('button');
    weekDayButton.type = 'button';
    weekDayButton.className = 'week-day';
    weekDayButton.classList.toggle('active', dateKey === selectedDate);
    weekDayButton.classList.toggle('today', dateKey === formatDateKey(new Date()));
    weekDayButton.setAttribute('aria-label', `${formatReadableDate(dateKey)} Todo ${dateTodos.length}개`);

    weekDayButton.innerHTML = `
      <span class="week-day__name">${getWeekdayName(dateKey)}</span>
      <span class="week-day__date">${Number(dateKey.slice(8, 10))}</span>
      <span class="week-day__count">${dateTodos.length}개</span>
    `;

    weekDayButton.addEventListener('click', () => {
      selectedDate = dateKey;
      editingTodoId = null;
      currentPage = 1;
      clearMessage();
      renderApp();
    });

    weekList.appendChild(weekDayButton);
  });
}

function renderTodoList() {
  const filteredTodos = getFilteredTodos();
  const totalPages = getTotalPages(filteredTodos.length);
  currentPage = Math.min(currentPage, totalPages);
  const visibleTodos = getPaginatedTodos(filteredTodos);

  todoList.innerHTML = '';
  emptyState.classList.toggle('hidden', visibleTodos.length > 0);
  renderEmptyStateText();
  renderPagination(filteredTodos.length, totalPages);

  visibleTodos.forEach((todo) => {
    const todoItem = document.createElement('li');
    todoItem.className = 'todo-item';
    todoItem.classList.toggle('completed', todo.completed);

    if (editingTodoId === todo.id) {
      todoItem.appendChild(createToggleElement(todo));
      todoItem.appendChild(createEditForm(todo));
    } else {
      todoItem.appendChild(createToggleElement(todo));
      todoItem.appendChild(createTodoContentElement(todo));
      todoItem.appendChild(createTodoActions(todo));
    }

    todoList.appendChild(todoItem);
  });
}

function renderEmptyStateText() {
  emptyStateTitle.textContent = '표시할 Todo가 없습니다.';
  emptyStateDescription.textContent = currentView === 'all'
    ? '전체 Todo 목록에 표시할 항목이 없습니다.'
    : '선택한 날짜와 필터를 확인하거나 새 Todo를 추가해보세요.';
}

function createToggleElement(todo) {
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'todo-toggle';
  checkbox.checked = todo.completed;
  checkbox.setAttribute('aria-label', `${todo.text} 완료 상태 변경`);
  checkbox.addEventListener('change', () => toggleTodoCompleted(todo.id));
  return checkbox;
}

function createTodoContentElement(todo) {
  const todoContent = document.createElement('div');
  todoContent.className = 'todo-content';

  if (currentView === 'all') {
    const dateBadge = document.createElement('span');
    dateBadge.className = 'todo-date-badge';
    dateBadge.textContent = formatReadableDate(todo.date);
    todoContent.appendChild(dateBadge);
  }

  const todoText = document.createElement('span');
  todoText.className = 'todo-text';
  todoText.textContent = todo.text;
  todoContent.appendChild(todoText);

  return todoContent;
}

function createTodoActions(todo) {
  const actions = document.createElement('div');
  actions.className = 'todo-actions';

  const editButton = document.createElement('button');
  editButton.type = 'button';
  editButton.className = 'todo-action';
  editButton.textContent = '수정';
  editButton.addEventListener('click', () => startEditingTodo(todo.id));

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'todo-action delete';
  deleteButton.textContent = '삭제';
  deleteButton.addEventListener('click', () => deleteTodo(todo.id));

  actions.append(editButton, deleteButton);
  return actions;
}

function createEditForm(todo) {
  const editForm = document.createElement('form');
  editForm.className = 'edit-form';

  const editInput = document.createElement('input');
  editInput.className = 'edit-input';
  editInput.type = 'text';
  editInput.maxLength = 80;
  editInput.value = todo.text;
  editInput.setAttribute('aria-label', 'Todo 수정 입력');

  const saveButton = document.createElement('button');
  saveButton.type = 'submit';
  saveButton.className = 'todo-action';
  saveButton.textContent = '저장';

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.className = 'todo-action';
  cancelButton.textContent = '취소';
  cancelButton.addEventListener('click', () => {
    editingTodoId = null;
    clearMessage();
    renderTodoList();
  });

  // 수정 폼 안에서 빈 값 저장을 막고 기존 Todo 데이터만 갱신한다.
  editForm.addEventListener('submit', (event) => {
    event.preventDefault();
    updateTodoText(todo.id, editInput.value.trim());
  });

  editForm.append(editInput, saveButton, cancelButton);
  requestAnimationFrame(() => editInput.focus());
  return editForm;
}

function getFilteredTodos() {
  return todoItems
    .filter((todo) => currentView === 'all' || todo.date === selectedDate)
    .filter((todo) => {
      if (currentFilter === FILTERS.ACTIVE) return !todo.completed;
      if (currentFilter === FILTERS.COMPLETED) return todo.completed;
      return true;
    })
    .sort(compareTodos);
}

function getPaginatedTodos(todos) {
  const startIndex = (currentPage - 1) * pageSize;
  return todos.slice(startIndex, startIndex + pageSize);
}

function renderPagination(totalItems, totalPages) {
  pagination.classList.toggle('hidden', totalItems === 0);
  pageInfo.textContent = `${currentPage} / ${totalPages}`;
  previousPageButton.disabled = currentPage <= 1;
  nextPageButton.disabled = currentPage >= totalPages;
}

function changeFilter(nextFilter) {
  currentFilter = nextFilter;
  editingTodoId = null;
  currentPage = 1;
  clearMessage();
  renderApp();
}

function changeViewMode(nextView) {
  currentView = nextView;
  editingTodoId = null;
  currentPage = 1;
  clearMessage();
  renderApp();
}

function changeSortOrder(nextSort) {
  currentSort = nextSort;
  editingTodoId = null;
  currentPage = 1;
  clearMessage();
  renderTodoList();
}

function changePageSize(nextPageSize) {
  pageSize = Number(nextPageSize);
  editingTodoId = null;
  currentPage = 1;
  clearMessage();
  renderTodoList();
}

function movePage(pageAmount) {
  const totalPages = getTotalPages(getFilteredTodos().length);
  currentPage = Math.min(Math.max(currentPage + pageAmount, 1), totalPages);
  editingTodoId = null;
  clearMessage();
  renderTodoList();
}

function getTotalPages(totalItems) {
  return Math.max(Math.ceil(totalItems / pageSize), 1);
}

function compareTodos(first, second) {
  if (currentSort === 'date-desc') {
    return compareDateValues(second, first);
  }

  if (currentSort === 'created-desc') {
    return compareCreatedAtValues(second, first);
  }

  if (currentSort === 'created-asc') {
    return compareCreatedAtValues(first, second);
  }

  return compareDateValues(first, second);
}

function compareDateValues(first, second) {
  const dateCompare = first.date.localeCompare(second.date);
  if (dateCompare !== 0) return dateCompare;
  return compareCreatedAtValues(second, first);
}

function compareCreatedAtValues(first, second) {
  return new Date(first.createdAt) - new Date(second.createdAt);
}

function toggleTodoCompleted(todoId) {
  todoItems = todoItems.map((todo) => {
    if (todo.id !== todoId) return todo;
    return {
      ...todo,
      completed: !todo.completed,
      updatedAt: new Date().toISOString(),
    };
  });

  editingTodoId = null;
  saveAndRender('완료 상태가 변경되었습니다.', true);
}

function startEditingTodo(todoId) {
  editingTodoId = todoId;
  clearMessage();
  renderTodoList();
}

function updateTodoText(todoId, nextText) {
  if (!nextText) {
    showMessage('수정할 내용을 입력해주세요.');
    return;
  }

  todoItems = todoItems.map((todo) => {
    if (todo.id !== todoId) return todo;
    return {
      ...todo,
      text: nextText,
      updatedAt: new Date().toISOString(),
    };
  });

  editingTodoId = null;
  saveAndRender('Todo가 수정되었습니다.', true);
}

function deleteTodo(todoId) {
  todoItems = todoItems.filter((todo) => todo.id !== todoId);
  editingTodoId = null;
  saveAndRender('Todo가 삭제되었습니다.', true);
}

function moveSelectedDate(dayAmount) {
  selectedDate = addDays(selectedDate, dayAmount);
  displayedWeekStart = getWeekStartDate(selectedDate);
  editingTodoId = null;
  currentPage = 1;
  clearMessage();
  renderApp();
}

function moveSelectedMonth(monthAmount) {
  const date = parseDateKey(selectedDate);
  setSelectedYearMonth(
    date.getFullYear(),
    date.getMonth() + monthAmount,
    date.getDate()
  );
  resetDateViewState();
}

function moveSelectedYear(yearAmount) {
  const date = parseDateKey(selectedDate);
  setSelectedYearMonth(
    date.getFullYear() + yearAmount,
    date.getMonth(),
    date.getDate()
  );
  resetDateViewState();
}

function changeSelectedYearMonth() {
  const nextYear = Number(yearInput.value);
  const nextMonthIndex = Number(monthSelect.value) - 1;
  const currentDate = parseDateKey(selectedDate);

  if (!Number.isInteger(nextYear) || nextYear < MIN_YEAR || nextYear > MAX_YEAR) {
    showMessage('연도는 1900년부터 2100년 사이로 입력해주세요.');
    renderDateJumpControls();
    return;
  }

  setSelectedYearMonth(nextYear, nextMonthIndex, currentDate.getDate());
}

function setSelectedYearMonth(year, monthIndex, day) {
  const nextDateKey = createClampedDateKey(year, monthIndex, day);
  const nextYear = parseDateKey(nextDateKey).getFullYear();

  if (nextYear < MIN_YEAR || nextYear > MAX_YEAR) {
    showMessage('연도는 1900년부터 2100년 사이에서 이동할 수 있습니다.');
    renderDateJumpControls();
    return;
  }

  selectedDate = nextDateKey;
  resetDateViewState();
}

function moveToToday() {
  selectedDate = formatDateKey(new Date());
  displayedWeekStart = getWeekStartDate(selectedDate);
  editingTodoId = null;
  currentPage = 1;
  clearMessage();
  renderApp();
}

function moveDisplayedWeek(dayAmount) {
  displayedWeekStart = addDays(displayedWeekStart, dayAmount);
  const weekDates = getWeekDates(displayedWeekStart);
  selectedDate = weekDates[0];
  editingTodoId = null;
  currentPage = 1;
  clearMessage();
  renderApp();
}

function resetDateViewState() {
  displayedWeekStart = getWeekStartDate(selectedDate);
  editingTodoId = null;
  currentPage = 1;
  clearMessage();
  renderApp();
}

function saveAndRender(messageText, isSuccess = false) {
  saveTodoItems();
  showMessage(messageText, isSuccess);
  renderApp();
}

function showMessage(text, isSuccess = false) {
  message.textContent = text;
  message.classList.toggle('success', isSuccess);
}

function clearMessage() {
  message.textContent = '';
  message.classList.remove('success');
}

function loadTodoItems() {
  const storedTodos = localStorage.getItem(STORAGE_KEY);
  if (!storedTodos) return [];

  try {
    const parsedTodos = JSON.parse(storedTodos);
    return Array.isArray(parsedTodos) ? parsedTodos : [];
  } catch (error) {
    console.error('Todo 데이터를 불러오는 중 오류가 발생했습니다.', error);
    return [];
  }
}

function saveTodoItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todoItems));
}

function createTodoId() {
  return `todo-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function addDays(dateKey, dayAmount) {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + dayAmount);
  return formatDateKey(date);
}

function createClampedDateKey(year, monthIndex, day) {
  const firstDayOfTargetMonth = new Date(year, monthIndex, 1);
  const targetYear = firstDayOfTargetMonth.getFullYear();
  const targetMonthIndex = firstDayOfTargetMonth.getMonth();
  const lastDayOfTargetMonth = new Date(targetYear, targetMonthIndex + 1, 0).getDate();
  const clampedDay = Math.min(day, lastDayOfTargetMonth);

  return formatDateKey(new Date(targetYear, targetMonthIndex, clampedDay));
}

function getWeekStartDate(dateKey) {
  const date = parseDateKey(dateKey);
  const dayIndex = date.getDay();
  const daysFromMonday = dayIndex === 0 ? 6 : dayIndex - 1;
  date.setDate(date.getDate() - daysFromMonday);
  return formatDateKey(date);
}

function getWeekDates(weekStartDateKey) {
  return Array.from({ length: 7 }, (_, index) => addDays(weekStartDateKey, index));
}

function formatReadableDate(dateKey) {
  const date = parseDateKey(dateKey);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(date);
}

function formatMonthDay(dateKey) {
  const date = parseDateKey(dateKey);
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
  }).format(date);
}

function getWeekdayName(dateKey) {
  const date = parseDateKey(dateKey);
  return new Intl.DateTimeFormat('ko-KR', { weekday: 'short' }).format(date);
}
