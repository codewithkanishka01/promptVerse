import { Student, Project, TeamRequest } from '../types';

export const CURRENT_USER: Student = {
  id: 'student-pushkar',
  name: 'Pushkar Singh',
  avatar: 'PS',
  department: 'Computer Science & Engineering',
  year: 'Junior (3rd Year)',
  bio: 'Data Science and AI developer passionate about predictive modeling, graph algorithms, and full-stack integration.',
  skills: [
    { name: 'Python', level: 'Advanced', category: 'Technical', verified: true },
    { name: 'Data Science', level: 'Advanced', category: 'Technical', verified: true },
    { name: 'Machine Learning', level: 'Intermediate', category: 'Technical', verified: true },
    { name: 'Pandas', level: 'Advanced', category: 'Technical' },
    { name: 'FastAPI', level: 'Intermediate', category: 'Technical' },
    { name: 'Research', level: 'Intermediate', category: 'Soft' },
    { name: 'Leadership', level: 'Intermediate', category: 'Soft' }
  ],
  projectsCount: 4,
  featuredProjects: ['Campus Foot-Traffic Heatmap', 'Academic Dropout Predictor', 'Library Occupancy ML'],
  interests: ['AI', 'Data Science', 'Campus Tech', 'Graph Neural Networks'],
  availability: 'Flexible',
  hoursPerWeek: 15,
  experience: [
    {
      title: 'Undergraduate AI Lab',
      role: 'Research Assistant',
      summary: 'Trained tabular models and graph representations for student behavior analytics.',
      duration: 'Aug 2024 - Present'
    },
    {
      title: 'Smart Campus Hackathon 2024',
      role: 'Backend Lead',
      summary: 'Built real-time telemetry ingestion pipeline handling 10k mock campus sensors.',
      duration: 'Oct 2024'
    }
  ],
  privacy: {
    isDiscoverable: true,
    showContact: true,
    matchingOnly: false
  }
};

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'student-aarav',
    name: 'Aarav Sharma',
    avatar: 'AS',
    department: 'Computer Science & Design',
    year: 'Senior (4th Year)',
    bio: 'Product engineer & design system creator. Combines Figma precision with high-performance React and Tailwind interfaces.',
    skills: [
      { name: 'React', level: 'Advanced', category: 'Technical', verified: true },
      { name: 'Figma', level: 'Advanced', category: 'Design', verified: true },
      { name: 'UI/UX', level: 'Advanced', category: 'Design', verified: true },
      { name: 'Next.js', level: 'Intermediate', category: 'Technical' },
      { name: 'Tailwind CSS', level: 'Advanced', category: 'Technical' },
      { name: 'TypeScript', level: 'Intermediate', category: 'Technical' }
    ],
    projectsCount: 5,
    featuredProjects: ['UniFlow Design System', 'Course Scheduler Pro', 'Hostel Laundry Tracker'],
    interests: ['Campus Tech', 'Product Design', 'Web Development', 'Design Systems'],
    availability: 'Weekends',
    hoursPerWeek: 12,
    experience: [
      {
        title: 'TechFlow Labs',
        role: 'Frontend & UI Intern',
        summary: 'Redesigned internal dashboards into interactive web applications used by 5,000+ daily users.',
        duration: 'May 2024 - Jul 2024'
      },
      {
        title: 'DesignSprint 2023',
        role: 'Lead UI/UX Designer',
        summary: 'Winner of First Place for best mobile accessible user interface for visually impaired students.',
        duration: 'Nov 2023'
      }
    ],
    privacy: { isDiscoverable: true, showContact: true, matchingOnly: false }
  },
  {
    id: 'student-priya',
    name: 'Priya Mehta',
    avatar: 'PM',
    department: 'Human-Computer Interaction & Cognitive Science',
    year: 'Junior (3rd Year)',
    bio: 'User researcher and interaction designer focused on accessible campus workflows, user interviews, and rapid wireframing.',
    skills: [
      { name: 'UI/UX', level: 'Advanced', category: 'Design', verified: true },
      { name: 'Research', level: 'Advanced', category: 'Soft', verified: true },
      { name: 'Figma', level: 'Intermediate', category: 'Design', verified: true },
      { name: 'Prototyping', level: 'Advanced', category: 'Design' },
      { name: 'User Testing', level: 'Advanced', category: 'Soft' },
      { name: 'Design Thinking', level: 'Advanced', category: 'Soft' }
    ],
    projectsCount: 6,
    featuredProjects: ['Campus Accessibility Audit', 'HealthTech Patient Portal UI', 'Peer Mentorship Journey Map'],
    interests: ['HealthTech', 'Research', 'Human-Centered AI', 'EdTech'],
    availability: 'Flexible',
    hoursPerWeek: 16,
    experience: [
      {
        title: 'Campus Usability Center',
        role: 'Research Fellow',
        summary: 'Conducted 40+ user interviews to evaluate indoor mapping navigation obstacles for freshers.',
        duration: 'Jan 2024 - Present'
      }
    ],
    privacy: { isDiscoverable: true, showContact: true, matchingOnly: false }
  },
  {
    id: 'student-rahul',
    name: 'Rahul Verma',
    avatar: 'RV',
    department: 'Information Technology',
    year: 'Senior (4th Year)',
    bio: 'Distributed systems architect. Specialized in Node.js, relational and document databases, microservices, and Docker.',
    skills: [
      { name: 'Node.js', level: 'Advanced', category: 'Technical', verified: true },
      { name: 'Database', level: 'Advanced', category: 'Technical', verified: true },
      { name: 'Backend', level: 'Advanced', category: 'Technical', verified: true },
      { name: 'SQL', level: 'Advanced', category: 'Technical' },
      { name: 'MongoDB', level: 'Intermediate', category: 'Technical' },
      { name: 'Docker', level: 'Intermediate', category: 'Technical' },
      { name: 'Express', level: 'Advanced', category: 'Technical' }
    ],
    projectsCount: 4,
    featuredProjects: ['High-Throughput Seat Reservation Engine', 'Campus Club Event Microservices', 'Distributed Cache Server'],
    interests: ['Backend', 'Scalability', 'Cloud Architecture', 'Databases'],
    availability: 'Weekdays',
    hoursPerWeek: 14,
    experience: [
      {
        title: 'University IT Services',
        role: 'Backend Developer',
        summary: 'Engineered database schema optimizations reducing query latency by 45% during semester enrollment rush.',
        duration: 'Aug 2024 - Dec 2024'
      }
    ],
    privacy: { isDiscoverable: true, showContact: true, matchingOnly: false }
  },
  {
    id: 'student-ananya',
    name: 'Ananya Singh',
    avatar: 'AS',
    department: 'Artificial Intelligence & Robotics',
    year: 'Junior (3rd Year)',
    bio: 'Computer Vision researcher and deep learning practitioner. Works with OpenCV, PyTorch, image processing pipelines, and edge AI.',
    skills: [
      { name: 'Python', level: 'Advanced', category: 'Technical', verified: true },
      { name: 'Machine Learning', level: 'Advanced', category: 'Technical', verified: true },
      { name: 'OpenCV', level: 'Advanced', category: 'Technical', verified: true },
      { name: 'CNN', level: 'Advanced', category: 'Technical' },
      { name: 'Image Processing', level: 'Advanced', category: 'Technical' },
      { name: 'PyTorch', level: 'Intermediate', category: 'Technical' }
    ],
    projectsCount: 6,
    featuredProjects: ['Real-time Classroom Attendance Camera', 'Edge Drone Landmark Detection', 'Surgical Tool Segmentation'],
    interests: ['AI', 'Robotics', 'Computer Vision', 'Autonomous Systems'],
    availability: 'Flexible',
    hoursPerWeek: 18,
    experience: [
      {
        title: 'Robotics & Vision Consortium',
        role: 'Core Member',
        summary: 'Trained YOLOv8 and custom CNNs on custom campus indoor dataset for obstacle classification.',
        duration: 'Mar 2024 - Present'
      }
    ],
    privacy: { isDiscoverable: true, showContact: true, matchingOnly: false }
  },
  {
    id: 'student-kabir',
    name: 'Kabir Gupta',
    avatar: 'KG',
    department: 'Computer Science',
    year: 'Sophomore (2nd Year)',
    bio: 'Competitive programmer (Knight on LeetCode) with solid background in Java, C++, algorithms, and backend microservices.',
    skills: [
      { name: 'Java', level: 'Advanced', category: 'Technical', verified: true },
      { name: 'C++', level: 'Advanced', category: 'Technical', verified: true },
      { name: 'Data Structures', level: 'Advanced', category: 'Technical', verified: true },
      { name: 'Spring Boot', level: 'Intermediate', category: 'Technical' },
      { name: 'SQL', level: 'Intermediate', category: 'Technical' }
    ],
    projectsCount: 3,
    featuredProjects: ['Multithreaded Graph Router', 'Algorithmic Trading Backtester', 'Campus Canteen Queue Sim'],
    interests: ['Software Engineering', 'Algorithms', 'High-Performance Systems'],
    availability: 'Weekends',
    hoursPerWeek: 10,
    experience: [
      {
        title: 'ICPC Regional Qualifier',
        role: 'Team Captain',
        summary: 'Secured top 15 rank among 180 university teams.',
        duration: 'Dec 2024'
      }
    ],
    privacy: { isDiscoverable: true, showContact: true, matchingOnly: false }
  },
  {
    id: 'student-riya',
    name: 'Riya Kapoor',
    avatar: 'RK',
    department: 'Business Administration & Tech Management',
    year: 'Senior (4th Year)',
    bio: 'Growth strategist, public speaker, and hackathon pitching master. Bridges technical engineering with go-to-market storytelling.',
    skills: [
      { name: 'Public Speaking', level: 'Advanced', category: 'Soft', verified: true },
      { name: 'Leadership', level: 'Advanced', category: 'Soft', verified: true },
      { name: 'Pitching', level: 'Advanced', category: 'Soft', verified: true },
      { name: 'Marketing', level: 'Intermediate', category: 'Soft' },
      { name: 'Product Management', level: 'Intermediate', category: 'Soft' },
      { name: 'Canva', level: 'Intermediate', category: 'Design' }
    ],
    projectsCount: 7,
    featuredProjects: ['Campus Startup Incubator Demo Day', 'Student Venture Pitch Deck', 'Tech Fest Sponsorship Campaign'],
    interests: ['Startups', 'Growth', 'Venture Capital', 'Product-Led Growth'],
    availability: 'Evenings',
    hoursPerWeek: 12,
    experience: [
      {
        title: 'E-Cell University President',
        role: 'President',
        summary: 'Raised $25,000 in student project grants and coordinated 12 collegiate pitch competitions.',
        duration: '2023 - 2024'
      }
    ],
    privacy: { isDiscoverable: true, showContact: true, matchingOnly: false }
  },
  {
    id: 'student-aditya',
    name: 'Aditya Rao',
    avatar: 'AR',
    department: 'Software Engineering',
    year: 'Junior (3rd Year)',
    bio: 'Cross-platform mobile architect. Builds fluid Android & iOS apps with React Native, Firebase, and real-time offline sync.',
    skills: [
      { name: 'React Native', level: 'Advanced', category: 'Technical', verified: true },
      { name: 'Mobile Dev', level: 'Advanced', category: 'Technical', verified: true },
      { name: 'Firebase', level: 'Advanced', category: 'Technical', verified: true },
      { name: 'TypeScript', level: 'Intermediate', category: 'Technical' },
      { name: 'Redux', level: 'Intermediate', category: 'Technical' }
    ],
    projectsCount: 4,
    featuredProjects: ['Campus Shuttle Live GPS', 'Roommate Expense Splitter', 'Lost & Found Mobile Portal'],
    interests: ['Mobile Apps', 'FinTech', 'Real-Time Systems'],
    availability: 'Weekends',
    hoursPerWeek: 15,
    experience: [
      {
        title: 'TransitHack',
        role: 'Mobile Lead',
        summary: 'Built offline-first routing mobile client with sub-100ms path recalculations.',
        duration: 'Sep 2024'
      }
    ],
    privacy: { isDiscoverable: true, showContact: true, matchingOnly: false }
  },
  {
    id: 'student-neha',
    name: 'Neha Sharma',
    avatar: 'NS',
    department: 'Data Analytics & Applied Statistics',
    year: 'Senior (4th Year)',
    bio: 'Statistical modeling analyst and visual storyteller. Expert in Pandas, Tableau, Power BI, and exploratory data analysis.',
    skills: [
      { name: 'Data Science', level: 'Advanced', category: 'Technical', verified: true },
      { name: 'Pandas', level: 'Advanced', category: 'Technical', verified: true },
      { name: 'Data Analysis', level: 'Advanced', category: 'Technical', verified: true },
      { name: 'Statistics', level: 'Advanced', category: 'Technical' },
      { name: 'Tableau', level: 'Intermediate', category: 'Technical' },
      { name: 'SQL', level: 'Intermediate', category: 'Technical' }
    ],
    projectsCount: 5,
    featuredProjects: ['Campus Energy Conservation Dashboard', 'Course Grading Distribution Model', 'Student Well-being Survey Analytics'],
    interests: ['Data Analysis', 'Climate Tech', 'Predictive Modeling', 'Education Policy'],
    availability: 'Weekdays',
    hoursPerWeek: 14,
    experience: [
      {
        title: 'Institutional Research Office',
        role: 'Data Intern',
        summary: 'Synthesized 5 years of historical academic records to forecast facility utilization rates.',
        duration: 'Jun 2024 - Dec 2024'
      }
    ],
    privacy: { isDiscoverable: true, showContact: true, matchingOnly: false }
  },
  {
    id: 'student-arjun',
    name: 'Arjun Malhotra',
    avatar: 'AM',
    department: 'Information Security',
    year: 'Senior (4th Year)',
    bio: 'Security researcher and systems administrator. Passionate about API authentication, pen testing, Linux hardening, and zero-trust networks.',
    skills: [
      { name: 'Cybersecurity', level: 'Advanced', category: 'Technical', verified: true },
      { name: 'Linux', level: 'Advanced', category: 'Technical', verified: true },
      { name: 'Networking', level: 'Intermediate', category: 'Technical' },
      { name: 'Python', level: 'Intermediate', category: 'Technical' },
      { name: 'Docker', level: 'Intermediate', category: 'Technical' }
    ],
    projectsCount: 3,
    featuredProjects: ['OAuth2 Secure Campus Gateway', 'Intrusion Detection Honeypot', 'Automated Vulnerability Scanner'],
    interests: ['Security', 'Open Source', 'Cryptography', 'Cloud Infrastructure'],
    availability: 'Flexible',
    hoursPerWeek: 12,
    experience: [
      {
        title: 'CyberDefend Student Chapter',
        role: 'Lead Security Auditor',
        summary: 'Conducted ethical vulnerability assessments for 6 student club websites and fixed 14 critical issues.',
        duration: '2023 - 2024'
      }
    ],
    privacy: { isDiscoverable: true, showContact: true, matchingOnly: false }
  },
  {
    id: 'student-meera',
    name: 'Meera Iyer',
    avatar: 'MI',
    department: 'Technical Communications & English',
    year: 'Junior (3rd Year)',
    bio: 'Technical writer and documentation lead. Excels at converting complex architectural schemas into crystal-clear developer documentation.',
    skills: [
      { name: 'Content Writing', level: 'Advanced', category: 'Soft', verified: true },
      { name: 'Communication', level: 'Advanced', category: 'Soft', verified: true },
      { name: 'Research', level: 'Advanced', category: 'Soft', verified: true },
      { name: 'Documentation', level: 'Advanced', category: 'Soft' },
      { name: 'SEO', level: 'Intermediate', category: 'Soft' },
      { name: 'Figma', level: 'Beginner', category: 'Design' }
    ],
    projectsCount: 8,
    featuredProjects: ['OpenSource API Reference Guide', 'Campus Research Journal Editor', 'Hackathon Whitepaper'],
    interests: ['Documentation', 'EdTech', 'Open Source', 'Knowledge Graphs'],
    availability: 'Evenings',
    hoursPerWeek: 10,
    experience: [
      {
        title: 'Google Season of Docs Mentee',
        role: 'Technical Writer',
        summary: 'Authored complete tutorial series for an open-source data visualization library.',
        duration: 'Summer 2024'
      }
    ],
    privacy: { isDiscoverable: true, showContact: true, matchingOnly: false }
  },
  {
    id: 'student-dev',
    name: 'Dev Patel',
    avatar: 'DP',
    department: 'Computer Engineering',
    year: 'Sophomore (2nd Year)',
    bio: 'Cross-platform UI developer with focus on Flutter, Dart, state management, and modern component architecture.',
    skills: [
      { name: 'Flutter', level: 'Intermediate', category: 'Technical', verified: true },
      { name: 'Dart', level: 'Intermediate', category: 'Technical', verified: true },
      { name: 'UI/UX', level: 'Intermediate', category: 'Design' },
      { name: 'Firebase', level: 'Intermediate', category: 'Technical' },
      { name: 'Git', level: 'Advanced', category: 'Technical' }
    ],
    projectsCount: 2,
    featuredProjects: ['Campus Habit Tracker', 'QuickQuiz Student Flashcards'],
    interests: ['Cross-platform Dev', 'Mobile UI', 'EdTech'],
    availability: 'Weekends',
    hoursPerWeek: 12,
    experience: [
      {
        title: 'Mobile Dev Guild',
        role: 'Junior Developer',
        summary: 'Contributed 3 Flutter widgets to university library app.',
        duration: 'Oct 2024'
      }
    ],
    privacy: { isDiscoverable: true, showContact: true, matchingOnly: false }
  },
  {
    id: 'student-simran',
    name: 'Simran Kaur',
    avatar: 'SK',
    department: 'Data Science & Machine Learning',
    year: 'Senior (4th Year)',
    bio: 'Deep learning specialist focused on transformers, NLP, PyTorch, and TensorFlow architectures. Researching low-latency model inference.',
    skills: [
      { name: 'TensorFlow', level: 'Advanced', category: 'Technical', verified: true },
      { name: 'PyTorch', level: 'Advanced', category: 'Technical', verified: true },
      { name: 'Machine Learning', level: 'Advanced', category: 'Technical', verified: true },
      { name: 'Python', level: 'Advanced', category: 'Technical', verified: true },
      { name: 'NLP', level: 'Intermediate', category: 'Technical' },
      { name: 'Deep Learning', level: 'Advanced', category: 'Technical' }
    ],
    projectsCount: 5,
    featuredProjects: ['Multilingual Campus Chatbot', 'Research Paper Summarizer', 'Acoustic Noise Filter'],
    interests: ['Deep Learning', 'NLP', 'AI Ethics', 'Speech Processing'],
    availability: 'Flexible',
    hoursPerWeek: 16,
    experience: [
      {
        title: 'AI Center of Excellence',
        role: 'Graduate Research Intern',
        summary: 'Fine-tuned open source LLMs on academic QA benchmark, achieving 89% accuracy.',
        duration: 'Jul 2024 - Present'
      }
    ],
    privacy: { isDiscoverable: true, showContact: true, matchingOnly: false }
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'project-campus-nav',
    name: 'AI Campus Navigation',
    description: 'Build an AI-powered campus navigation platform that helps students find classrooms, labs, events, and accessible campus facilities with real-time indoor guidance.',
    type: 'College Project',
    requiredSkills: ['Python', 'Machine Learning', 'React', 'UI/UX', 'Figma', 'Database', 'Backend'],
    teamSize: 4,
    deadline: 'May 20, 2026',
    availabilityRequirement: 'Flexible',
    currentTeam: [
      {
        studentId: CURRENT_USER.id,
        name: CURRENT_USER.name,
        avatar: CURRENT_USER.avatar,
        role: 'AI & Data Lead',
        primarySkills: ['Python', 'Data Science', 'Machine Learning'],
        isLead: true
      }
    ],
    status: 'Recruiting',
    createdAt: '2026-03-01'
  },
  {
    id: 'project-dropout-risk',
    name: 'Student Dropout Risk Predictor',
    description: 'An AI-powered academic early-warning platform that predicts student dropout risk using anonymized academic history, LMS engagement, and behavioral factors.',
    type: 'Research',
    requiredSkills: ['Machine Learning', 'Python', 'Data Analysis', 'Pandas', 'Statistics', 'Backend Development', 'UI/UX'],
    teamSize: 4,
    deadline: 'June 15, 2026',
    availabilityRequirement: 'Weekdays',
    currentTeam: [
      {
        studentId: CURRENT_USER.id,
        name: CURRENT_USER.name,
        avatar: CURRENT_USER.avatar,
        role: 'Research Lead',
        primarySkills: ['Python', 'Data Science'],
        isLead: true
      },
      {
        studentId: 'student-neha',
        name: 'Neha Sharma',
        avatar: 'NS',
        role: 'Data Analyst',
        primarySkills: ['Data Science', 'Pandas', 'Statistics']
      }
    ],
    status: 'Recruiting',
    createdAt: '2026-02-14'
  },
  {
    id: 'project-ecotrack',
    name: 'EcoTrack — Campus Carbon Ledger',
    description: 'Gamified campus sustainability dashboard calculating cafeteria waste reduction, dorm energy consumption, and peer commuting offset metrics.',
    type: 'Hackathon',
    requiredSkills: ['React', 'Node.js', 'Figma', 'Database', 'UI/UX', 'Leadership'],
    teamSize: 3,
    deadline: 'April 10, 2026',
    availabilityRequirement: 'Weekends',
    currentTeam: [
      {
        studentId: CURRENT_USER.id,
        name: CURRENT_USER.name,
        avatar: CURRENT_USER.avatar,
        role: 'Data Analytics',
        primarySkills: ['Python', 'Data Science'],
        isLead: true
      }
    ],
    status: 'Recruiting',
    createdAt: '2026-03-05'
  }
];

