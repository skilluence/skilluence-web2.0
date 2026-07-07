export type ServiceFaq = {
  question: string;
  answer: string;
};

export type ServiceStep = {
  title: string;
  text: string;
};

export type ServiceDetail = {
  slug: string;
  title: string;
  text: string;
  summary: string;
  description?: string[];
  steps?: ServiceStep[];
  faqs?: ServiceFaq[];
};

export const serviceDetails: ServiceDetail[] = [
  {
    slug: "c2c-contract-to-contract",
    title: "C2C",
    text: "Flexible contracting opportunities for experienced professionals with independent work authorization.",
    summary:
      "Flexible contracting opportunities for experienced professionals with independent work authorization.",
    description: [
      "For experienced professionals who already have independent work authorization, such as H1B visa, Green Card, or U.S. citizenship, Skilluence offers Contract-to-Contract opportunities that provide flexibility, competitive compensation, and diverse project experiences.",
      "C2C arrangements allow you to work as an independent contractor through your own corporation or LLC, giving you greater control over your professional engagements, tax management, and career trajectory.",
      "We maintain an extensive network of vendor companies and direct clients across various industries who regularly seek skilled contractors for both short-term and long-term projects.",
    ],
    steps: [
      {
        title: "Eligibility & Authorization Check",
        text: "We verify that you have the required independent work authorization for C2C engagement.",
      },
      {
        title: "Vendor Network Matching",
        text: "We connect you with our network of vendors, consulting firms, and clients seeking C2C professionals.",
      },
      {
        title: "Profile Marketing & Submissions",
        text: "Your profile is submitted to matching contract roles, highlighting your strengths and expertise.",
      },
      {
        title: "Interview & Onboarding Support",
        text: "We assist with interview preparation and guide you through the onboarding process with the vendor or client.",
      },
    ],
    faqs: [
      {
        question: "Who is eligible for C2C roles?",
        answer: "Candidates with H1B, Green Card, EAD, or independent contractor status.",
      },
      {
        question: "Do you offer C2C to OPT or STEM OPT?",
        answer: "No. OPT and STEM OPT students do not qualify for C2C roles.",
      },
      {
        question: "What industries offer C2C contracting?",
        answer: "IT, Software Development, Data Engineering, QA, Cloud, and Business Analysis.",
      },
      {
        question: "Do you negotiate contract terms?",
        answer: "We guide you, but final negotiations are between you and the vendor or client.",
      },
    ],
  },
  {
    slug: "w2-employment",
    title: "W2 Employment",
    text: "Secure legitimate W2 employment with trusted employers who support international graduates.",
    summary:
      "Secure legitimate W2 employment with trusted employers who support international graduates.",
    description: [
      "For international students on OPT and STEM OPT, finding legitimate W2 employment with reputable employers who understand visa requirements can be challenging.",
      "Many international graduates face uncertainty about which employers are trustworthy, which opportunities are genuine, and how to navigate the complexities of OPT work authorization.",
      "At Skilluence, we specialize in connecting international students with legitimate W2 employment opportunities with trusted employers who have proven track records of hiring and supporting international graduates.",
      "W2 employment means you are hired as a traditional employee with proper payroll, tax withholding, benefits, and all legally required documentation.",
    ],
    steps: [
      {
        title: "W2 Eligibility Review",
        text: "We assess your OPT or STEM OPT status and confirm your eligibility for W2 employment.",
      },
      {
        title: "Employer Matching",
        text: "You are connected with genuine employers who have a history of hiring international students.",
      },
      {
        title: "Resume, LinkedIn & Interview Prep",
        text: "We help refine your profile and prepare you for interviews with hiring teams.",
      },
      {
        title: "Final Placement & Documentation Support",
        text: "We guide you through offer letters, onboarding paperwork, payroll setup, and employer verification.",
      },
    ],
    faqs: [
      {
        question: "Is W2 employment suitable for OPT/STEM OPT?",
        answer: "Yes. W2 is the preferred and compliant employment type for international students.",
      },
      {
        question: "Will I receive payroll and documentation support?",
        answer: "Yes, we ensure all employment documentation is accurate and compliant.",
      },
      {
        question: "Do you guarantee a W2 job?",
        answer: "We do not guarantee jobs, but we provide full support to increase your chances.",
      },
      {
        question: "What are the key HR compliance requirements?",
        answer: "HR compliance includes adhering to labor laws, workplace safety regulations, anti-discrimination policies, fair compensation standards, and employee rights protections.",
      },
      {
        question: "How can HR support employee well-being?",
        answer: "HR can implement wellness programs, offer flexible work arrangements, provide mental health support, and create a culture that prioritizes work-life balance.",
      },
      {
        question: "What is the role of HR in performance management?",
        answer: "HR sets performance goals, conducts evaluations, provides feedback, and implements development plans to enhance employee growth and company success.",
      },
    ],
  },
  {
    slug: "job-placement-agency",
    title: "Job Placement Agency",
    text: "Your partner in finding genuine, career-aligned job opportunities.",
    summary:
      "Your partner in finding genuine, career-aligned job opportunities.",
    description: [
      "Finding your ideal job in the competitive U.S. market can be overwhelming, especially as an international student navigating visa constraints and unfamiliar hiring processes.",
      "Many talented candidates struggle not because they lack qualifications, but because they do not have access to the right opportunities or know how to effectively position themselves.",
      "At Skilluence, our Job Placement Agency serves as your personal bridge to career success. We do not just send you job links. We actively work as your career advocate, leveraging our extensive network of employer relationships to connect you with positions that truly align with your strengths, aspirations, and career goals.",
    ],
    steps: [
      {
        title: "Career & Profile Evaluation",
        text: "A dedicated coach reviews your goals and strengths.",
      },
      {
        title: "Job Matching & Submissions",
        text: "We connect you to verified openings aligned to your field.",
      },
      {
        title: "Interview Assistance",
        text: "We help prepare you for each round with guidance and follow-up.",
      },
      {
        title: "Placement & Onboarding Support",
        text: "We support you until you secure and join a job.",
      },
    ],
    faqs: [
      {
        question: "Do you provide W2 jobs for OPT students?",
        answer: "Yes. We work with trusted employers.",
      },
      {
        question: "Do you offer C2C roles?",
        answer: "Yes, for H1B, Green Card, or independent contractors. C2C is not available for OPT candidates.",
      },
      {
        question: "Can you guarantee placement?",
        answer: "No, but we significantly improve your chances.",
      },
      {
        question: "What job sectors do you support?",
        answer: "Software Development, Data Engineering, QA, Business Analysis, Cloud, and more.",
      },
    ],
  },
  {
    slug: "personalized-job-placement",
    title: "Personalized Job Placement",
    text: "Career coaches work closely with you to understand your strengths, aspirations, and ideal career path.",
    summary:
      "Career coaches work closely with you to understand your strengths, aspirations, and ideal career path.",
    description: [
      "A trusted advisor helps candidates make informed career decisions by balancing goals, strengths, target roles, and market conditions.",
      "Our coaches provide personalized planning, positioning strategies, and continuous monitoring to optimize your job search.",
      "Whether you are planning long-term career growth, a first U.S. role, or a short-term placement goal, personalized job placement support gives you expert insight to move with clarity.",
    ],
    steps: [
      {
        title: "Media Marketing",
        text: "Focuses on online platforms like social media, search engines, websites, and email with targeted campaign execution.",
      },
      {
        title: "Brand Identity",
        text: "A collection of elements that a candidate creates to portray the right professional image to target employers.",
      },
      {
        title: "Managing Assets",
        text: "Profile and career asset management helps candidates maximize value, reduce confusion, and present their strengths clearly.",
      },
      {
        title: "Development",
        text: "A broad process focused on growth, progress, and improvement across career, professional, and personal contexts.",
      },
    ],
    faqs: [
      {
        question: "What is Human Resource Management (HRM)?",
        answer: "It includes recruitment, training, employee relations, performance management, benefits administration, and compliance with labor laws.",
      },
      {
        question: "Why is HR important for my business?",
        answer: "HR ensures that your business attracts and retains top talent, maintains compliance with labor laws, fosters a positive work culture, and improves overall employee productivity and engagement.",
      },
      {
        question: "How can HR help with employee retention?",
        answer: "HR helps by creating competitive compensation packages, offering career growth opportunities, implementing recognition programs, and fostering an inclusive, engaging work environment.",
      },
      {
        question: "What is HR automation, and why is it important?",
        answer: "HR automation uses technology to streamline HR tasks such as payroll, recruitment, and performance tracking. It improves efficiency, reduces errors, and allows HR teams to focus on strategic goals.",
      },
      {
        question: "What are the key HR compliance requirements?",
        answer: "HR compliance includes adhering to labor laws, workplace safety regulations, anti-discrimination policies, fair compensation standards, and employee rights protections.",
      },
      {
        question: "How can HR support employee well-being?",
        answer: "HR can implement wellness programs, offer flexible work arrangements, provide mental health support, and create a culture that prioritizes work-life balance.",
      },
      {
        question: "What is the role of HR in performance management?",
        answer: "HR sets performance goals, conducts evaluations, provides feedback, and implements development plans to enhance employee growth and company success.",
      },
    ],
  },
  {
    slug: "career-support-professional-development",
    title: "Career Support and Professional Development Program",
    text: "Receive ongoing guidance from industry professionals who provide insights, feedback, and support to help you navigate challenges and achieve your long-term career goals.",
    summary:
      "Receive ongoing guidance from industry professionals who provide insights, feedback, and support to help you navigate challenges and achieve your long-term career goals.",
    description: [
      "Career transitions can be overwhelming, especially for international students navigating the U.S. job market. At Skilluence, you are never alone.",
      "Our Career Support and Professional Development Program pairs you with experienced industry professionals who understand the unique challenges faced by OPT students. We provide continuous mentorship, strategic career planning, and actionable insights to help you not just find a job, but build a sustainable career path that aligns with your aspirations.",
      "Your career progression matters to us. Through ongoing guidance and personalized mentorship, we ensure you are informed, prepared, and confident at every stage of your professional journey. Instead of leaving you to navigate the complexities alone, we provide daily updates, regular check-ins, and strategic support throughout your career growth.",
    ],
    steps: [
      {
        title: "Career Mapping Session",
        text: "We create a personalized roadmap aligned with your goals.",
      },
      {
        title: "Mentorship & Guidance",
        text: "Experienced mentors support you through challenges and decisions.",
      },
      {
        title: "Ongoing Skill Development",
        text: "Training materials help you improve professionally and personally.",
      },
      {
        title: "Progress Tracking & Adjustments",
        text: "Your mentor monitors growth and updates your plan as needed.",
      },
    ],
    faqs: [
      {
        question: "Who is this program best for?",
        answer: "OPT students, career changers, and new graduates.",
      },
      {
        question: "How often do I meet my mentor?",
        answer: "Weekly or bi-weekly depending on your plan.",
      },
      {
        question: "Will I receive job-related guidance?",
        answer: "Yes. Support can include resume help, networking guidance, and interview preparation.",
      },
      {
        question: "Is support continuous?",
        answer: "Yes, throughout the duration of your membership.",
      },
      {
        question: "What are the key HR compliance requirements?",
        answer: "HR compliance includes adhering to labor laws, workplace safety regulations, anti-discrimination policies, fair compensation standards, and employee rights protections.",
      },
      {
        question: "How can HR support employee well-being?",
        answer: "HR can implement wellness programs, offer flexible work arrangements, provide mental health support, and create a culture that prioritizes work-life balance.",
      },
      {
        question: "What is the role of HR in performance management?",
        answer: "HR sets performance goals, conducts evaluations, provides feedback, and implements development plans to enhance employee growth and company success.",
      },
    ],
  },
  {
    slug: "interview-coaching-services",
    title: "Interview Coaching Services",
    text: "Boost your confidence and master interviews with expert-led coaching.",
    summary:
      "Boost your confidence and master interviews with expert-led coaching.",
    description: [
      "Interviews often trigger anxiety, causing many candidates to underperform.",
      "Our Interview Coaching Services prepare you through real-world mock sessions, personalized feedback, and proven interview strategies.",
      "We help you communicate clearly, answer confidently, and understand what employers expect.",
    ],
    steps: [
      {
        title: "Assessment & Goal Setting",
        text: "We evaluate your target roles and identify areas to improve.",
      },
      {
        title: "Realistic Mock Interview Sessions",
        text: "Practice with industry experts who simulate actual interview scenarios.",
      },
      {
        title: "Feedback & Improvement Plan",
        text: "Receive detailed guidance on strengths, weaknesses, and answer structure.",
      },
      {
        title: "Follow-Up Preparation",
        text: "We conduct additional sessions until you are fully interview-ready.",
      },
    ],
    faqs: [
      {
        question: "Are sessions tailored to my role?",
        answer: "Yes. Technical and behavioral questions are customized.",
      },
      {
        question: "How many mock interviews can I take?",
        answer: "As many as your plan includes.",
      },
      {
        question: "Will I receive feedback?",
        answer: "Yes, every session includes detailed feedback.",
      },
      {
        question: "Do you help with both HR and technical rounds?",
        answer: "Absolutely.",
      },
    ],
  },
  {
    slug: "mock-interview-services",
    title: "Mock Interview Services",
    text: "Get interview-ready with our experts through realistic mock sessions that build confidence and polish your delivery.",
    summary:
      "Get interview-ready with our experts through realistic mock sessions that build confidence and polish your delivery.",
    description: [
      "Interviews can be nerve-wracking. Even the most qualified candidates sometimes freeze, forget key points, or struggle to articulate their value when facing an interviewer.",
      "At Skilluence, our Mock Interview Services provide the realistic practice and expert feedback you need to walk into any interview with confidence. We simulate real interview environments, from behavioral questions to technical assessments, ensuring you are prepared for every scenario.",
      "Our experienced interview coaches help you refine your answers, improve your body language, master the art of storytelling, and develop strategies to handle challenging questions with poise.",
      "We do not just ask you questions. We create an authentic interview experience with professional setup, realistic time constraints, and the pressure of real-world interviews. After each session, you receive detailed feedback, specific areas for improvement, and actionable strategies to strengthen your interview performance.",
    ],
    steps: [
      {
        title: "Profile & Job Role Analysis",
        text: "We review your resume, domain, and job goals.",
      },
      {
        title: "Customized Mock Interview",
        text: "Expect role-specific technical and behavioral questions.",
      },
      {
        title: "In-Depth Feedback",
        text: "Get actionable suggestions to refine your performance.",
      },
      {
        title: "Repeated Practice Sessions",
        text: "Attend additional practice sessions until your answers, confidence, and delivery improve.",
      },
    ],
    faqs: [
      {
        question: "Do you provide technical interview practice?",
        answer: "Yes. We provide technical interview practice for IT, Business Analytics, QA, and more.",
      },
      {
        question: "Will I receive hiring tips?",
        answer: "Yes, including communication and body language guidance.",
      },
      {
        question: "Are sessions recorded?",
        answer: "They can be recorded upon request.",
      },
      {
        question: "How many mock sessions can I attend?",
        answer: "As many as needed depending on your package.",
      },
    ],
  },
  {
    slug: "resume-linkedin-optimization",
    title: "Resume Writing and LinkedIn Optimization",
    text: "A professionally optimized resume and LinkedIn profile make a powerful first impression and open doors to opportunities.",
    summary:
      "A professionally optimized resume and LinkedIn profile make a powerful first impression and open doors to opportunities.",
    description: [
      "Your resume and LinkedIn profile are your digital handshake with potential employers, often the only chance you have to make a compelling first impression.",
      "Many talented candidates miss opportunities because their resume fails to highlight what truly matters. Recruiters do not need your life history. They need to see your relevant skills, measurable achievements, and clear value proposition within seconds.",
      "At Skilluence, we provide professional resume writing and LinkedIn optimization services that make your qualifications stand out clearly, strategically, and professionally.",
      "Our expert writers go beyond basic templates, crafting keyword-optimized documents that align with industry terminology and Applicant Tracking Systems. We transform your experiences into compelling narratives that capture recruiters' attention and demonstrate why you are the ideal candidate.",
    ],
    steps: [
      {
        title: "Comprehensive Information Gathering",
        text: "We start with a detailed questionnaire and consultation call to understand your background, achievements, target roles, and career goals.",
      },
      {
        title: "Professional Content Creation",
        text: "Our expert writers craft your resume and LinkedIn profile with industry-specific keywords, quantifiable achievements, and compelling narratives.",
      },
      {
        title: "Collaborative Review and Refinement",
        text: "You receive your first draft for review, and we refine the content with your feedback until it accurately represents your strengths and goals.",
      },
      {
        title: "Final Delivery and Guidance",
        text: "You receive polished resume files in ATS-friendly formats along with optimized LinkedIn content and guidance for future updates.",
      },
    ],
    faqs: [
      {
        question: "Can you tailor my resume for different job applications?",
        answer: "Yes. We provide your master resume along with guidance on how to customize it for specific roles. We can also create multiple targeted versions for different career paths if needed.",
      },
      {
        question: "Will my resume pass Applicant Tracking Systems (ATS)?",
        answer: "Absolutely. We specifically design resumes to pass ATS screening by incorporating relevant keywords, using proper formatting, and avoiding elements that confuse automated systems.",
      },
      {
        question: "What if I do not have much work experience?",
        answer: "We specialize in helping students and recent graduates showcase their value. We highlight relevant coursework, academic projects, internships, volunteer work, and transferable skills in a way that demonstrates your potential to employers.",
      },
      {
        question: "Do you help with LinkedIn profile photos?",
        answer: "While we do not provide photography services, we offer guidance on what makes a professional LinkedIn photo and can recommend affordable professional photography options in your area.",
      },
    ],
  },
];

export function getServiceBySlug(slug: string) {
  return serviceDetails.find((service) => service.slug === slug);
}
