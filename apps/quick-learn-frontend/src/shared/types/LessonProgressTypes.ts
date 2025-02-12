import { TLesson } from './contentRepository';
import { TUser } from './userTypes';

export type LessonProgress = {
  lesson_id: number;
  completed_date: Date;
};

export type LessonStatus = {
  isRead: boolean;
  completed_date: string;
};

export type TDailyLessonResponse = {
  lesson_detail: TLesson;
  user_detail: TUser;
  user_lesson_read_info: LessonStatus;
};

export type UserLessonProgress = {
  course_id: number;
  lessons: {
    lesson_id: number;
    completed_date: string;
  }[];
};

export type LeaderboardData = {
  user_id: number;
  lessons_completed_count?: number;
  rank?: number;
  lessons_completed_count_monthly?: number;
  rank_monthly?: number;
  user: TUser;
  created_at: string;
};