export const INITIAL_REQUESTS: TeamRequest[] = [
  {
    id: 'req-1',
    projectId: 'project-campus-nav',
    projectName: 'AI Campus Navigation',
    senderId: CURRENT_USER.id,
    senderName: CURRENT_USER.name,
    senderAvatar: CURRENT_USER.avatar,
    receiverId: 'student-aarav',
    receiverName: 'Aarav Sharma',
    role: 'Lead Frontend & UI/UX Engineer',
    requiredSkills: ['React', 'Figma', 'UI/UX'],
    expectedContribution: 'Build the interactive map interface, coordinate Figma component system, and implement responsive campus route viewers.',
    deadline: 'May 20, 2026',
    timeCommitment: '8-10 hrs / week',
    status: 'Pending',
    createdAt: '2 hours ago'
  },
  {
    id: 'req-2',
    projectId: 'project-incoming-fintech',
    projectName: 'FinPeer — Micro Student Grants',
    senderId: 'student-riya',
    senderName: 'Riya Kapoor',
    senderAvatar: 'RK',
    receiverId: CURRENT_USER.id,
    receiverName: CURRENT_USER.name,
    role: 'Data Scientist / Risk Modeler',
    requiredSkills: ['Python', 'Data Science', 'Statistics'],
    expectedContribution: 'Design scoring algorithm for micro-grant eligibility and assist in pitching our deck to university alumni.',
    deadline: 'April 30, 2026',
    timeCommitment: '6 hrs / week',
    status: 'Pending',
    createdAt: 'Yesterday'
  },
  {
    id: 'req-3',
    projectId: 'project-incoming-robotics',
    projectName: 'Autonomous Delivery Rover',
    senderId: 'student-ananya',
    senderName: 'Ananya Singh',
    senderAvatar: 'AS',
    receiverId: CURRENT_USER.id,
    receiverName: CURRENT_USER.name,
    role: 'Telemetry Ingestion Engineer',
    requiredSkills: ['Python', 'FastAPI', 'Pandas'],
    expectedContribution: 'Create ingestion service to log obstacle coordinates and battery levels in real-time.',
    deadline: 'June 1, 2026',
    timeCommitment: '8 hrs / week',
    status: 'Pending',
    createdAt: '3 days ago'
  }
];

