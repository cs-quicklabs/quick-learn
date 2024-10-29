'use client';
import React, { useEffect, useState } from 'react';
import ContentCard from '@src/shared/components/ContentCard';
import { TUserCourse, TUserRoadmap } from '@src/shared/types/contentRepository';
import { getUserRoadmapsService } from '@src/apiServices/contentRepositoryService';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roadmaps, setRoadmaps] = useState<TUserRoadmap[]>([]);
  const [courses, setCourses] = useState<TUserCourse[]>([]);

  useEffect(() => {
    const fetchUserContent = async () => {
      try {
        setIsLoading(true);
        const response = await getUserRoadmapsService();

        if (response.success) {
          const userRoadmaps = response.data;
          setRoadmaps(userRoadmaps);

          // Extract all courses from roadmaps
          const allCourses = userRoadmaps.reduce<TUserCourse[]>(
            (acc, roadmap) => {
              if (roadmap.courses) {
                return [...acc, ...roadmap.courses];
              }
              return acc;
            },
            [],
          );

          // Remove duplicate courses (if a course belongs to multiple roadmaps)
          const uniqueCourses = Array.from(
            new Map(allCourses.map((course) => [course.id, course])).values(),
          );

          setCourses(uniqueCourses);
        }
      } catch (err) {
        setError('Failed to load your learning content');
        console.error('Error fetching user content:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserContent();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Roadmaps Section */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-medium">My Roadmaps</h2>
          <span className="text-sm text-gray-500">
            ({roadmaps.length} roadmaps)
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {roadmaps.map((roadmap) => (
            <ContentCard
              key={roadmap.id}
              name={roadmap.name}
              title={roadmap.description}
              percentage={roadmap.percentage || 0}
            />
          ))}
        </div>
      </section>

      {/* Courses Section */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-medium">My Courses</h2>
          <span className="text-sm text-gray-500">
            ({courses.length} courses)
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {courses.map((course) => (
            <ContentCard
              key={course.id}
              name={course.name}
              title={course.description}
              percentage={course.percentage || 0}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
