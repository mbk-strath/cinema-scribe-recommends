
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, TrendingUp, MessageSquare } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getCommunities, getCommunityPosts, type Community, type CommunityPost } from '@/services/communityService';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const CommunityPage = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [recentPosts, setRecentPosts] = useState<CommunityPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [communitiesData, postsData] = await Promise.all([
          getCommunities(),
          getCommunityPosts()
        ]);
        setCommunities(communitiesData);
        setRecentPosts(postsData.slice(0, 10)); // Get latest 10 posts
      } catch (error) {
        console.error('Error loading community data:', error);
      }
    };

    loadData();
  }, []);

  const filteredCommunities = communities.filter(community =>
    community.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">Communities</h1>
            <p className="text-gray-600">Connect with fellow book and movie enthusiasts</p>
          </div>
          {user && (
            <Button asChild className="bg-navy hover:bg-navy-light">
              <Link to="/community/create">
                <Plus size={16} className="mr-2" />
                Create Community
              </Link>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Communities List */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Input
                placeholder="Search communities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>

            <div className="space-y-4">
              {filteredCommunities.map((community) => (
                <Link
                  key={community.id}
                  to={`/community/${community.name}`}
                  className="block bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center text-white font-bold">
                      {community.display_name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{community.display_name}</h3>
                      <p className="text-gray-600 text-sm mb-2">r/{community.name}</p>
                      {community.description && (
                        <p className="text-gray-700 mb-3">{community.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users size={14} />
                          {community.member_count} members
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Posts Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <TrendingUp size={20} />
                Recent Posts
              </h2>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/community/${post.community?.name}/post/${post.id}`}
                    className="block hover:bg-gray-50 p-3 rounded-lg transition-colors"
                  >
                    <h3 className="font-medium text-sm line-clamp-2 mb-1">{post.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>r/{post.community?.name}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <TrendingUp size={12} />
                        {post.upvotes - post.downvotes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare size={12} />
                        {post.comment_count}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CommunityPage;
