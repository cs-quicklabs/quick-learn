export type LessonProgress = {
  lesson_id: number;
  completed_date: Date;
};

export type LessonStatus = {
  isRead: boolean;
};

export type UserLessonProgress = {
  course_id: number;
  lessons: {
    lesson_id: number;
    completed_date: string;
  }[];
};
