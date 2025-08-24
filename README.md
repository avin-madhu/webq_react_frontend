# 📚 Student Learning Recommendation System (Frontend) 

A React + Tailwind web application that helps students track their **performance**, get **personalized recommendations**, and explore **learning resources**.  

Built with:  
- ⚛️ React  
- 🎨 Tailwind CSS  
- 🧭 React Router  
- 🎯 Context API (global state management)  
- ✨ Lucide Icons  

---

## 🚀 Features  

- **Student Switching**  
  - Dropdown to switch between students and view personalized data.  

- **Performance Dashboard**  
  - Displays scores, progress, and performance insights.  

- **Recommendations**  
  - Get AI-generated recommendations for resources.  

- **Resource Details**  
  - Detailed view of each learning resource.  

- **Global State Management**  
  - Managed via `AppContext` for seamless state sharing.  

---

## 📂 Project Structure  

```bash
src/
│── App.jsx                 # Main app with routes
│── AppContext.jsx          # Context provider (students, performance, resources)
│── components/             # Reusable components
│   ├── Header.jsx
│   ├── PerformanceCard.jsx
│   ├── RecommendationCard.jsx
│   ├── LoadingSpinner.jsx
│   └── ErrorMessage.jsx
│── pages/                  # Pages for routing
│   ├── DashboardPage.jsx
│   ├── RecommendationsPage.jsx
│   └── ResourceDetailPage.jsx
│── apiService.js           # API service (students, resources, recommendations)
```
## Setup and Installation

if the backend is up and running you can just connect to the hosted frontend : [frontEnd Link](https://webq-react-frontend.vercel.app)

1. Clone the repository

```
git clone https://github.com/your-username/learning-paths-dashboard.git
cd learning-paths-dashboard
```

2. Install dependencies

```
npm install

```

3. Install required packages

```
npm install react-router-dom lucide-react
```


4. Run the development server

```
npm run dev
```
after that just open in browser:

http://localhost:5173

