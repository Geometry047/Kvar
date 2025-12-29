[script.js](https://github.com/user-attachments/files/24367548/script.js)
document.addEventListener('DOMContentLoaded', () => {

    /* ===== УТИЛИТЫ ДЛЯ МОДАЛОК ===== */

    function openModal(id) {
        const overlay = document.getElementById(id);
        if (!overlay) return;
        overlay.hidden = false;
        document.body.classList.add('no-scroll');
    }

    function closeModal(overlay) {
        overlay.hidden = true;
        const anyOpen = document.querySelector('.modal-overlay:not([hidden])');
        if (!anyOpen) {
            document.body.classList.remove('no-scroll');
        }
    }

    // Закрытие по клику на фон
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay);
            }
        });
    });

    // Закрытие по кнопкам с атрибутом data-close-modal
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.addEventListener('click', () => {
            const overlay = btn.closest('.modal-overlay');
            if (overlay) closeModal(overlay);
        });
    });

    /* ===== ВЫБОР ГОРОДА ===== */

    const cityButton = document.getElementById('city-button');
    const cityModal  = document.getElementById('city-modal');
    const cityInput  = document.getElementById('city-input');
    const cityListEl = document.getElementById('city-list');

    const cities = [
        'Москва',
        'Санкт-Петербург',
        'Новосибирск',
        'Екатеринбург',
        'Казань',
        'Нижний Новгород',
        'Челябинск',
        'Самара',
        'Омск',
        'Ростов-на-Дону',
        'Уфа',
        'Красноярск',
        'Пермь',
        'Воронеж',
        'Волгоград'
    ];

    function renderCityList(filter = '') {
        if (!cityListEl) return;
        const q = filter.trim().toLowerCase();
        cityListEl.innerHTML = '';

        const filtered = cities.filter(city =>
            city.toLowerCase().includes(q)
        );

        if (!filtered.length) {
            const li = document.createElement('li');
            li.textContent = 'Город не найден';
            li.className = 'modal__list-item modal__list-item--empty';
            cityListEl.appendChild(li);
            return;
        }

        filtered.forEach(city => {
            const li = document.createElement('li');
            li.textContent = city;
            li.className = 'modal__list-item';
            li.addEventListener('click', () => selectCity(city));
            cityListEl.appendChild(li);
        });
    }

    function selectCity(city) {
        if (cityButton) {
            cityButton.textContent = city;
        }
        localStorage.setItem('selectedCity', city);
        if (cityModal) closeModal(cityModal);
    }

    if (cityButton && cityModal && cityInput && cityListEl) {
        // Открытие модалки выбора города
        cityButton.addEventListener('click', () => {
            openModal('city-modal');
            cityInput.value = '';
            renderCityList('');
            setTimeout(() => cityInput.focus(), 100);
        });

        // Фильтрация списка
        cityInput.addEventListener('input', () => {
            renderCityList(cityInput.value);
        });

        // Восстанавливаем выбранный город
        const savedCity = localStorage.getItem('selectedCity');
        if (savedCity) {
            cityButton.textContent = savedCity;
        }
    }

    /* ===== ПОИСК ПО САЙТУ ===== */

    const searchButton  = document.getElementById('search-button');
    const searchModal   = document.getElementById('search-modal');
    const searchForm    = document.getElementById('search-form');
    const searchInput   = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    const searchItems = [
        { title: 'Главная', url: 'index.html', keywords: 'главная стартовая' },
        { title: 'Каталог квартир', url: 'catalog.html', keywords: 'каталог квартиры новостройки' },
        { title: 'Ипотечный калькулятор', url: 'mortgage.html', keywords: 'ипотека ипотечный калькулятор расчет кредит' },
        { title: 'О нас', url: 'about.html', keywords: 'о нас компания агентство' },
        { title: 'Контакты', url: 'contacts.html', keywords: 'контакты связь телефон адрес' }
    ];

    function performSearch(query) {
        if (!searchResults) return;
        const q = query.trim().toLowerCase();
        searchResults.innerHTML = '';

        if (!q) return;

        const results = searchItems.filter(item =>
            item.title.toLowerCase().includes(q) ||
            item.keywords.toLowerCase().includes(q)
        );

        if (!results.length) {
            searchResults.textContent = 'Ничего не найдено.';
            return;
        }

        const ul = document.createElement('ul');
        ul.className = 'modal__results-list';

        results.forEach(item => {
            const li = document.createElement('li');
            const a  = document.createElement('a');
            a.href = item.url;
            a.textContent = item.title;
            li.appendChild(a);
            ul.appendChild(li);
        });

        searchResults.appendChild(ul);
    }

    if (searchButton && searchModal && searchForm && searchInput && searchResults) {
        searchButton.addEventListener('click', () => {
            openModal('search-modal');
            searchInput.value = '';
            searchResults.innerHTML = '';
            setTimeout(() => searchInput.focus(), 100);
        });

        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            performSearch(searchInput.value);
        });
    }

    /* ===== КАЛЬКУЛЯТОР ИПОТЕКИ (mortgage.html) ===== */

    const mortgageForm = document.getElementById('mortgage-form');

    if (mortgageForm) {
        const priceInput = document.getElementById('mortgage-price');
        const downInput  = document.getElementById('mortgage-downpayment');
        const yearsInput = document.getElementById('mortgage-years');
        const rateInput  = document.getElementById('mortgage-rate');

        const loanAmountEl   = document.getElementById('mortgage-loan-amount');
        const monthlyEl      = document.getElementById('mortgage-monthly');
        const overpaymentEl  = document.getElementById('mortgage-overpayment');
        const totalEl        = document.getElementById('mortgage-total');
        const resultsBox = document.getElementById('mortgage-results');

        function formatRoubles(value) {
            if (isNaN(value)) return '—';
            return value.toLocaleString('ru-RU', { maximumFractionDigits: 0 }) + ' ₽';
        }

        mortgageForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const price = parseFloat((priceInput.value || '').replace(',', '.'));
            const down  = parseFloat((downInput.value  || '').replace(',', '.'));
            const years = parseInt((yearsInput.value  || '').replace(',', '.'), 10);
            const rate  = parseFloat((rateInput.value || '').replace(',', '.'));

            if (!price || price <= 0 || isNaN(price)) {
                alert('Укажите корректную стоимость квартиры.');
                return;
            }
            if (isNaN(down) || down < 0) {
                alert('Укажите корректный первоначальный взнос.');
                return;
            }
            if (!years || years <= 0 || isNaN(years)) {
                alert('Укажите корректный срок кредита (лет).');
                return;
            }
            if (isNaN(rate) || rate < 0) {
                alert('Укажите корректную процентную ставку.');
                return;
            }

            const loanAmount = price - down;
            if (loanAmount <= 0) {
                alert('Сумма кредита должна быть больше нуля. Уменьшите первоначальный взнос.');
                return;
            }

            const months = years * 12;
            const monthlyRate = rate / 100 / 12;

            let monthlyPayment;
            if (monthlyRate === 0) {
                monthlyPayment = loanAmount / months;
            } else {
                const k = monthlyRate;
                const factor = Math.pow(1 + k, months);
                monthlyPayment = loanAmount * (k * factor) / (factor - 1);
            }

            const totalPayment = monthlyPayment * months;
            const overpayment = totalPayment - loanAmount;

            loanAmountEl.textContent  = formatRoubles(loanAmount);
            monthlyEl.textContent     = formatRoubles(monthlyPayment);
            overpaymentEl.textContent = formatRoubles(overpayment);
            totalEl.textContent       = formatRoubles(totalPayment);
                    if (resultsBox) {
            resultsBox.classList.add('mortgage-calculator__results--calculated');
        }
            
        });
    }

});
