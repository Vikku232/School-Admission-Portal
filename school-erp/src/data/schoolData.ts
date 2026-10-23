import { GalleryItem, BlogPost, NoticeItem, CareerPosting, FeeStructure } from '../types';

export const SCHOOL_INFO = {
  name: "RIPS",
  fullName: "Royal International Senior Secondary School (11th & 12th)",
  tagline: "Premier Senior Secondary School & Junior College • Classes 11th & 12th",
  established: 1998,
  cbseAffiliation: "CBSE Affiliated Senior Secondary (Code: 1930284)",
  address: "Knowledge City Senior Campus, Sector 12, Metro City",
  phone: "+91 (011) 2873-4000 / 4001",
  email: "admissions@rips.edu.in",
  emergencyContact: "+91 98765 43210",
  schoolTiming: "10:00 AM – 04:00 PM",
  officeHours: "10:00 AM – 04:00 PM (Monday to Saturday)",
};

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Senior Secondary Annual Athletics & Sports Meet',
    category: 'Sports',
    date: 'February 15, 2026',
    image: 'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?auto=format&fit=crop&q=80&w=800',
    description: 'Class 11th & 12th athletes showcasing track and field excellence in inter-house competitions.'
  },
  {
    id: 'g2',
    title: 'National Robotics & AI Innovation Fair',
    category: 'Academic',
    date: 'January 28, 2026',
    image: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&q=80&w=800',
    description: 'Senior Science stream students secured 1st prize in AI-driven autonomous robotics.'
  },
  {
    id: 'g3',
    title: 'Annual Cultural Fest - "Tarang 2025"',
    category: 'Cultural',
    date: 'December 20, 2025',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
    description: 'Symphony orchestra, theater acts, and classical dance performances by 11th & 12th students.'
  },
  {
    id: 'g4',
    title: 'Advanced Research Labs for Physics, Chem & Bio',
    category: 'Infrastructure',
    date: 'November 10, 2025',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
    description: 'State-of-the-art laboratory facilities designed specifically for CBSE Class 11-12 Practicals & Research.'
  },
  {
    id: 'g5',
    title: 'Senior NCC Cadet Corps & Leadership Camp',
    category: 'Celebration',
    date: 'August 15, 2025',
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800',
    description: 'Senior NCC cadets marching drill and national independence day celebration.'
  },
  {
    id: 'g6',
    title: 'Senior Model UN (MUN) Parliamentary Conference',
    category: 'Academic',
    date: 'October 05, 2025',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800',
    description: 'Class 11 & 12 delegates debating international diplomacy and geopolitical economic policies.'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: 'Choosing Your Stream After 10th: Science, Commerce, or Humanities?',
    author: 'Dr. Savita Sharma (Principal & Career Dean)',
    date: 'February 10, 2026',
    category: 'Career Guidance',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
    excerpt: 'Comprehensive roadmap for 10th-pass students selecting their specialized stream for Classes 11 & 12.',
    content: 'The transition from Class 10th to 11th marks the defining pivot in an academic journey. At RIPS, we combine psychometric aptitude profiling with personalized counselling to help students choose between Science (PCM/PCB), Commerce, and Humanities.'
  },
  {
    id: 'b2',
    title: 'Mastering CBSE Board Exams & Competitive Tests (JEE / NEET / CUET)',
    author: 'Rajesh Khanna (Senior PGT Physics)',
    date: 'January 18, 2026',
    category: 'Exam Strategy',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&q=80&w=800',
    excerpt: 'How synchronized learning between CBSE 11th-12th NCERT syllabus and competitive tests produces top ranks.',
    content: 'Balancing school board syllabus with entrance exams is not about studying twice as hard, but studying strategically. Conceptual depth in Class 11 forms the cornerstone of competitive performance.'
  },
  {
    id: 'b3',
    title: 'The Modern Commerce & Humanities Paradigm: FinTech & Global Affairs',
    author: 'Anita Desai (HOD Senior Secondary Social Sciences)',
    date: 'December 12, 2025',
    category: 'Academic Insights',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
    excerpt: 'Preparing Senior Secondary students for corporate finance, data analytics, economics, and law careers.',
    content: 'Senior secondary education in Commerce and Arts has evolved. Our students run mock stock markets, analyze macroeconomic budgets, and engage with real-world case studies.'
  }
];

export const NOTICES: NoticeItem[] = [
  {
    id: 'n1',
    title: 'Admissions Open for Class 11th (Session 2027–28) - Science, Commerce & Arts',
    date: 'Feb 22, 2026',
    category: 'Administrative',
    isImportant: true
  },
  {
    id: 'n2',
    title: 'CBSE Class 12th Board Practical Examinations & External Viva Schedule',
    date: 'Feb 18, 2026',
    category: 'Exam',
    isImportant: true
  },
  {
    id: 'n3',
    title: 'Class 11th Annual Term-II Final Examinations Date Sheet & Guidelines',
    date: 'Feb 12, 2026',
    category: 'Exam',
    isImportant: true
  },
  {
    id: 'n4',
    title: 'Special Crash Course & Mock Test Series: JEE Main, NEET UG & CUET 2026',
    date: 'Feb 05, 2026',
    category: 'Academic',
    isImportant: false
  },
  {
    id: 'n5',
    title: 'Parent-Teacher Meeting (PTM) for Class 11th & 12th Pre-Board Progress',
    date: 'Jan 28, 2026',
    category: 'Academic',
    isImportant: false
  }
];

