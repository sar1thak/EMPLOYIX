
const employees = [
  {
    id: 1,
    firstname: "Aarav",
    email: "employee1@company.com",
    password: "1234",

    taskNumbers: {
      active: 1,
      newTask: 1,
      completed: 1,
      failed: 1
    },

    tasks: [
      {
        id: 101,
        status: "newTask",
        taskTitle: "Design Landing Page",
        taskDescription: "Create UI design for new landing page",
        taskDate: "2026-02-10",
        category: "Design"
      },
      {
        id: 102,
        status: "completed",
        taskTitle: "Fix Login Bug",
        taskDescription: "Resolve authentication issue",
        taskDate: "2026-02-08",
        category: "Development"
      },
      {
        id: 103,
        status: "failed",
        taskTitle: "API Integration",
        taskDescription: "Integrate payment gateway API",
        taskDate: "2026-02-07",
        category: "Backend"
      },
      {
        id: 104,
        status: "active",
        taskTitle: "Client Discussion",
        taskDescription: "Discuss landing page with team",
        taskDate: "2026-02-12",
        category: "Meeting"
      }
    ]
  },

  {
    id: 2,
    firstname: "Vihaan",
    email: "employee2@company.com",
    password: "1234",

    taskNumbers: {
      active: 1,
      newTask: 1,
      completed: 1,
      failed: 1
    },

    tasks: [
      {
        id: 201,
        status: "newTask",
        taskTitle: "Write Unit Tests",
        taskDescription: "Cover auth module with tests",
        taskDate: "2026-02-11",
        category: "Testing"
      },
      {
        id: 202,
        status: "active",
        taskTitle: "Dashboard UI",
        taskDescription: "Implement dashboard components",
        taskDate: "2026-02-12",
        category: "Frontend"
      },
      {
        id: 203,
        status: "completed",
        taskTitle: "Database Setup",
        taskDescription: "Configure MongoDB collections",
        taskDate: "2026-02-05",
        category: "Database"
      },
      {
        id: 204,
        status: "failed",
        taskTitle: "Performance Optimization",
        taskDescription: "Improve API response time",
        taskDate: "2026-02-06",
        category: "Backend"
      }
    ]
  },

  {
    id: 3,
    firstname: "Rohan",
    email: "employee3@company.com",
    password: "1234",

    taskNumbers: {
      active: 1,
      newTask: 1,
      completed: 1,
      failed: 0
    },

    tasks: [
      {
        id: 301,
        status: "newTask",
        taskTitle: "Create Wireframes",
        taskDescription: "Sketch app wireframes",
        taskDate: "2026-02-09",
        category: "Design"
      },
      {
        id: 302,
        status: "completed",
        taskTitle: "Refactor Code",
        taskDescription: "Clean up legacy modules",
        taskDate: "2026-02-03",
        category: "Development"
      },
      {
        id: 303,
        status: "active",
        taskTitle: "Client Meeting",
        taskDescription: "Discuss feature requirements",
        taskDate: "2026-02-13",
        category: "Management"
      }
    ]
  },

  {
    id: 4,
    firstname: "Kunal",
    email: "employee4@company.com",
    password: "1234",

    taskNumbers: {
      active: 1,
      newTask: 1,
      completed: 1,
      failed: 1
    },

    tasks: [
      {
        id: 401,
        status: "completed",
        taskTitle: "Deploy Backend",
        taskDescription: "Deploy server to production",
        taskDate: "2026-02-02",
        category: "DevOps"
      },
      {
        id: 402,
        status: "newTask",
        taskTitle: "Implement Auth",
        taskDescription: "Add JWT authentication",
        taskDate: "2026-02-14",
        category: "Backend"
      },
      {
        id: 403,
        status: "failed",
        taskTitle: "Bug Fix Sprint",
        taskDescription: "Resolve reported issues",
        taskDate: "2026-02-01",
        category: "Maintenance"
      },
      {
        id: 404,
        status: "active",
        taskTitle: "Security Check",
        taskDescription: "Audit auth module",
        taskDate: "2026-02-16",
        category: "Security"
      }
    ]
  },

  {
    id: 5,
    firstname: "Ishita",
    email: "employee5@company.com",
    password: "1234",

    taskNumbers: {
      active: 1,
      newTask: 1,
      completed: 1,
      failed: 1
    },

    tasks: [
      {
        id: 501,
        status: "newTask",
        taskTitle: "Build Forms",
        taskDescription: "Create reusable form components",
        taskDate: "2026-02-10",
        category: "Frontend"
      },
      {
        id: 502,
        status: "completed",
        taskTitle: "Setup CI/CD",
        taskDescription: "Configure GitHub Actions",
        taskDate: "2026-02-04",
        category: "DevOps"
      },
      {
        id: 503,
        status: "active",
        taskTitle: "Documentation",
        taskDescription: "Write API docs",
        taskDate: "2026-02-15",
        category: "Documentation"
      },
      {
        id: 504,
        status: "failed",
        taskTitle: "Server Migration",
        taskDescription: "Move server to new host",
        taskDate: "2026-02-06",
        category: "Infrastructure"
      }
    ]
  }
];





const admin = [
  {
    id: 100,
    email: "admin@company.com",
    password: "1234"
  }
];

export const setLocalStorage=()=>{
    localStorage.setItem('employees',JSON.stringify(employees))
    localStorage.setItem('admin',JSON.stringify(admin))
}

export const getLocalStorage=()=>{
    const employees = JSON.parse(localStorage.getItem('employees'))
    const admin = JSON.parse(localStorage.getItem('admin'))

    return {employees,admin}
    
}
