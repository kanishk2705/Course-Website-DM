document.addEventListener('DOMContentLoaded', () => {

    // 1. Authentication Check
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Logout Logic
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });

    // 2. The Course Database (To look up details of enrolled courses)
    const courseDatabase = [
        {
            id: 'ds101', title: 'Statistical Foundations for Data Science', instructor: 'Dr. Alan Turing',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 'ai201', title: 'Neural Networks and Deep Learning', instructor: 'Geoffrey Hinton',
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 'ml301', title: 'Movie Success Predictor Masterclass', instructor: 'Yann LeCun',
            image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 'iot401', title: 'Predictive Maintenance for Industrial IoT', instructor: 'Andrew Ng',
            image: 'https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?auto=format&fit=crop&w=400&q=80'
        }
    ];

    // 3. Fetch User's Enrolled Courses
    const users = JSON.parse(localStorage.getItem('users'));
    const userProfile = users[currentUser.email];
    const enrolledCourses = userProfile.purchasedCourses || [];

    const enrolledGrid = document.getElementById('enrolled-grid');
    const emptyState = document.getElementById('empty-state');

    // 4. Render Logic
    if (enrolledCourses.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        enrolledCourses.forEach(enrollment => {
            // Find the full course details from our database
            const courseDetails = courseDatabase.find(c => c.id === enrollment.id);

            if (courseDetails) {
                const card = document.createElement('div');
                card.className = 'my-course-card';

                // Format the enrollment type for display
                const trackBadge = enrollment.type === 'certified' ? '🏆 Certified Track' : '🎧 Audit Mode';

                card.innerHTML = `
                    <img src="${courseDetails.image}" alt="${courseDetails.title}" class="my-course-image">
                    <div class="my-course-info">
                        <span class="track-badge ${enrollment.type}">${trackBadge}</span>
                        <h3 class="my-course-title">${courseDetails.title}</h3>
                        <p class="my-course-instructor">${courseDetails.instructor}</p>
                        
                        <div class="progress-container">
                            <div class="progress-bar" style="width: ${enrollment.progress}%;"></div>
                        </div>
                        <span class="progress-text">${enrollment.progress}% Complete</span>
                        
                        <button class="btn-primary start-course-btn" data-id="${enrollment.id}">
                            ${enrollment.progress === 0 ? 'Start Course' : 'Resume Course'}
                        </button>
                    </div>
                `;
                enrolledGrid.appendChild(card);
            }
        });

        // Add event listeners to the "Start/Resume" buttons
        document.querySelectorAll('.start-course-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const courseId = e.target.getAttribute('data-id');
                // Save which course video to play
                localStorage.setItem('playingCourse', courseId);
                window.location.href = 'player.html';
            });
        });
    }
});