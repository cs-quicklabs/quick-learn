import React from 'react';

interface RouteTabProps {
  id: Number;
  name: String;
  course_id?: Number;
  roadmap_id?: Number;
}

const RouteTab: React.FC<RouteTabProps> = ({
  id,
  name,
  course_id,
  roadmap_id,
}) => {
  return <div>{name}</div>;
};

export default RouteTab;
