export const environment = {
  production: true,
  url: 'http://localhost:3000',
  segmentUrls: {
    auth: {
      login: '/login',
      isLoggedIn: '/isLoggedIn'
    },
    student: {
      marks: '/student/marks',
      markComplain: '/student/marks/complaint',
      deliberation: '/student/deliberations',
      deliberationComplain: '/student/deliberations/complaint'
    },
    admin: {
      teachers: '/admin/teachers',
      students: '/admin/students',
      courses: '/admin/courses',
      marks: '/admin/marks',
      deliberation: '/admin/deliberations',
      users: {
        admin: '/admin/admins',
        teacher: '/admin/teachers',
        student: '/admin/students'
      }
    },
    teacher: {
      marks: '/teacher/marks',
      students: '/teacher/students',
      courses: '/teacher/courses'
    }
  },
  authHeader: 'Authorization',
  itemPerPage: 5
};
