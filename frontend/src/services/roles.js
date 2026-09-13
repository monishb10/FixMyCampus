export const ROLES = {
  STUDENT: {
    id: 'student',
    role: 'STUDENT',
    name: 'Monish B',
    email: 'monish@student.edu',
    title: 'Student Representative',
    department: 'Computer Science & Engineering',
    avatar: 'MB',
    badge: 'Student',
    color: '#225cff',
    permissions: {
      canReport: true,
      canEndorse: false,
      canAssign: false,
      canUpdateStatus: false,
      canDelete: false,
      canBroadcast: false,
      canVerify: true,
      canUpvote: true,
    },
    description: 'Report problems, track your issues, upvote community concerns, and verify resolutions.',
  },
  TEACHER: {
    id: 'teacher',
    role: 'TEACHER',
    name: 'Prof. Sarah Jenkins',
    email: 's.jenkins@campus.edu',
    title: 'Faculty / Lab In-Charge',
    department: 'Dept of ECE & AI Lab Coordinator',
    avatar: 'SJ',
    badge: 'Faculty',
    color: '#8b5cf6',
    permissions: {
      canReport: true,
      facultyPriority: true,
      canEndorse: true,
      canAssign: false,
      canUpdateStatus: false,
      canDelete: false,
      canBroadcast: false,
      canVerify: true,
      canUpvote: true,
    },
    description: 'Submit high-priority lab/classroom reports, endorse & escalate student tickets, and monitor academic facilities.',
  },
  ADMIN: {
    id: 'admin',
    role: 'ADMIN',
    name: 'Facilities Director',
    email: 'admin@fixmycampus.edu',
    title: 'Campus Operations & Estate Lead',
    department: 'Campus Infrastructure & Maintenance Office',
    avatar: 'AD',
    badge: 'Administrator',
    color: '#e34b55',
    permissions: {
      canReport: true,
      canEndorse: true,
      canAssign: true,
      canUpdateStatus: true,
      canDelete: true,
      canBroadcast: true,
      canVerify: true,
      canUpvote: true,
    },
    description: 'Manage workflow lifecycle, assign maintenance departments, add resolution remarks, broadcast notices, and audit tickets.',
  },
}

export const DEPARTMENTS = [
  'Campus IT & Network',
  'Civil & Plumbing Maintenance',
  'Electrical Maintenance',
  'AV & Classroom Systems',
  'Estate & Infrastructure',
  'Sanitation & Cleaning',
  'Campus Security',
]

export const STATUS_CHOICES = [
  'REPORTED',
  'UNDER_REVIEW',
  'ASSIGNED',
  'IN_PROGRESS',
  'RESOLVED',
  'VERIFIED',
  'CLOSED',
]

export function enrichUserProfile(user) {
  if (!user) return null
  const roleKey = (user.role || 'STUDENT').toUpperCase()
  const template = ROLES[roleKey] || ROLES.STUDENT

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
    : template.avatar

  return {
    ...template,
    ...user,
    role: roleKey,
    badge: template.badge,
    color: template.color,
    avatar: initials || template.avatar,
    description: template.description,
    permissions: template.permissions,
  }
}

