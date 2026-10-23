import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Navbar } from '../../components/Navbar';
import { ExploreDrawer } from '../../components/ExploreDrawer';
import { HeroSection } from '../../components/HeroSection';
import { InfrastructureSection } from '../../components/InfrastructureSection';
import { CampusLifeSection } from '../../components/CampusLifeSection';
import { AdmissionsOverview } from '../../components/AdmissionsOverview';
import { EventGalleryModal } from '../../components/EventGalleryModal';
import { BlogsModal } from '../../components/BlogsModal';
import { UtilityModals } from '../../components/UtilityModals';
import { Footer } from '../../components/Footer';
import { UtilityItem } from '../../types';
import { GALLERY_ITEMS, BLOG_POSTS } from '../../data/schoolData';
import { Image as ImageIcon, BookOpen, Sparkles, ArrowRight } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(`/${user.role}/dashboard`);
    }
  }, [isAuthenticated, user, navigate]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isBlogsModalOpen, setIsBlogsModalOpen] = useState(false);
  const [isAdmissionsModalOpen, setIsAdmissionsModalOpen] = useState(false);
  const [activeUtility, setActiveUtility] = useState<UtilityItem['id'] | null>(null);
  const [highlightItem, setHighlightItem] = useState<string | undefined>(undefined);
  const [activeSection, setActiveSection] = useState<string>('hero');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectSectionItem = (category: 'infrastructure' | 'campus-life', itemTitle: string) => {
    setHighlightItem(itemTitle);
    scrollToSection(category);
  };

  const handleSelectTabFromDrawer = (tab: 'Event Gallery' | 'Blogs') => {
    if (tab === 'Event Gallery') {
      setIsGalleryModalOpen(true);
    } else {
      setIsBlogsModalOpen(true);
    }
    setIsDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* SCHOOL NAVBAR */}
      <Navbar
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenAdmissions={() => setIsAdmissionsModalOpen(true)}
        onOpenSearch={() => setActiveUtility('search')}
        activeSection={activeSection}
        onNavigateSection={scrollToSection}
      />

      {/* HERO BANNER */}
      <HeroSection
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenAdmissions={() => setIsAdmissionsModalOpen(true)}
      />

      {/* SLIDE-IN EXPLORE DRAWER FROM RIGHT SIDE */}
      <ExploreDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenAdmissions={() => setIsAdmissionsModalOpen(true)}
        onSelectUtility={(utilId) => setActiveUtility(utilId)}
        onSelectTab={handleSelectTabFromDrawer}
        onSelectSectionItem={handleSelectSectionItem}
      />

      {/* MAIN CONTENT SECTIONS */}
      <main className="flex-1">

        {/* INFRASTRUCTURE SECTION */}
        <InfrastructureSection
          highlightItem={highlightItem}
          onOpenAdmissions={() => setIsAdmissionsModalOpen(true)}
        />

        {/* CAMPUS LIFE SECTION */}
        <CampusLifeSection
          highlightItem={highlightItem}
          onOpenAdmissions={() => setIsAdmissionsModalOpen(true)}
        />

        {/* MEDIA & BLOGS SPOTLIGHT SECTION */}
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* EVENT GALLERY SPOTLIGHT CARD */}
              <div 
                onClick={() => setIsGalleryModalOpen(true)}
                className="group bg-gradient-to-br from-[#1E3A8A] to-blue-900 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between border-2 border-transparent hover:border-[#F5C518]"
              >
                <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-[#F5C518]/10 rounded-full blur-xl pointer-events-none"></div>

                <div>
                  <div className="inline-flex items-center gap-2 bg-[#F5C518] text-[#1E3A8A] px-3 py-1 rounded-full text-xs font-bold font-poppins mb-4">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>EVENT GALLERY</span>
                  </div>

                  <h3 className="text-2xl font-bold font-poppins text-white group-hover:text-[#F5C518] transition-colors">
                    Explore RIPS Photo Gallery
                  </h3>

                  <p className="text-blue-100 text-xs sm:text-sm mt-2 font-light">
                    Browse recent photos from Annual Sports Meet, Inter-School Robotics Championship, Cultural Fests, and NCC Parades.
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between pt-4 border-t border-blue-800">
                  <span className="text-xs font-poppins font-semibold text-[#F5C518]">
                    {GALLERY_ITEMS.length} Albums Available
                  </span>
                  <span className="text-xs font-bold font-poppins text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Full Gallery <ArrowRight className="w-4 h-4 text-[#F5C518]" />
                  </span>
                </div>
              </div>

              {/* BLOGS SPOTLIGHT CARD */}
              <div 
                onClick={() => setIsBlogsModalOpen(true)}
                className="group bg-gradient-to-br from-slate-900 to-[#1E3A8A] text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between border-2 border-transparent hover:border-[#F5C518]"
              >
                <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-blue-500/10 rounded-full blur-xl pointer-events-none"></div>

                <div>
                  <div className="inline-flex items-center gap-2 bg-amber-100 text-[#1E3A8A] px-3 py-1 rounded-full text-xs font-bold font-poppins mb-4">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>EDUCATIONAL BLOGS</span>
                  </div>

                  <h3 className="text-2xl font-bold font-poppins text-white group-hover:text-[#F5C518] transition-colors">
                    RIPS Educational Insights & Blogs
                  </h3>

                  <p className="text-slate-300 text-xs sm:text-sm mt-2 font-light">
                    Articles authored by principal, faculty, and counsellors on modern pedagogy, early STEM learning, and holistic parenting.
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-800">
                  <span className="text-xs font-poppins font-semibold text-[#F5C518]">
                    {BLOG_POSTS.length} Articles Published
                  </span>
                  <span className="text-xs font-bold font-poppins text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read RIPS Articles <ArrowRight className="w-4 h-4 text-[#F5C518]" />
                  </span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* INLINE ADMISSIONS OVERVIEW 2027–28 SECTION */}
        <AdmissionsOverview />

      </main>

      {/* FOOTER */}
      <Footer
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenAdmissions={() => setIsAdmissionsModalOpen(true)}
        onNavigateSection={scrollToSection}
      />

      {/* MODALS */}
      <EventGalleryModal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
      />

      <BlogsModal
        isOpen={isBlogsModalOpen}
        onClose={() => setIsBlogsModalOpen(false)}
      />

      {isAdmissionsModalOpen && (
        <AdmissionsOverview
          isModal={true}
          onClose={() => setIsAdmissionsModalOpen(false)}
        />
      )}

      <UtilityModals
        activeUtility={activeUtility}
        onClose={() => setActiveUtility(null)}
        onOpenAdmissions={() => {
          setActiveUtility(null);
          setIsAdmissionsModalOpen(true);
        }}
      />

    </div>
  );
}
