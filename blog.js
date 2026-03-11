// The Central Article Database
const blogDatabase = [
    {
        id: 'deploy-rf-streamlit',
        category: 'Deployment',
        title: 'Deploying a Digital Detox Predictor with Random Forest & Streamlit',
        date: 'March 8, 2026',
        readTime: '12 min read',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
        excerpt: 'Learn how to take an end-to-end machine learning model from a local Jupyter environment to a live, interactive web application.',
        content: `
            <h2>The Deployment Gap in Machine Learning</h2>
            <p>One of the biggest hurdles for engineering students and junior data scientists is crossing the chasm between a local Jupyter Notebook and a production environment. Training a highly accurate Random Forest model to predict user behavior (like the success of a digital detox protocol) is an excellent first step. However, if that model lives exclusively on your hard drive, its real-world impact is zero.</p>
            <p>In this comprehensive guide, we will bridge that gap. We will serialize a trained machine learning model and construct an interactive web frontend using Streamlit, allowing any user across the globe to input their screen time metrics and receive real-time predictions.</p>
            
            <h2>Step 1: Serializing the Random Forest Model</h2>
            <p>Before deployment, your model must be saved in a format that can be instantly loaded by a web server without retraining. Random Forest ensembles, which rely on the aggregated votes of multiple decision trees, can become quite large in memory. We utilize the <code>joblib</code> library, which is highly optimized for Python objects containing large NumPy arrays.</p>
            <pre><code>import joblib\nfrom sklearn.ensemble import RandomForestClassifier\n\n# Assuming 'clf' is your highly-tuned model\n# Save the model to disk\njoblib.dump(clf, 'digital_detox_rf_model.pkl')\nprint("Model successfully serialized!")</code></pre>

            <div class="in-article-cta">
                <h3>Want to master the math behind Random Forest?</h3>
                <p>Understand Information Gain, Gini Impurity, and ensemble mathematics in our Statistical Foundations course.</p>
                <a href="register.html" class="btn-primary">Start Free Audit</a>
            </div>

            <h2>Step 2: Architecting the Streamlit Interface</h2>
            <p>Streamlit revolutionizes deployment by allowing developers to build interactive UI components using purely Python. No HTML, CSS, or complex React state management is required for the initial prototype.</p>
            <p>We will construct a sidebar for continuous input variables (like daily screen time and notification frequency) and categorical dropdowns for user demographics.</p>
            <pre><code>import streamlit as st\nimport joblib\nimport numpy as np\n\n# 1. Page Configuration\nst.set_page_config(page_title="Detox Predictor", layout="centered")\nst.title("📱 Digital Detox Success Predictor")\n\n# 2. Caching the Model Load (Crucial for App Speed)\n@st.cache_resource\ndef load_model():\n    return joblib.load('digital_detox_rf_model.pkl')\n\nmodel = load_model()\n\n# 3. User Interface Components\nst.sidebar.header("User Metrics")\nscreen_time = st.sidebar.slider("Daily Screen Time (Hours)", 0.0, 24.0, 5.5)\nnotifications = st.sidebar.number_input("Average Daily Notifications", min_value=0, max_value=1000, value=150)\nwillpower_rating = st.sidebar.selectbox("Self-Reported Willpower", [1, 2, 3, 4, 5])\n\n# 4. Prediction Logic\nif st.button("Predict Detox Success"): \n    # Format input to match training data shape (1 sample, n features)\n    input_features = np.array([[screen_time, notifications, willpower_rating]])\n    prediction = model.predict(input_features)\n    probability = model.predict_proba(input_features)[0][1]\n    \n    if prediction[0] == 1:\n        st.success(f"High Probability of Success! Confidence: {probability:.1%}")\n    else:\n        st.error(f"High Risk of Relapse. Confidence of failure: {(1-probability):.1%}")</code></pre>
            
            <h2>Step 3: State Management and Cloud Deployment</h2>
            <p>Once your <code>app.py</code> script is functioning locally via <code>streamlit run app.py</code>, the final step is pushing the repository to GitHub and connecting it to Streamlit Community Cloud. Ensure your <code>requirements.txt</code> file strictly versions your dependencies (e.g., <code>scikit-learn==1.3.0</code>) to prevent environment mismatches during the server build phase.</p>
            <p>By deploying your code, you transform a theoretical statistical exercise into a tangible portfolio asset.</p>
        `
    },
    {
        id: 'movie-success-lgbm',
        category: 'Machine Learning',
        title: 'Predicting Movie Success: Advanced Feature Engineering for LightGBM',
        date: 'March 11, 2026',
        readTime: '14 min read',
        image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80',
        excerpt: 'A deep dive into transforming unstructured cinematic data into high-signal numerical features for gradient boosting frameworks.',
        content: `
            <h2>The Complexity of Cinematic Data</h2>
            <p>Predicting box office revenue and audience reception is a notoriously difficult machine learning problem. A movie's success is governed by complex, non-linear interactions between its budget, release timing, ensemble cast, and cultural zeitgeist. Standard linear models often fail here.</p>
            <p>To capture these complex interactions, we utilize LightGBM (Light Gradient Boosting Machine). However, LightGBM is only as powerful as the features it consumes. We must move beyond raw data like "Runtime" and perform deep feature engineering.</p>
            
            <h2>1. Target Encoding for High-Cardinality Categoricals</h2>
            <p>A dataset might contain thousands of unique directors and actors. Using One-Hot Encoding for the 'Director' column would result in a massive, sparse matrix that destroys tree-based model efficiency. Instead, we use Target Encoding (Mean Encoding) with smoothing.</p>
            <p>We replace the director's name with the historical average box office return of their previous films, calculating a prior weight to prevent overfitting on directors with only one film.</p>
            <pre><code>import pandas as pd\nimport category_encoders as ce\n\n# Initialize Target Encoder with smoothing\n# This prevents overfitting on rare categories\nencoder = ce.TargetEncoder(cols=['director', 'lead_actor', 'production_studio'], smoothing=10)\n\n# Fit on training data ONLY to prevent data leakage\nX_train_encoded = encoder.fit_transform(X_train, y_train)\nX_test_encoded = encoder.transform(X_test)</code></pre>
            
            <h2>2. Temporal Feature Extraction</h2>
            <p>The date a movie is released heavily influences its success (e.g., summer blockbusters vs. January "dump months"). We must decompose the <code>Release_Date</code> column into cyclical numerical features.</p>
            <pre><code># Convert to datetime\ndf['release_date'] = pd.to_datetime(df['release_date'])\n\n# Extract base temporal features\ndf['release_month'] = df['release_date'].dt.month\ndf['release_day_of_week'] = df['release_date'].dt.dayofweek\n\n# Apply Sine/Cosine transformations for cyclical nature of months\nimport numpy as np\ndf['month_sin'] = np.sin(2 * np.pi * df['release_month']/12)\ndf['month_cos'] = np.cos(2 * np.pi * df['release_month']/12)</code></pre>

            <div class="in-article-cta">
                <h3>Build This Project From Scratch</h3>
                <p>Join our Movie Success Predictor Masterclass to learn the mathematical theory behind Gradient Boosting.</p>
                <a href="register.html" class="btn-primary">View Course Details</a>
            </div>
            
            <h2>3. Leveraging LightGBM's Native Capabilities</h2>
            <p>Unlike XGBoost, which grows trees level-wise, LightGBM grows trees leaf-wise. It chooses the leaf with the maximum delta loss to grow. This mathematically guarantees lower loss, but makes it prone to overfitting on smaller datasets.</p>
            <p>By explicitly declaring categorical features via the <code>categorical_feature</code> parameter, LightGBM utilizes an exclusive feature bundling (EFB) algorithm to dramatically speed up training while maintaining accuracy.</p>
            <p>Mastering these data preparation techniques is what separates entry-level data analysts from highly sought-after machine learning engineers.</p>
        `
    },
    {
        id: 'iot-nasa-rul',
        category: 'IoT & Data',
        title: 'Predictive Maintenance: Calculating RUL using the NASA Turbofan Dataset',
        date: 'March 15, 2026',
        readTime: '18 min read',
        image: 'https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?auto=format&fit=crop&w=1200&q=80',
        excerpt: 'Master industrial IoT data engineering by calculating Remaining Useful Life (RUL) through piecewise linear degradation models.',
        content: `
            <h2>The Mathematics of Industrial Failure</h2>
            <p>In the realm of Industrial IoT, unexpected hardware failure costs millions of dollars in downtime. The goal of predictive maintenance is not just to detect anomalies, but to predict the exact <i>Remaining Useful Life (RUL)</i> of a machine component before it critically fails.</p>
            <p>We will explore this concept using the famous NASA C-MAPSS (Commercial Modular Aero-Propulsion System Simulation) FD001 dataset, which contains simulated run-to-failure sensor data from multiple turbofan engines.</p>
            
            <h2>1. Ingesting and Understanding the Sensor Matrix</h2>
            <p>The FD001 dataset provides us with 21 different continuous sensor readings (temperature, pressure, fan speed) and 3 operational settings recorded at every operational cycle of the engine. The challenge? The dataset does not explicitly tell us the RUL. We must engineer this target variable ourselves.</p>
            
            <h2>2. The Piecewise Linear RUL Target</h2>
            <p>A naive approach is to assume the engine degrades linearly from cycle 1. However, mechanical engineering principles dictate that engines operate normally for a long period, and only begin degrading after a certain threshold of wear and tear.</p>
            <p>Therefore, we use a piecewise linear degradation model. We "clip" the maximum RUL to a constant value (commonly 125 or 130 cycles), implying that predicting an engine will fail 300 cycles from now is neither necessary nor mathematically reliable.</p>
            <pre><code>import pandas as pd\nimport numpy as np\n\n# Load data (assuming columns are properly named)\ndf = pd.read_csv('train_FD001.txt', sep='\s+', header=None)\n\n# 1. Find the maximum lifecycle for each specific engine ID\nmax_cycles = df.groupby('engine_id')['time_cycle'].max().reset_index()\nmax_cycles.rename(columns={'time_cycle': 'max_cycle'}, inplace=True)\n\n# 2. Merge back to the main dataframe\ndf = df.merge(max_cycles, on=['engine_id'], how='left')\n\n# 3. Calculate true RUL (Max Cycle - Current Cycle)\ndf['RUL_actual'] = df['max_cycle'] - df['time_cycle']\n\n# 4. Apply Piecewise Linear Clipping (Thresholding at 130)\nMAX_RUL = 130\ndf['RUL_target'] = df['RUL_actual'].apply(lambda x: MAX_RUL if x > MAX_RUL else x)\n\n# Drop intermediate columns\ndf.drop(['max_cycle', 'RUL_actual'], axis=1, inplace=True)</code></pre>
            
            <div class="in-article-cta">
                <h3>Specialize in Industrial AI</h3>
                <p>Learn how to process high-frequency sensor streams and build automated maintenance pipelines.</p>
                <a href="register.html" class="btn-primary">Explore IoT Curriculum</a>
            </div>

            <h2>3. Time-Series Windowing for Sequence Models</h2>
            <p>Because engine degradation is a temporal process, the current state of a sensor is heavily dependent on its past states. If you plan to feed this data into an LSTM (Long Short-Term Memory) or a 1D Convolutional Neural Network, you must convert the tabular 2D data into 3D sequential windows.</p>
            <p>By creating rolling windows (e.g., sequences of 30 past cycles), the model learns the trajectory of the degradation curve, vastly outperforming standard regression algorithms. The ability to manipulate matrix dimensions for sequential deep learning is a core competency for any advanced AI researcher.</p>
        `
    }
];

