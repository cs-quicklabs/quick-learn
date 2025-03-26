import TeamMemberListing from './TeamMemberListing';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Team • Quick Learn',
  description: 'Team List quick learn',
};

export default function TeamPage() {
  return <TeamMemberListing />;
}
