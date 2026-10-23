export interface GalleryItem {
  id: string;
  title: string;
  category: 'Sports' | 'Cultural' | 'Academic' | 'Infrastructure' | 'Celebration';
  date: string;
  image: string;
  description: string;
}

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
  excerpt: string;
  content: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  date: string;
  category: 'Academic' | 'Administrative' | 'Exam' | 'Sports' | 'General';
  isImportant?: boolean;
  fileUrl?: string;
}

export interface AccordionSection {
  id: string;
  title: string;
  description: string;
  items: {
    id: string;
    name: string;
    description: string;
    iconName?: string;
  }[];
}

export interface UtilityItem {
  id: 'notice' | 'alumni' | 'alumni-network' | 'admin-portal' | 'career' | 'pay-fees' | 'search';
  label: string;
  icon: string;
  badge?: string;
}

export interface CareerPosting {
  id: string;
  title: string;
  department: string;
  experience: string;
  qualification: string;
  lastDate: string;
  type: string;
}

export interface FeeStructure {
  grade: string;
  tuitionFee: number;
  developmentFee: number;
  annualCharges: number;
  totalAnnual: number;
}
