// English localization constants for the application
export const en = {
  /**
   * Common strings used throughout the application
   */
  common: {
    // Actions
    save: 'Save',
    saveAndPublish: 'Save & Publish',
    cancel: 'Cancel',
    ok: 'ok',
    yes: 'Yes',
    no: 'No',

    // Content types
    lesson: 'lesson',
    lessons: 'lessons',
    roadmaps: 'roadmaps',
    courses: 'courses',
    participants: 'participants',

    // Form fields
    name: 'Name',
    description: 'Description',
    roadmapCategory: 'Roadmap Category',
    courseCategory: 'Course Category',
    rememberMe: 'Remember me',
    selectCourses: 'Select Courses',
    selectRoadmaps: 'Select Roadmaps',

    // Team settings
    teamSettings: 'Organizational Settings',
    changeSettingsOfYourTeam: 'Change settings of your organization.',

    // Validation messages
    firstNameError: 'First name cannot exceed 50 characters.',
    lastNameError: 'Last name cannot exceed 50 characters.',
    fieldRequired: 'This field is required',
    noResultFound: 'No result found',
    somethingWentWrong: 'Something went wrong',

    // Lessons
    addLesson: 'Add Lesson',
    addTitlePlaceholder: 'Enter title',
    addContentPlaceholder: 'Type your content here...',
    lessonSaveAndApprovalButton: 'Save & send for approval',

    // Metadata
    updatedOn: 'Updated on',
    createdOn: 'Created on',
    createdBy: 'Created by',

    // Confirmation dialogs
    logoutConformation: 'Are you sure you want to Log out?',
  },

  /**
   * Content Repository section strings
   */
  contentRepository: {
    contentRepository: 'Content Repository',
    // Roadmaps
    allRoadmaps: 'All Roadmaps',
    roadmaps: 'roadmaps',
    createNewRoadmap: 'Create New Roadmap',
    editRoadmap: 'Edit Roadmap',
    createdThisRoadmapOn: 'created this roadmap on',
    archiveRoadmap: 'Archive Roadmap',

    // Courses
    courses: 'courses',
    allCourses: 'All Courses',
    editCourse: 'Edit Course',
    addOnAlreadyExistingCourse: 'Add already existing courses to this roadmap',
    assignToRoadmap: 'Move or add this course to another Roadmap',
    archiveCourse: 'Archive Course',
  },

  /**
   * Roadmap Details section
   */
  roadmapDetails: {
    createNewCourse: 'Create New Course',
    addExistingCourses: 'Add existing Courses',
    archiveConfirmHeading: 'Are you sure you want to Archive this roadmap?',
    archiveConfirmSubHeading:
      'When this roadmaps is archived, all courses and lessons under this are archived. Additionally, other users can not see this roadmaps and its courses even if it was assigned to them.',
  },

  /**
   * Course Details section
   */
  courseDetails: {
    addExistingRoadmaps: 'Add or Move this course to another Roadmap',
    archiveConfirmHeading: 'Are you sure you want to archive this course?',
    archiveConfirmSubHeading:
      'When this course is archived, all lessons under this are archived. Additionally, other users can not see this course and its lessons even if it was assigned to them.',
  },

  /**
   * Modal strings for adding/editing roadmaps and courses
   */
  addEditRoadMapModal: {
    addRoadmap: 'Create New Roadmap',
    editRoadmap: 'Edit Roadmap',
  },

  addEditCourseModal: {
    addCourse: 'Create New Course',
    editCourse: 'Edit Course',
  },

  /**
   * Account Settings section
   */
  accountSetting: {
    // Skill management
    skillDeleteError:
      'This skill is associated with some team members and therefore can not be deleted. Please assign different skill to those team members before deleting this skill.',
    skillDeleteTitle: 'Failed to delete skill',

    // Roadmap category management
    RoadmapDeleteError:
      'This roadmap category is associated with some roadmaps and therefore can not be deleted. Please assign different roadmap category to those roadmaps before deleting this roadmap category.',
    RoadmapDeleteTitle: 'Failed to delete roadmap category',

    // Course category management
    courseDeleteError:
      'This course category is associated with some courses and therefore can not be deleted. Please assign different course category to those courses before deleting this course category.',
    courseDeleteTitle: 'Failed to delete course category',
  },

  /**
   * Lesson management section
   */
  lesson: {
    createNewLesson: 'Create New Lesson',
    // Validation messages
    titleRequired: 'Title is required',
    contentRequired: 'Content is required',
    titleMaxLength: 'Title cannot exceed 50 characters',
    pendingApproval: 'Pending for approval',
  },

  /**
   * Approvals section
   */
  approvals: {
    lessonsApprovals: 'Lessons Approvals',
    subHeading: 'Manage all your existing team members or add a new one.',
    approveThisLesson: 'Approve this lesson',
  },

  /**
   * Categories and Skills management
   */
  courseCategories: {
    heading: 'Courses Categories',
    subHeading:
      'Courses can belong to a category. A category could be a way to group learning courses. For example, a you can create a learning course from a book, a blog, a video, for a software application or for any onboarding needs.',
    inputlabel: 'Add new course category',
    inputPlaceHolder: 'Engineering',
    tableName: 'Category name',
  },

  primarySkills: {
    heading: 'Primary Skills',
    subHeading:
      'Primary skill can be assigned to a person which tells the main trade of a candidate.',
    inputLabel: 'Add new Skill',
    inputPlaceHolder: 'iOS Developer',
    tableName: 'skill name',
  },

  roadmapCategories: {
    heading: 'Roadmap Categories',
    subHeading:
      'Roadmaps can belong to a category. A category could be a way to group learning roadmaps. For example, a department can have a category called "Engineering" and all the roadmaps related to engineering can be added to this category.',
    inputLabel: 'Add New Roadmap Category',
    inputPlaceHolder: 'Engineering',
    tableName: 'Category name',
  },

  /**
   * Archived items section
   */
  teamMemberDetails: {
    assignNewRoadmap: 'Assign New Roadmap',
  },
  archivedSection: {
    // Archived users
    archivedUsers: 'Archived Users',
    archivedUsersSubtext: ' Following users have been deactivated.',
    confirmActivateUser: 'Are you sure you want to activate this user?',
    confirmActivateUserSubtext:
      'Once this user is activated, they will be able to access the system and perform actions based on their roles and permissions.',
    confirmDeleteUser: 'Are you sure you want to delete this user?',
    confirmDeleteUserSubtext:
      'All the information regarding this user will be lost. If this user has created some content, it will be assigned to the super admin.',

    // Archived roadmaps
    archivedRoadmaps: 'Archived Roadmaps',
    archivedRoadmapsSubtext: 'Following roadmaps have been archived.',
    confirmActivateRoadmap: 'Are you sure you want to activate this roadmap?',
    confirmActivateRoadmapSubtext:
      'Once this roadmaps is restored, users will be able to see it and if they made some progress on it in the past, that will also be restored.',
    confirmDeleteRoadmap: 'Are you sure you want to delete this roadmap?',
    confirmDeleteRoadmapSubtext:
      'All the information regarding this roadmap will be lost. If this was assigned to any user, they will not be able to access this roadmap anymore.',

    // Archived courses
    archivedCourses: 'Archived Courses',
    archivedCoursesSubtext: 'Following courses have been archived.',
    confirmActivateCourse: 'Are you sure you want to activate this course?',
    confirmActivateCourseSubtext:
      'Once this course is activated, it will be visible to all the users and they will be able to access it. If they made some progress on it in past, that information will also be restored.',
    confirmDeleteCourse: 'Are you sure you want to delete this course?',
    confirmDeleteCourseSubtext:
      'All the information regarding this course will be lost. Users will not be able to see it, if they made any progress on it in past, that information will also be lost. This action is not reversible.',

    // Archived lessons
    archivedLessons: 'Archived Lessons',
    archivedLessonsSubtext: 'Following lessons have been archived.',
    confirmActivateLesson: 'Are you sure you want to activate this lesson?',
    confirmActivateLessonSubtext:
      'Once this lesson is restored, users will be able to see it and access its content.',
    confirmDeleteLesson: 'Are you sure you want to delete this lesson?',
    confirmDeleteLessonSubtext:
      'All the information regarding this lesson will be lost. This action cannot be undone.',
  },

  /**
   * Community Course section
   */
  CommunityCouse: {
    heading: 'Community Courses',
    description:
      'Following courses have been made public by community members. You can copy these courses to your organization and make changes as per your requirements.',
    course: 'Courses',
  },
};
