import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'RECODE',
  description: 'Documentation for RECODE',
  base: '/',
  vite: {
    assetsInclude: ['**/*.PNG', '**/*.svg', '**/*.jpg']
  },
  theme: { extend: './theme' },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag === 'lite-youtube',
      },
    },
  },
  themeConfig: {
    nav: [
      { text: 'User Guides', link: '/guides/' },
      { text: 'Backend', link: '/backend/' },
    ],
    sidebar: {
      // Sidebar for Guides
      '/guides/': [
        {
          text: 'Admin',
          collapsed: false,
          items: [
            { text: 'Dashboard', link: '/guides/admin/dashboard' },
          ],
        },
        {
          text: 'Lecturer',
          collapsed: false,
          items: [
              { text: 'Overview Dashboard', link: '/guides/lecturer/overview-dashboard' },
              { text: 'Uploads Dashboard', link: '/guides/lecturer/uploads-dashboard' },
              { text: 'Analytics Dashboard', link: '/guides/lecturer/analytics-dashboard' },
              { text: 'Modules', link: '/guides/lecturer/modules' },
              { text: 'Profile Settings', link: '/guides/lecturer/profile' },
          ],
        },
        {
          text: 'Student',
          collapsed: false,
          items: [
            { text: 'Overview Dashboard', link: '/guides/student/overview-dashboard' },
            { text: 'Analytics Dashboard', link: '/guides/student/analytics-dashboard' },
            { text: 'Coding Challenge', link: '/guides/student/coding-challenge' },
            { text: 'Modules', link: '/guides/student/modules' },
            { text: 'Profile Settings', link: '/guides/student/profile' },
          ],
        },
      ],

      // Sidebar for Backend
      '/backend/': [
        {
          text: 'Instructions',
          collapsed: false,
          items: [
            { text: 'Instructions', link: '/backend/instructions' },
          ],
        },
        {
          text: 'Processes',
          collapsed: false,
          items: [
            // Add backend process pages here
          ],
        },
      ],
    },
    search: {
      provider: 'local',
    },
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg', href: '/images/logo1.png' }]
  ]
});