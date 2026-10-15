export const INITIAL_NOTES = [
  {
    id: "note_98234",
    courseCode: "CS301",
    courseName: "Operating Systems",
    title: "Operating Systems - Deadlocks & Semaphores Complete Notes",
    description: "Handwritten lecture notes covering Unit 3 with solved numericals on Banker's Algorithm and dining philosophers problem.",
    semester: 5,
    department: "Computer Science",
    fileType: "application/pdf",
    fileSizeKB: 3420,
    blobPath: "cs301/2026/note_98234_deadlocks.pdf",
    uploadedBy: {
      userId: "stu_1042",
      name: "Aarav Sharma",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
    },
    tags: ["deadlocks", "semaphores", "midterm-prep", "bankers-algo"],
    upvotes: 42,
    downloads: 189,
    createdAt: "2026-10-10T10:30:00Z"
  },
  {
    id: "note_87123",
    courseCode: "CS402",
    courseName: "Cloud Computing & Distributed Systems",
    title: "Azure Serverless Architecture & Cosmos DB Cheatsheet",
    description: "Condensed summary of Azure Static Web Apps, Blob SAS valet tokens, Cosmos DB RU optimization, and microservice decoupling.",
    semester: 7,
    department: "Computer Science",
    fileType: "application/pdf",
    fileSizeKB: 1840,
    blobPath: "cs402/2026/note_87123_azure_cheatsheet.pdf",
    uploadedBy: {
      userId: "stu_2011",
      name: "Rhea Sen",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces"
    },
    tags: ["azure", "serverless", "cloud", "cosmos-db"],
    upvotes: 88,
    downloads: 412,
    createdAt: "2026-10-12T14:15:00Z"
  },
  {
    id: "note_65412",
    courseCode: "AI305",
    courseName: "Machine Learning & Neural Networks",
    title: "Backpropagation & Gradient Descent Derivations with Python Code",
    description: "Complete mathematical proofs for vector calculus in backprop, activation functions (ReLU, GELU, Softmax), and NumPy walkthrough.",
    semester: 6,
    department: "Artificial Intelligence",
    fileType: "application/pdf",
    fileSizeKB: 4120,
    blobPath: "ai305/2026/note_65412_backpropagation.pdf",
    uploadedBy: {
      userId: "stu_3391",
      name: "Dev Patel",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=faces"
    },
    tags: ["machine-learning", "backprop", "deep-learning", "python"],
    upvotes: 65,
    downloads: 295,
    createdAt: "2026-10-08T09:20:00Z"
  },
  {
    id: "note_54219",
    courseCode: "EC204",
    courseName: "Digital Signal Processing",
    title: "FFT, DFT & Butterworth Filter Design Lecture Summaries",
    description: "Step-by-step filter design numericals with frequency response graphs and previous 5 years university exam questions solved.",
    semester: 4,
    department: "Electronics & Communication",
    fileType: "application/pdf",
    fileSizeKB: 2910,
    blobPath: "ec204/2026/note_54219_dsp_filters.pdf",
    uploadedBy: {
      userId: "stu_1145",
      name: "Ananya Iyer",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=faces"
    },
    tags: ["dsp", "fft", "filters", "exam-prep"],
    upvotes: 31,
    downloads: 142,
    createdAt: "2026-10-05T16:45:00Z"
  },
  {
    id: "note_41982",
    courseCode: "CS201",
    courseName: "Data Structures & Algorithms",
    title: "Graphs: Dijkstra, Bellman-Ford, Floyd-Warshall & MST Algorithms",
    description: "Clean diagrams comparing time and space complexities, adjacency lists vs matrices, and edge-relaxation cycle detection tricks.",
    semester: 3,
    department: "Computer Science",
    fileType: "application/pdf",
    fileSizeKB: 2450,
    blobPath: "cs201/2026/note_41982_graph_algos.pdf",
    uploadedBy: {
      userId: "stu_4082",
      name: "Karan Verma",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces"
    },
    tags: ["dsa", "graphs", "dijkstra", "algorithms"],
    upvotes: 94,
    downloads: 620,
    createdAt: "2026-09-28T11:00:00Z"
  },
  {
    id: "note_33190",
    courseCode: "MA102",
    courseName: "Engineering Mathematics II",
    title: "Differential Equations, Laplace Transforms & Fourier Series Formulas",
    description: "One-sheet formula chart plus 20 step-by-step solved boundary value problems commonly asked in semester finals.",
    semester: 2,
    department: "Basic Sciences & Humanities",
    fileType: "application/pdf",
    fileSizeKB: 1530,
    blobPath: "ma102/2026/note_33190_laplace_formulas.pdf",
    uploadedBy: {
      userId: "stu_5192",
      name: "Sneha Mukherjee",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces"
    },
    tags: ["math", "laplace", "formulas", "finals"],
    upvotes: 53,
    downloads: 380,
    createdAt: "2026-09-15T08:30:00Z"
  }
];

export const DEPARTMENTS = [
  "All Departments",
  "Computer Science",
  "Artificial Intelligence",
  "Electronics & Communication",
  "Basic Sciences & Humanities",
  "Information Technology",
  "Mechanical Engineering"
];

export const SEMESTERS = [
  { label: "All Semesters", value: "all" },
  { label: "Sem 1", value: 1 },
  { label: "Sem 2", value: 2 },
  { label: "Sem 3", value: 3 },
  { label: "Sem 4", value: 4 },
  { label: "Sem 5", value: 5 },
  { label: "Sem 6", value: 6 },
  { label: "Sem 7", value: 7 },
  { label: "Sem 8", value: 8 },
];
