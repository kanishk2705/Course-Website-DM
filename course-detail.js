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

    // 2. Load the Course Database (Same as Dashboard, but with descriptions added)
    const courses = [
        {
            id: 'ds101',
            title: 'Statistical Foundations for Data Science',
            instructor: 'Dr. Alan Turing',
            category: 'Data Science',
            price: '$49.99',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
            description: 'Dive deep into the mathematical foundations required for advanced data analysis. You will master probability, statistical significance, and hypothesis testing to make data-driven decisions.'
        },
        {
            id: 'ai201',
            title: 'Neural Networks and Deep Learning',
            instructor: 'Geoffrey Hinton',
            category: 'Artificial Intelligence',
            price: '$89.99',
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
            description: 'Step into the world of AI R&D. Learn how to build, train, and optimize deep neural networks using modern frameworks to solve complex pattern recognition problems.'
        },
        {
            id: 'ml301',
            title: 'Movie Success Predictor Masterclass',
            instructor: 'Yann LeCun',
            category: 'Machine Learning',
            price: '$59.99',
            image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
            description: 'Build a complete machine learning pipeline. You will scrape data, engineer features, and train models to predict box office revenue and audience reception metrics.'
        },
        {
            id: 'iot401',
            title: 'Predictive Maintenance for Industrial IoT',
            instructor: 'Andrew Ng',
            category: 'IoT',
            price: '$79.99',
            image: 'https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?auto=format&fit=crop&w=800&q=80',
            description: 'Apply machine learning to sensor data. Learn how to predict equipment failures before they happen, a highly sought-after skill in the industrial automation sector.'
        }
    ];

    // 3. Find the Selected Course
    const selectedCourseId = localStorage.getItem('selectedCourse');
    const course = courses.find(c => c.id === selectedCourseId);

    if (!course) {
        alert("Course not found!");
        window.location.href = 'dashboard.html';
        return;
    }

    // 4. Populate the HTML with Course Data
    document.getElementById('detail-category').textContent = course.category;
    document.getElementById('detail-title').textContent = course.title;
    document.getElementById('detail-instructor').textContent = `Instructor: ${course.instructor}`;
    document.getElementById('detail-price').textContent = course.price;
    document.getElementById('detail-image').src = course.image;
    document.getElementById('detail-desc').textContent = course.description;

    // 5. Enrollment Logic (Audit vs Buy)
    const btnAudit = document.getElementById('btn-audit');
    const btnBuy = document.getElementById('btn-buy');

    // Helper function to enroll user
    function enrollUser(enrollmentType) {
        let users = JSON.parse(localStorage.getItem('users'));
        let userProfile = users[currentUser.email];

        // Ensure array exists
        if (!userProfile.purchasedCourses) {
            userProfile.purchasedCourses = [];
        }

        // Check if already enrolled
        const alreadyEnrolled = userProfile.purchasedCourses.find(c => c.id === course.id);

        if (alreadyEnrolled) {
            alert(`You are already enrolled in this course (${alreadyEnrolled.type} track).`);
            window.location.href = 'my-courses.html';
            return;
        }

        // Add to user's profile
        userProfile.purchasedCourses.push({
            id: course.id,
            title: course.title,
            type: enrollmentType, // 'audit' or 'certified'
            progress: 0
        });

        // Save back to database
        localStorage.setItem('users', JSON.stringify(users));

        alert(`Successfully enrolled in ${course.title} (${enrollmentType} track)!`);
        window.location.href = 'my-courses.html';
    }

    btnAudit.addEventListener('click', () => enrollUser('audit'));
    btnBuy.addEventListener('click', () => enrollUser('certified'));
});