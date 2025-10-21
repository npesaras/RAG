import { FeatureCard } from './FeatureCard'

const features = [
  {
    title: '24/7 Chat Assistant',
    description:
      'Get instant answers to your questions anytime. Our AI assistant is available round the clock to help with coursework, campus information, and academic guidance.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
    gradient: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    iconBgColor: 'bg-purple-500/10',
    iconColor: 'text-purple-600 dark:text-purple-400',
    textColor: 'text-purple-900 dark:text-purple-100',
    actionText: 'Start chatting →',
    actionColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    title: 'Download College Prospectus',
    description:
      'Access comprehensive college brochures, course catalogs, and program details. Download official prospectuses for all CCS programs and departments.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    gradient: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20',
    borderColor: 'border-orange-200 dark:border-orange-800',
    iconBgColor: 'bg-orange-500/10',
    iconColor: 'text-orange-600 dark:text-orange-400',
    textColor: 'text-orange-900 dark:text-orange-100',
    actionText: 'Browse downloads →',
    actionColor: 'text-orange-600 dark:text-orange-400',
  },
  {
    title: 'Browse Professors Directory',
    description:
      'Find faculty contact information, office hours, research interests, and expertise areas. Connect with the right professors for your academic needs.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    gradient: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
    borderColor: 'border-green-200 dark:border-green-800',
    iconBgColor: 'bg-green-500/10',
    iconColor: 'text-green-600 dark:text-green-400',
    textColor: 'text-green-900 dark:text-green-100',
    actionText: 'Explore directory →',
    actionColor: 'text-green-600 dark:text-green-400',
  },
  {
    title: 'Access CCS Knowledge Base',
    description:
      'Explore our comprehensive database of academic resources, course materials, research papers, and institutional knowledge curated for CCS students.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    gradient: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    iconBgColor: 'bg-blue-500/10',
    iconColor: 'text-blue-600 dark:text-blue-400',
    textColor: 'text-blue-900 dark:text-blue-100',
    actionText: 'Browse knowledge →',
    actionColor: 'text-blue-600 dark:text-blue-400',
  },
]

export function FeatureGrid() {
  return (
    <div className="grid md:grid-cols-2 gap-6 mt-16">
      {features.map((feature) => (
        <FeatureCard key={feature.title} {...feature} />
      ))}
    </div>
  )
}
