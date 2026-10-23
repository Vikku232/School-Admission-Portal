import React, { useState } from 'react';
import { X, BookOpen, User, Calendar, Clock, ArrowRight } from 'lucide-react';
import { BLOG_POSTS } from '../data/schoolData';
import { BlogPost } from '../types';

interface BlogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BlogsModal: React.FC<BlogsModalProps> = ({ isOpen, onClose }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-8 flex flex-col max-h-[90vh]">
        
        {/* HEADER BLOCK - Navy #1E3A8A */}
        <div className="bg-[#1E3A8A] text-white p-6 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#F5C518] text-[#1E3A8A] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full font-poppins">
                RIPS Thought Leadership
              </span>
            </div>
            <h3 className="text-2xl font-bold font-poppins flex items-center gap-2.5">
              <BookOpen className="w-6 h-6 text-[#F5C518]" />
              RIPS Blogs & Educational Insights
            </h3>
            <p className="text-blue-100 text-xs mt-1">
              Articles by educators, principal, and faculty on pedagogy, STEM, sports, and holistic parenting.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white text-[#1E3A8A] flex items-center justify-center hover:bg-slate-100 transition-all shadow-md cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 overflow-y-auto flex-1">
          {selectedPost ? (
            /* DETAILED BLOG VIEW */
            <div className="space-y-6">
              <button
                onClick={() => setSelectedPost(null)}
                className="text-xs font-bold text-[#1E3A8A] hover:underline flex items-center gap-1 cursor-pointer"
              >
                ← Back to all articles
              </button>

              <div className="rounded-xl overflow-hidden h-64 bg-slate-100">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                  <span className="bg-blue-100 text-[#1E3A8A] font-bold px-2.5 py-0.5 rounded font-poppins">
                    {selectedPost.category}
                  </span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {selectedPost.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {selectedPost.readTime}</span>
                </div>

                <h2 className="text-2xl font-bold font-poppins text-[#1E3A8A] mb-2">
                  {selectedPost.title}
                </h2>

                <p className="text-xs font-semibold text-slate-600 mb-6 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#1E3A8A]" /> Author: {selectedPost.author}
                </p>

                <div className="prose text-slate-700 text-sm leading-relaxed space-y-4 border-t border-slate-100 pt-4">
                  <p className="font-medium text-slate-900 text-base">
                    {selectedPost.excerpt}
                  </p>
                  <p>
                    {selectedPost.content}
                  </p>
                  <p>
                    Educational excellence at Royal International Public School is centered on nurturing inquiring, knowledgeable, and caring young minds. We believe that by integrating state-of-the-art technological tools with timeless ethical values, our students emerge as confident global citizens ready to tackle real-world challenges.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* LIST OF BLOG POSTS */
            <div className="space-y-6">
              {BLOG_POSTS.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="group bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col md:flex-row gap-6"
                >
                  <div className="md:w-1/3 h-44 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="md:w-2/3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-[11px] text-slate-500">
                        <span className="bg-amber-100 text-[#1E3A8A] font-bold px-2 py-0.5 rounded font-poppins">
                          {post.category}
                        </span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                      </div>

                      <h4 className="text-lg font-bold font-poppins text-slate-900 group-hover:text-[#1E3A8A] transition-colors">
                        {post.title}
                      </h4>

                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">
                        By {post.author}
                      </span>
                      <span className="text-xs font-bold font-poppins text-[#1E3A8A] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Read Article <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