export const CAREER_POSTINGS: CareerPosting[] = [
  {
    id: 'c1',
    title: 'Post Graduate Teacher (PGT) - Physics',
    department: 'Senior Secondary Wing (Classes 11 & 12)',
    experience: '3-6 Years teaching Class 11-12 (JEE/NEET experience preferred)',
    qualification: 'M.Sc (Physics) + B.Ed',
    lastDate: 'March 15, 2026',
    type: 'Full-time'
  },
  {
    id: 'c2',
    title: 'Post Graduate Teacher (PGT) - Mathematics',
    department: 'Senior Secondary Wing (Classes 11 & 12)',
    experience: '3-5 Years in CBSE Class 11-12 & Applied Maths',
    qualification: 'M.Sc (Mathematics) + B.Ed',
    lastDate: 'March 20, 2026',
    type: 'Full-time'
  },
  {
    id: 'c3',
    title: 'PGT Accountancy & Business Studies',
    department: 'Commerce Wing (Classes 11 & 12)',
    experience: '3-5 Years in Senior Secondary Commerce',
    qualification: 'M.Com / CA Inter + B.Ed',
    lastDate: 'March 10, 2026',
    type: 'Full-time'
  },
  {
    id: 'c4',
    title: 'PGT Computer Science & Artificial Intelligence',
    department: 'Senior Secondary Wing (Classes 11 & 12)',
    experience: '2-4 Years teaching Python, SQL & Data Science for Class 11-12',
    qualification: 'MCA / M.Tech / M.Sc (CS)',
    lastDate: 'March 25, 2026',
    type: 'Full-time'
  }
];

export const FEE_STRUCTURE: FeeStructure[] = [
  {
    grade: 'Class 11th - Science (PCM / PCB + CS/PE/Bio)',
    tuitionFee: 22000,
    developmentFee: 5000,
    annualCharges: 14000,
    totalAnnual: 122000
  },
  {
    grade: 'Class 11th - Commerce (Maths / IP / Applied Maths)',
    tuitionFee: 19500,
    developmentFee: 4500,
    annualCharges: 12500,
    totalAnnual: 108500
  },
  {
    grade: 'Class 11th - Humanities / Arts (Pol Sci, Hist, Psych, Econ)',
    tuitionFee: 18500,
    developmentFee: 4000,
    annualCharges: 12000,
    totalAnnual: 104000
  },
  {
    grade: 'Class 12th - Science (Board Practicals + Lab + Mock Series)',
    tuitionFee: 24000,
    developmentFee: 5500,
    annualCharges: 16000,
    totalAnnual: 133500
  },
  {
    grade: 'Class 12th - Commerce (CBSE Board Registration + Projects)',
    tuitionFee: 21000,
    developmentFee: 5000,
    annualCharges: 14000,
    totalAnnual: 118000
  },
  {
    grade: 'Class 12th - Humanities / Arts (CUET Prep + Board Projects)',
    tuitionFee: 20000,
    developmentFee: 4500,
    annualCharges: 13500,
    totalAnnual: 113500
  }
];

export const INFRASTRUCTURE_ITEMS = [
  {
    id: 'inf1',
    name: 'Advanced Science Practical Labs',
    description: 'Dedicated modern Physics, Chemistry, and Biology laboratories fully calibrated for Class 11th & 12th CBSE Practical Syllabi.',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'inf2',
    name: 'Smart Senior Lecture Theaters',
    description: 'Equipped with interactive 4K touch panels, seminar seating, dual acoustics, and recorded lecture capture for senior students.',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'inf3',
    name: 'High-Performance CS & AI Tech Lab',
    description: 'High-speed workstations equipped for Python, SQL databases, AI algorithms, and project work for Class 11th & 12th CS curriculum.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'inf4',
    name: 'Digital Reference & Competitive Exam Library',
    description: 'Over 25,000 reference volumes, NCERT archives, dedicated study pods, and digital access to JEE, NEET & CUET test repositories.',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'inf5',
    name: 'Olympic-Grade Sports Complex',
    description: 'Indoor multi-sport courts, FIFA turf ground, gym, and specialized coaching for Physical Education practicals and state athletics.',
    image: 'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'inf6',
    name: 'GPS-Monitored Safe Senior Transport Fleet',
    description: '50+ air-conditioned express buses with real-time GPS tracking and CCTV covering all major city routes for senior students.',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800'
  }
];

export const CAMPUS_LIFE_ITEMS = [
  {
    id: 'cl1',
    name: 'Senior Academic & Tech Societies',
    description: 'Clubs in Theoretical Physics, Coding & AI, FinTech, and Model UN fostering intellectual leadership in 11th & 12th grades.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'cl2',
    name: 'Competitive Exam Guidance & Peer Study Pods',
    description: 'Weekly diagnostic mock tests, peer mentorship groups, and faculty office hours for JEE, NEET, CUET, and CA Foundation.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'cl3',
    name: 'Sports Academy & Physical Conditioning',
    description: 'High-intensity coaching in Basketball, Cricket, Football, Swimming, and Table Tennis to maintain holistic health.',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'cl4',
    name: 'Leadership Council & Career Cell',
    description: 'Student Council, corporate internship talks, guest lectures by alumni from IITs, AIIMS, IIMs, and national law universities.',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800'
  }
];