// Semantic Knowledge Map for intelligent matching
export const SEMANTIC_KNOWLEDGE_BASE: Record<string, string[]> = {
  'Computer Vision': ['OpenCV', 'CNN', 'Image Processing', 'YOLO', 'Object Detection', 'Vision Transformer'],
  'Machine Learning': ['Python', 'Statistics', 'Data Science', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Deep Learning', 'Pandas'],
  'Deep Learning': ['TensorFlow', 'PyTorch', 'Neural Networks', 'CNN', 'NLP', 'Transformers', 'Keras'],
  'Backend': ['Node.js', 'SQL', 'Database', 'Python', 'Java', 'FastAPI', 'Express', 'Spring Boot', 'MongoDB', 'Docker', 'REST API'],
  'Backend Development': ['Node.js', 'SQL', 'Database', 'Python', 'Java', 'FastAPI', 'Express', 'Spring Boot', 'MongoDB', 'Docker', 'REST API'],
  'Database': ['SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Firebase', 'Redis', 'Database Design'],
  'Design': ['Figma', 'UI/UX', 'User Research', 'Prototyping', 'Wireframing', 'Design Systems', 'Adobe XD', 'Canva'],
  'UI/UX': ['Figma', 'User Testing', 'Prototyping', 'Design Thinking', 'Wireframing', 'Interaction Design'],
  'Frontend': ['React', 'HTML', 'CSS', 'Tailwind CSS', 'Next.js', 'TypeScript', 'JavaScript', 'Vue', 'Frontend Architecture'],
  'Mobile Dev': ['React Native', 'Flutter', 'Dart', 'Android', 'iOS', 'Firebase', 'Swift'],
  'Data Analysis': ['Python', 'Pandas', 'Tableau', 'Statistics', 'SQL', 'Power BI', 'Data Visualization', 'NumPy'],
  'Data Visualization': ['Tableau', 'Power BI', 'Matplotlib', 'Seaborn', 'D3.js', 'Recharts'],
  'Research': ['User Testing', 'Literature Review', 'Statistical Analysis', 'Documentation', 'Experiment Design'],
  'Cybersecurity': ['Linux', 'Networking', 'Penetration Testing', 'Cryptography', 'API Security', 'OAuth2']
};

export const SMART_ALTERNATIVES_MAP: Record<string, { alternative: string; reason: string }> = {
  'TensorFlow': {
    alternative: 'PyTorch',
    reason: 'PyTorch and TensorFlow share deep learning tensor paradigms; neural network architectures translate directly.'
  },
  'React': {
    alternative: 'Flutter',
    reason: 'Flutter provides declarative component state management closely mirroring React mental models.'
  },
  'Node.js': {
    alternative: 'FastAPI / Python',
    reason: 'Both provide asynchronous REST microservices and high-throughput endpoint routing.'
  },
  'Tableau': {
    alternative: 'Pandas + Matplotlib',
    reason: 'Python visual analytics pipelines handle the same statistical charting and dimensional slicing.'
  },
  'Computer Vision': {
    alternative: 'OpenCV / CNN Experience',
    reason: 'Hands-on OpenCV and convolutional network implementation covers real-world computer vision pipelines.'
  }
};

export const SAMPLE_RESUMES = [
  {
    id: 'resume-fullstack',
    title: 'Full-Stack Developer Resume (Aarav style)',
    text: `Aarav Sharma
Computer Science & Design | GPA: 3.8/4.0
Email: aarav@campus.edu | GitHub: github.com/aarav-dev

TECHNICAL SUMMARY:
- Languages & Frameworks: React, TypeScript, Next.js, HTML5, Tailwind CSS, Node.js, Express, JavaScript (ES6+).
- Design & Prototyping: Figma, UI/UX Design, Wireframing, Design Systems, Mobile Responsive Layouts.
- Databases & Tools: Git, GitHub, REST APIs, Vercel, Supabase.

PROJECTS:
1. UniFlow Component Library: Created an accessible React + Tailwind design system adopted by 4 campus hackathon teams.
2. Campus Course Scheduler: Built full-stack timetable planner in Next.js and Prisma, handling 2,000+ course combinations with drag-and-drop UI.
3. Hostel Laundry Queue: Mobile-first web app with real-time machine availability status.

EXPERIENCE:
- Frontend Design Intern @ TechFlow Labs (May 2024 - Jul 2024): Built 12 responsive dashboards, conducted usability testing, and optimized lighthouse score to 98.
- Lead UI/UX @ DesignSprint (Nov 2023): First place winner for accessible mobile experience.`
  },
  {
    id: 'resume-ml',
    title: 'AI / Computer Vision Researcher Resume (Ananya style)',
    text: `Ananya Singh
Artificial Intelligence & Robotics | GPA: 3.9/4.0
Email: ananya@campus.edu | ArXiv: arxiv.org/a/singh_a

SUMMARY:
Machine Learning engineer specializing in Computer Vision, convolutional neural networks, and OpenCV image processing.

TECHNICAL SKILLS:
- Languages: Python, C++, Bash
- ML & Frameworks: PyTorch, OpenCV, TensorFlow, Scikit-learn, YOLOv8, CNN, Image Processing, NumPy, Pandas
- Developer Tools: Git, Linux, Docker, CUDA, Weights & Biases

PROJECTS:
1. Automated Classroom Attendance via Facial Landmark Clustering: Real-time OpenCV video stream processing pipeline with 96.4% verification accuracy on 60-student class.
2. Obstacle Avoidance for Campus Rover: Trained custom YOLOv8 model for path segmentation and hazard avoidance running on edge Jetson Nano at 24 FPS.
3. Biomedical Image Denoising: ResNet-based autoencoder in PyTorch for low-light microscope image restoration.

EXPERIENCE:
- Undergraduate Research Fellow @ Robotics & Vision Consortium: Led indoor spatial dataset capture and camera calibration benchmark.`
  },
  {
    id: 'resume-data',
    title: 'Data Analyst & Statistician Resume (Neha style)',
    text: `Neha Sharma
Data Analytics & Applied Statistics | GPA: 3.85/4.0
Email: neha@campus.edu

TECHNICAL PROFICIENCIES:
- Data Tools: Python, Pandas, NumPy, SQL, Tableau, Power BI, Excel, Statistics, Exploratory Data Analysis (EDA)
- Soft Skills: Data Storytelling, Technical Documentation, Presentation, Cross-functional Communication

EXPERIENCE & PROJECTS:
- Data Intern @ Institutional Research Office (Jun 2024 - Dec 2024): Analyzed 5 years of student enrollment and facility usage logs using Pandas and SQL. Built Tableau interactive portal presented to the University Dean.
- Campus Carbon Footprint Modeling: Statistical regression modeling predicting greenhouse emissions by campus dining halls.`
  }
];
