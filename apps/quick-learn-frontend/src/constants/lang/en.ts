export const en = {
  contentRepository: {
    contentRepository: 'Content Repository',
    allRoadmaps: 'All Roadmaps',
    roadmaps: 'roadmaps',
    courses: 'courses',
    createNewRoadmap: 'Create New Roadmap',
    allCourses: 'All Courses',
    editRoadmap: 'Edit Roadmap',
    createdThisRoadmapOn: 'created this roadmap on',
    addOnAlreadyExistingCourse: 'Add already existing courses to this roadmap',
    archiveRoadmap: 'Archive Roadmap',
    editCourse: 'Edit Course',
    assignToRoadmap: 'Move or add this course to another Roadmap',
    archiveCourse: 'Archive Course',
  },
  roadmapDetails: {
    createNewCourse: 'Create New Course',
    addExistingCourses: 'Add existing Courses',
    archiveConfirmHeading: 'Are you sure you want to Archive this roadmap?',
    archiveConfirmSubHeading:
      'When this roadmaps is archived, all courses and lessons under this are archived. Additionally, other users can not see this roadmaps and its courses even if it was assigned to them.',
  },
  courseDetails: {
    addExistingRoadmaps: 'Add or Move this course to another Roadmap',
    archiveConfirmHeading: 'Are you sure you want to archive this course?',
    archiveConfirmSubHeading:
      'When this course is archived, all lessons under this are archived. Additionally, other users can not see this course and its lessons even if it was assigned to them.',
  },
  addEditRoadMapModal: {
    addRoadmap: 'Create New Roadmap',
    editRoadmap: 'Edit Roadmap',
  },
  addEditCourseModal: {
    addCourse: 'Create New Course',
    editCourse: 'Edit Course',
  },
  accountSetting: {
    skillDeleteError:
      'This skill is associated with some team members and therefore can not be deleted. Please assign different skill to those team members before deleting this skill.',
    skillDeleteTitle: 'Failed to delete skill',
    RoadmapDeleteError:
      'This roadmap category is associated with some roadmaps and therefore can not be deleted. Please assign different roadmap category to those roadmaps before deleting this roadmap category.',
    RoadmapDeleteTitle: 'Failed to delete roadmap category',
    courseDeleteError:
      'This course category is associated with some courses and therefore can not be deleted. Please assign different course category to those courses before deleting this course category.',
    courseDeleteTitle: 'Failed to delete course category',
  },
  lesson: {
    createNewLesson: 'Create New Lesson',
    titleRequired: 'Title is required',
    contentRequired: 'Content is required',
    titleMaxLength: 'Title cannot exceed 50 characters',
    pendingApproval: 'Pending for approval',
  },
  common: {
    cancel: 'Cancel',
    lessons: 'lessons',
    roadmaps: 'roadmaps',
    courses: 'courses',
    participants: 'participants',
    name: 'Name',
    description: 'Description',
    roadmapCategory: 'Roadmap Category',
    rememberMe: 'Remember me',
    courseCategory: 'Course Category',
    selectCourses: 'Select Courses',
    save: 'Save',
    selectRoadmaps: 'Select Roadmaps',
    logoutConformation: 'Are you sure you want to Log out?',
    yes: 'Yes',
    no: 'No',
    teamSettings: 'Organizational Settings',
    changeSettingsOfYourTeam: 'Change settings of your organization.',
    noResultFound: 'No result found',
    firstNameError: 'First name cannot exceed 50 characters.',
    lastNameError: 'Last name cannot exceed 50 characters.',
    fieldRequired: 'This field is required',
    ok: 'ok',
    addLesson: 'Add Lesson',
    addTitlePlaceholder: 'Enter title',
    addContentPlaceholder: 'Type your content here...',
    lessonSaveAndApprovalButton: 'Save & send for approval',
  },
  courseCategories: {
    heading: 'Courses Categories',
    subHeading:
      'Courses can belong to a category. A category could be a way to group learning courses. For example, a you can create a learning course from a book, a blog, a video, for a software application or for any onboarding needs.',
    inputlabel: 'Add new course category',
    inputPlaceHolder: 'Engineering',
    tableName: 'Category name',
  },
  primarySkills: {
    inputLabel: 'Add new Skill',
    inputPlaceHolder: 'iOS Developer',
    heading: 'Primary Skills',
    subHeading:
      'Primary skill can be assigned to a person which tells the main trade of a candidate.',
    tableName: 'skill name',
  },
  roadmapCategories: {
    inputLabel: 'Add New Roadmap Category',
    inputPlaceHolder: 'Engineering',
    heading: 'Roadmap Categories',
    subHeading:
      'Roadmaps can belong to a category. A category could be a way to group learning roadmaps. For example, a department can have a category called "Engineering" and all the roadmaps related to engineering can be added to this category.',
    tableName: 'Category name',
  },
};
