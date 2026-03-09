document.addEventListener('DOMContentLoaded', () => {

    // 1. Authentication Check
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // 2. The Expanded Course Database (With dynamic modules & MIT open-source videos)
    const courseDatabase = [
        {
            id: 'ds101',
            title: 'Statistical Foundations for Data Science',
            instructor: 'Dr. Alan Turing',
            modules: [
                { title: '1. Introduction to Linear Algebra', duration: '39 mins', url: 'https://archive.org/download/MIT18.06S05_MP4/01.mp4' },
                { title: '2. Elimination with Matrices', duration: '47 mins', url: 'https://archive.org/download/MIT18.06S05_MP4/02.mp4' },
                { title: '3. Multiplication and Inverse Matrices', duration: '46 mins', url: 'https://archive.org/download/MIT18.06S05_MP4/03.mp4' },
                { title: '4. Factorization into A = LU', duration: '48 mins', url: 'https://archive.org/download/MIT18.06S05_MP4/04.mp4' }
            ]
        },
        {
            id: 'ai201',
            title: 'Neural Networks and Deep Learning',
            instructor: 'Geoffrey Hinton',
            modules: [
                { title: '1. Introduction to AI & Search', duration: '50 mins', url: 'https://archive.org/download/MIT6.034F10/MIT6_034F10_lec01_300k.mp4' },
                { title: '2. Optimization and Trees', duration: '51 mins', url: 'https://archive.org/download/MIT6.034F10/MIT6_034F10_lec02_300k.mp4' },
                { title: '3. Neural Networks Basics', duration: '49 mins', url: 'https://archive.org/download/MIT6.034F10/MIT6_034F10_lec12_300k.mp4' },
                { title: '4. Deep Learning & Backpropagation', duration: '52 mins', url: 'https://archive.org/download/MIT6.034F10/MIT6_034F10_lec13_300k.mp4' }
            ]
        },
        {
            id: 'ml301',
            title: 'Movie Success Predictor Masterclass',
            instructor: 'Yann LeCun',
            modules: [
                { title: '1. Algorithmic Thinking & Prediction', duration: '81 mins', url: 'https://archive.org/download/MIT6.046JF05/MIT6_046JF05_lec01_300k.mp4' },
                { title: '2. Divide and Conquer Models', duration: '79 mins', url: 'https://archive.org/download/MIT6.046JF05/MIT6_046JF05_lec02_300k.mp4' },
                { title: '3. Data Sorting & Preprocessing', duration: '83 mins', url: 'https://archive.org/download/MIT6.046JF05/MIT6_046JF05_lec03_300k.mp4' },
                { title: '4. Model Evaluation & Quicksort', duration: '80 mins', url: 'https://archive.org/download/MIT6.046JF05/MIT6_046JF05_lec04_300k.mp4' }
            ]
        },
        {
            id: 'iot401',
            title: 'Predictive Maintenance for Industrial IoT',
            instructor: 'Andrew Ng',
            modules: [
                { title: '1. Introduction to Circuits & Sensors', duration: '49 mins', url: 'https://archive.org/download/MIT6.002S07/MIT6_002S07_lec01_300k.mp4' },
                { title: '2. Signal Processing Basics', duration: '46 mins', url: 'https://archive.org/download/MIT6.002S07/MIT6_002S07_lec02_300k.mp4' },
                { title: '3. Digital Abstraction & Data', duration: '51 mins', url: 'https://archive.org/download/MIT6.002S07/MIT6_002S07_lec03_300k.mp4' },
                { title: '4. System Maintenance & Node Analysis', duration: '48 mins', url: 'https://archive.org/download/MIT6.002S07/MIT6_002S07_lec04_300k.mp4' }
            ]
        }
    ];

    // 3. Find the course they clicked "Start" on
    const playingCourseId = localStorage.getItem('playingCourse');
    const courseInfo = courseDatabase.find(c => c.id === playingCourseId);

    if (!courseInfo) {
        alert("Error loading course video.");
        window.location.href = 'my-courses.html';
        return;
    }

    // Fetch user progress from localStorage
    let users = JSON.parse(localStorage.getItem('users'));
    let userProfile = users[currentUser.email];
    let userCourseData = userProfile.purchasedCourses.find(c => c.id === playingCourseId);

    // 4. Populate the Basic Player UI
    document.getElementById('player-course-title').textContent = courseInfo.title;
    document.getElementById('player-course-instructor').textContent = `Instructor: ${courseInfo.instructor}`;
    document.getElementById('progress-text').textContent = `${userCourseData.progress}% Completed`;

    // 5. Build the Dynamic Playlist and Video Player Logic
    const videoElement = document.getElementById('course-video');
    const moduleListContainer = document.querySelector('.module-list');
    moduleListContainer.innerHTML = ''; // Clear the hardcoded HTML list

    // Load the first video immediately
    videoElement.src = courseInfo.modules[0].url;

    // Create the playlist items dynamically
    courseInfo.modules.forEach((module, index) => {
        const li = document.createElement('li');
        li.className = `module-item ${index === 0 ? 'active' : ''}`;

        li.innerHTML = `
            <span class="play-icon">▶</span>
            <div>
                <h4>${module.title}</h4>
                <p>${module.duration}</p>
            </div>
        `;

        // Add click event to change the video when a module is clicked
        li.addEventListener('click', () => {
            // Update active styling
            document.querySelectorAll('.module-item').forEach(item => item.classList.remove('active'));
            li.classList.add('active');

            // Swap the video source and play
            videoElement.src = module.url;
            videoElement.play();
        });

        moduleListContainer.appendChild(li);
    });

    // 6. "Mark as Complete" Logic
    const completeBtn = document.getElementById('btn-complete');

    if (userCourseData.progress >= 100) {
        completeBtn.textContent = 'Course Completed!';
        completeBtn.disabled = true;
        completeBtn.style.backgroundColor = '#10b981';
    }

    completeBtn.addEventListener('click', () => {
        userCourseData.progress = 100;
        localStorage.setItem('users', JSON.stringify(users));

        document.getElementById('progress-text').textContent = '100% Completed';
        completeBtn.textContent = 'Course Completed!';
        completeBtn.disabled = true;
        completeBtn.style.backgroundColor = '#10b981';

        alert(`Congratulations! You have completed ${courseInfo.title}.`);
    });
});