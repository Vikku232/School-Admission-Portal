import React, { useState } from 'react';
import { X, Image as ImageIcon, Calendar, Filter, Sparkles } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/schoolData';
import { GalleryItem } from '../types';

interface EventGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EventGalleryModal: React.FC<EventGalleryModalProps> = ({ isOpen, onClose }) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  if (!isOpen) return null;

  const categories = ['All', 'Sports', 'Academic', 'Cultural', 'Infrastructure', 'Celebration'];

  const filteredItems = activeFilter === 'All' 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === activeFilter);

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-8 flex flex-col max-h-[90vh]">
        
        {/* HEADER BLOCK - Navy #1E3A8A */}
        <div className="bg-[#1E3A8A] text-white p-6 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#F5C518] text-[#1E3A8A] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full font-poppins">
                RIPS Media
              </span>
            </div>
            <h3 className="text-2xl font-bold font-poppins flex items-center gap-2.5">
              <ImageIcon className="w-6 h-6 text-[#F5C518]" />
              RIPS Event Gallery
            </h3>
            <p className="text-blue-100 text-xs mt-1">
              Photographic highlights from academic competitions, cultural fests, and sports meets.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white text-[#1E3A8A] flex items-center justify-center hover:bg-slate-100 transition-all shadow-md cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* CATEGORY FILTERS */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto shrink-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-poppins font-semibold transition-all shrink-0 cursor-pointer ${
                activeFilter === cat
                  ? 'bg-[#1E3A8A] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* GALLERY GRID */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedImage(item)}
                className="group bg-white rounded-xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-[#1E3A8A] text-[#F5C518] text-[10px] font-bold font-poppins px-2 py-0.5 rounded-md shadow-xs">
                    {item.category}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-poppins font-bold text-slate-900 text-sm group-hover:text-[#1E3A8A] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-slate-600 text-xs mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {item.date}
                    </span>
                    <span className="font-semibold text-[#1E3A8A] group-hover:underline">View Photo</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LIGHTBOX MODAL IF SELECTED */}
        {selectedImage && (
          <div className="fixed inset-0 bg-slate-950/90 z-60 flex items-center justify-center p-4">
            <div className="max-w-3xl w-full bg-slate-900 rounded-2xl overflow-hidden text-white border border-slate-800 relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white text-white hover:text-slate-900 p-2 rounded-full transition-colors z-10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full max-h-[65vh] object-contain bg-black"
              />
              <div className="p-5 bg-slate-900">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#F5C518] text-[#1E3A8A] text-[10px] font-bold px-2 py-0.5 rounded font-poppins">
                    {selectedImage.category}
                  </span>
                  <span className="text-xs text-slate-400">{selectedImage.date}</span>
                </div>
                <h4 className="text-lg font-bold font-poppins text-white">{selectedImage.title}</h4>
                <p className="text-slate-300 text-sm mt-1">{selectedImage.description}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
