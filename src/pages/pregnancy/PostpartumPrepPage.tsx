import PageLayout from '@/components/layout/PageLayout';
import { PostpartumPrepGuide } from '@/components/pregnancy/PostpartumPrepGuide';

const PostpartumPrepPage = () => (
  <PageLayout>
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <PostpartumPrepGuide />
    </div>
  </PageLayout>
);

export default PostpartumPrepPage;
