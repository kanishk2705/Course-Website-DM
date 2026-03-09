document.addEventListener('DOMContentLoaded', () => {

    // 1. Authentication Check
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        // If no user is logged in, kick them back to the login page
        window.location.href = 'login.html';
        return;
    }

    // Greet the user
    document.getElementById('user-greeting').textContent = `Hi, ${currentUser.name.split(' ')[0]}!`;

    // 2. Logout Logic
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });

    // 3. Course Database (Mock Data)
    const courses = [
        {
            id: 'ds101',
            title: 'Statistical Foundations for Data Science',
            instructor: 'Dr. Alan Turing',
            category: 'Data Science',
            rating: 4.8,
            price: '$49.99',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 'ai201',
            title: 'Neural Networks and Deep Learning',
            instructor: 'Geoffrey Hinton',
            category: 'Artificial Intelligence',
            rating: 4.9,
            price: '$89.99',
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 'ml301',
            title: 'Movie Success Predictor Masterclass',
            instructor: 'Yann LeCun',
            category: 'Machine Learning',
            rating: 4.7,
            price: '$59.99',
            image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 'iot401',
            title: 'Predictive Maintenance for Industrial IoT',
            instructor: 'Andrew Ng',
            category: 'IoT',
            rating: 4.9,
            price: '$79.99',
            image: 'https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?auto=format&fit=crop&w=400&q=80'
        }
    ];

    const courseGrid = document.getElementById('course-grid');
    const noResults = document.getElementById('no-results');
    const sectionTitle = document.getElementById('section-title');

    // 4. Render Courses Function
    function renderCourses(coursesToRender) {
        courseGrid.innerHTML = ''; // Clear current courses

        if (coursesToRender.length === 0) {
            noResults.classList.remove('hidden');
            return;
        }

        noResults.classList.add('hidden');

        coursesToRender.forEach(course => {
            const card = document.createElement('div');
            card.className = 'course-card';
            // When clicked, save the selected course ID and redirect to details page
            card.onclick = () => {
                localStorage.setItem('selectedCourse', course.id);
                window.location.href = 'course-detail.html';
            };

            card.innerHTML = `
                <img src="${course.image}" alt="${course.title}" class="course-image">
                <div class="course-info">
                    <span class="course-category">${course.category}</span>
                    <h3 class="course-title">${course.title}</h3>
                    <p class="course-instructor">by ${course.instructor}</p>
                    <div class="course-meta">
                        <span class="course-rating">⭐ ${course.rating}</span>
                        <span class="course-price">${course.price}</span>
                    </div>
                </div>
            `;
            courseGrid.appendChild(card);
        });
    }

    // Initial render
    renderCourses(courses);

    // 5. Search Functionality
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = courses.filter(course =>
            course.title.toLowerCase().includes(searchTerm) ||
            course.instructor.toLowerCase().includes(searchTerm) ||
            course.category.toLowerCase().includes(searchTerm)
        );
        sectionTitle.textContent = searchTerm ? 'Search Results' : 'Top Rated Courses';

        // Reset category chips when searching
        document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        document.querySelector('.chip[data-category="All"]').classList.add('active');

        renderCourses(filtered);
    });

    // 6. Category Filter Functionality
    const chips = document.querySelectorAll('.chip');
    chips.forEach(chip => {
        chip.addEventListener('click', (e) => {
            // UI Update
            chips.forEach(c => c.classList.remove('active'));
            e.target.classList.add('active');

            // Clear search
            searchInput.value = '';

            // Filter Logic
            const category = e.target.getAttribute('data-category');
            if (category === 'All') {
                sectionTitle.textContent = 'Top Rated Courses';
                renderCourses(courses);
            } else {
                sectionTitle.textContent = `${category} Courses`;
                const filtered = courses.filter(course => course.category === category);
                renderCourses(filtered);
            }
        });
    });
});