// Render the blog cards on the directory page
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('blog-grid');
    if (!grid) return; // Exit if not on the blog.html page

    blogDatabase.forEach(article => {
        const card = document.createElement('article');
        card.className = 'blog-card';
        card.innerHTML = `
            <div class="blog-category">${article.category}</div>
            <h2><a href="#" class="article-link" data-id="${article.id}">${article.title}</a></h2>
            <p class="blog-excerpt">${article.excerpt}</p>
            <a href="#" class="read-more article-link" data-id="${article.id}">Read Full Tutorial →</a>
        `;
        grid.appendChild(card);
    });

    // Add click event to save the ID and redirect
    document.querySelectorAll('.article-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const articleId = e.target.getAttribute('data-id');
            localStorage.setItem('currentArticle', articleId);
            window.location.href = 'article.html';
        });
    });
});
// Render the content on the single article page
document.addEventListener('DOMContentLoaded', () => {
    const titleElement = document.getElementById('render-title');
    if (!titleElement) return; // Exit if not on article.html

    const currentArticleId = localStorage.getItem('currentArticle');
    const articleData = blogDatabase.find(a => a.id === currentArticleId);

    if (articleData) {
        document.title = `${articleData.title} | AlgoForge`;
        document.getElementById('render-category').textContent = articleData.category;
        titleElement.textContent = articleData.title;
        document.getElementById('render-date').textContent = `Published on ${articleData.date}`;
        document.getElementById('render-readtime').textContent = articleData.readTime;
        document.getElementById('render-image').src = articleData.image;
        document.getElementById('render-content').innerHTML = articleData.content;
    } else {
        titleElement.textContent = "Article not found.";
        document.getElementById('render-content').innerHTML = "<p>Please return to the tutorials page to select an article.</p>";
    }
});