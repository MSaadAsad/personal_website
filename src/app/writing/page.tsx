import { Container } from '@/components/layout/Container';
import { WritingList } from '../../components/writing/WritingList';
import { getAllWriting } from '@/lib/mdx';

export const metadata = {
  title: 'Blog',
  description: 'Essays, explorations, and creative work.',
};

export default function WritingPage() {
  const posts = getAllWriting();

  return (
    <Container className="pt-10 pb-16 md:pt-12 md:pb-20 min-h-screen">
      <div className="concrete-block concrete-edge concrete-header">
        <div>
          <h1 className="text-heading font-mono font-bold text-concrete-900 tracking-tight">
            BLOG
          </h1>
          <div className="section-divider" />
          <p className="mt-3 text-base text-concrete-800 font-mono max-w-2xl leading-relaxed">
            Essays, explorations, and creative work.
          </p>
        </div>
      </div>
      <WritingList posts={posts} />
    </Container>
  );
}
