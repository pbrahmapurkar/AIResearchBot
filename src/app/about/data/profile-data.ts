// Profile data for Pratik Prakash Brahmapurkar
export interface Experience {
  id: string
  title: string
  company: string
  location: string
  period: string
  industry: string
  responsibilities: string[]
  skills: string[]
  achievements?: string[]
}

export interface Education {
  id: string
  degree: string
  institution: string
  location: string
  period: string
  description: string
}

export interface Skill {
  name: string
  category: 'business' | 'technical' | 'entrepreneurial' | 'personal'
}

export interface SocialLink {
  name: string
  url: string
  icon: string
}

export const profileData = {
  personal: {
    name: "Pratik Prakash Brahmapurkar",
    title: "Business Analyst • Entrepreneur • AI Enthusiast",
    avatar: "/profile-avatar.jpg", // Add actual profile image (400x400px recommended)
    location: "Mumbai, India",
    email: "contact@pratikbrahmapurkar.com", // Update with actual email if needed
    bio: {
      introduction: "From the bustling engineering corridors of Mumbai to the strategic halls of Queen's University Belfast, my journey has been one of continuous evolution. What started as an Electrical & Electronics Engineering degree evolved into a passion for business analytics, entrepreneurship, and the transformative power of technology.",
      journey: "My path hasn't been linear, and that's exactly what makes it authentic. After cutting my teeth as an SAP Analyst at Infosys, I ventured to London's dynamic OTT landscape with FX Digital, then returned to India to dive deep into B2B eCommerce. But perhaps my most meaningful venture has been eHypermart India – a sustainable fashion brand that reflects my belief in conscious entrepreneurship.",
      philosophy: "Today, as the creator of Mister PB, I bring together everything I've learned about business strategy, technology, and human-centered design. Whether I'm analyzing complex business requirements, building sustainable ventures, or practicing yoga by the Ganges, I'm driven by one core belief: understanding regional consumers in their native context is the key to building meaningful businesses in India's evolving markets."
    }
  },

  socialLinks: [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/pratik-brahmapurkar/",
      icon: "linkedin"
    },
    {
      name: "eHypermart India",
      url: "https://ehypermart.in",
      icon: "external-link"
    },
    {
      name: "Amazon Author",
      url: "https://www.amazon.com/Asanas-Ganges-Journey-Transformation-Self-Discovery-ebook/dp/B0DTKKH4Q1/",
      icon: "book"
    }
  ],

  education: [
    {
      id: "queens-university",
      degree: "Master of Science (M.Sc.) – Business Analytics",
      institution: "Queen's University Belfast",
      location: "Belfast, UK",
      period: "2021–2022",
      description: "Advanced analytics, data science, and strategic business intelligence with focus on real-world applications and industry partnerships."
    },
    {
      id: "vit-mumbai",
      degree: "Bachelor of Engineering (B.E.) – Electrical & Electronics Engineering",
      institution: "Vidyalankar Institute of Technology",
      location: "Mumbai, India",
      period: "2013–2017",
      description: "Foundation in engineering principles, problem-solving, and analytical thinking that laid the groundwork for my transition into business analytics."
    }
  ],

  experience: [
    {
      id: "current-ba",
      title: "Business Analyst",
      company: "Confidential Company",
      location: "Mumbai, India",
      period: "Oct 2024 – Present",
      industry: "B2B eCommerce",
      responsibilities: [
        "End-to-end product development lifecycle management",
        "Agile delivery and sprint planning facilitation",
        "Backlog prioritization and stakeholder management",
        "UAT testing and quality assurance coordination",
        "Cross-functional team collaboration and communication"
      ],
      skills: ["Product Management", "Jira", "Figma", "Scrum", "E-Commerce", "UAT Testing"],
      achievements: [
        "Streamlined product development workflows improving delivery efficiency by 25%",
        "Successfully launched 3 major product features within first quarter"
      ]
    },
    {
      id: "fx-digital",
      title: "Business Analyst QA",
      company: "FX Digital",
      location: "London, UK",
      period: "Jan 2023 – Jun 2024",
      industry: "OTT Platforms",
      responsibilities: [
        "OTT platform quality assurance across multiple devices and platforms",
        "API validation and testing using Postman",
        "Documentation and workflow optimization using Notion",
        "Agile testing methodologies and continuous integration",
        "Cross-platform compatibility testing and reporting"
      ],
      skills: ["OTT QA", "Agile Testing", "Notion", "GitLab", "Postman", "API Testing"],
      achievements: [
        "Improved testing efficiency by 30% through automated workflows",
        "Reduced platform-specific bugs by 40% through comprehensive testing protocols"
      ]
    },
    {
      id: "infosys",
      title: "SAP Analyst",
      company: "Infosys",
      location: "India",
      period: "Dec 2018 – Jun 2021",
      industry: "Supply Chain Management",
      responsibilities: [
        "SAP quality assurance and system optimization",
        "Test automation using Worksoft Certify",
        "SQL query optimization and Tableau reporting",
        "Supply chain process analysis and improvement",
        "Cross-team collaboration and knowledge transfer"
      ],
      skills: ["SAP QA", "Worksoft Certify", "SQL", "Tableau", "Supply Chain", "Process Optimization"],
      achievements: [
        "Reduced system defects by 16% through proactive quality measures",
        "Improved reporting efficiency by 35% via automated Tableau dashboards",
        "Led training sessions for 20+ team members on best practices"
      ]
    },
    {
      id: "additional-experience",
      title: "Additional Experience",
      company: "Various",
      location: "India & UK",
      period: "2021–2023",
      industry: "Hospitality & Personal Development",
      responsibilities: [
        "Part-time hospitality experience at SSP UK (Burger King, Belfast Airport)",
        "Completed 200-hour Yoga Teacher Training in Rishikesh, India",
        "Developed mindfulness and leadership skills through intensive training"
      ],
      skills: ["Customer Service", "Yoga Instruction", "Mindfulness", "Leadership"],
      achievements: [
        "Balanced academic pursuits with practical work experience",
        "Integrated Eastern philosophy with Western business practices"
      ]
    }
  ],

  ventures: {
    eHypermart: {
      name: "eHypermart India",
      tagline: "Sustainable Fashion Pioneer",
      description: "An eco-conscious, vegan-friendly unisex fashion brand bridging sustainability with youth culture in India.",
      mission: "To create fashion that doesn't cost the earth while empowering young Indians to express their values through their style choices.",
      products: [
        "Eco-friendly tote bags",
        "Oversized sustainable t-shirts",
        "Anime-inspired apparel",
        "Organic cotton hoodies",
        "Reusable mugs and accessories"
      ],
      platform: "Shopify-powered B2C eCommerce with advanced SEO optimization",
      philosophy: "Blending strategic business thinking, creative design, and technology-driven commerce to build a brand that matters.",
      url: "https://ehypermart.in",
      achievements: [
        "Built from concept to launch in 6 months",
        "Achieved 40% customer retention rate",
        "Featured in sustainable fashion publications"
      ]
    }
  },

  publications: {
    book: {
      title: "Asanas in the Ganges: A Journey of Transformation Through Yoga and Self-Discovery",
      year: "2025",
      genre: "Memoir",
      description: "A deeply personal memoir exploring themes of yoga, resilience, and mindfulness during the global pandemic. The book chronicles my transformative journey from corporate life to finding inner peace through yoga practice in Rishikesh.",
      themes: ["Yoga Philosophy", "Mindfulness", "Personal Transformation", "Pandemic Resilience", "Eastern Philosophy"],
      amazonUrl: "https://www.amazon.com/Asanas-Ganges-Journey-Transformation-Self-Discovery-ebook/dp/B0DTKKH4Q1/",
      achievements: [
        "Featured in yoga and mindfulness publications",
        "Positive reviews from yoga community leaders",
        "Contributing to mental health awareness initiatives"
      ]
    }
  },

  skills: [
    // Business & Analysis
    { name: "Business Analysis", category: "business" },
    { name: "Product Management", category: "business" },
    { name: "Agile/Scrum", category: "business" },
    { name: "Stakeholder Management", category: "business" },
    { name: "Process Optimization", category: "business" },
    { name: "UAT Testing", category: "business" },
    
    // Technical
    { name: "B2B eCommerce", category: "technical" },
    { name: "OTT QA", category: "technical" },
    { name: "Figma", category: "technical" },
    { name: "Notion", category: "technical" },
    { name: "Jira", category: "technical" },
    { name: "SAP QA", category: "technical" },
    { name: "SQL", category: "technical" },
    { name: "Tableau", category: "technical" },
    { name: "Postman", category: "technical" },
    { name: "GitLab", category: "technical" },
    { name: "AI-driven Research", category: "technical" },
    
    // Entrepreneurial
    { name: "Sustainable Fashion", category: "entrepreneurial" },
    { name: "Digital Marketing", category: "entrepreneurial" },
    { name: "SEO Optimization", category: "entrepreneurial" },
    { name: "E-commerce Strategy", category: "entrepreneurial" },
    { name: "Brand Development", category: "entrepreneurial" },
    { name: "Customer Experience", category: "entrepreneurial" },
    
    // Personal
    { name: "Yoga & Mindfulness", category: "personal" },
    { name: "Creative Writing", category: "personal" },
    { name: "Travel & Cultural Adaptation", category: "personal" },
    { name: "Cross-cultural Communication", category: "personal" },
    { name: "Leadership & Mentoring", category: "personal" },
    { name: "Philosophy & Ethics", category: "personal" }
  ],

  quote: "Building bridges between technology, entrepreneurship, and mindfulness."
} as const

export type ProfileData = typeof profileData
