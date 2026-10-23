import React from 'react';

// Maps to all status strings in the system
export type BadgeStatus = 
  | 'paid' | 'present' | 'active' | 'approved'
  | 'due' | 'absent' | 'overdue' | 'rejected'
  | 'pending' | 'half-day' | 'partial'
  | 'inactive' | 'waived' | 'scholarship'
  | 'online'
  | 'holiday' | 'general-notice';

interface BadgeProps {
  status: string; // The raw status string from DB
}

/**
 * Standardized status Badge component mapping to 06_DESIGN_SYSTEM.md section 5.
 */
export const Badge: React.FC<BadgeProps> = ({ status }) => {
  const normalizedStatus = status.toLowerCase().replace('_', '-') as BadgeStatus;

  let bgClass = "bg-slate-100";
  let textClass = "text-slate-700";

  // Pattern matching based on Design System rules
  if (['paid', 'present', 'active', 'approved'].includes(normalizedStatus)) {
    bgClass = "bg-[#EAF3DE]"; textClass = "text-[#27500A]";
  } else if (['due', 'absent', 'overdue', 'rejected'].includes(normalizedStatus)) {
    bgClass = "bg-[#FCEBEB]"; textClass = "text-[#791F1F]";
  } else if (['pending', 'half-day', 'partial'].includes(normalizedStatus)) {
    bgClass = "bg-[#FAEEDA]"; textClass = "text-[#633806]";
  } else if (['inactive', 'waived', 'scholarship'].includes(normalizedStatus)) {
    bgClass = "bg-[#F1EFE8]"; textClass = "text-[#444441]";
  } else if (['online'].includes(normalizedStatus)) {
    bgClass = "bg-[#E6F1FB]"; textClass = "text-[#0C447C]";
  } else if (['holiday', 'general-notice'].includes(normalizedStatus)) {
    bgClass = "bg-[#E1F5EE]"; textClass = "text-[#085041]";
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${bgClass} ${textClass} uppercase tracking-wider`}>
      {status.replace('_', ' ')}
    </span>
  );
};
