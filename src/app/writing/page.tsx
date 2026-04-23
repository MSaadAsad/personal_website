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
    <Container className="pt-14 min-h-screen">
      <div className="concrete-block concrete-edge concrete-header mt-32">
        <div>
          <h1 className="text-heading font-mono font-bold text-concrete-900 tracking-tight">
            BLOG
          </h1>
          <div className="section-divider" />
          <p className="mt-3 text-base text-concrete-700 font-mono max-w-2xl leading-relaxed">
            Essays, explorations, and creative work.
          </p>
        </div>
      </div>
      <WritingList posts={posts} />
    </Container>
  );
}
