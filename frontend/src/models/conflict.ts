export interface ConflictPerson {
  id: string;
  name: string;
  email: string;
  affiliation: string;
}

export interface ConflictPaper {
  id: string;
  title: string;
}

export interface Conflict {
  member: ConflictPerson;
  author: ConflictPerson;
  reason: string;
  papers: ConflictPaper[];
}

/**
 * Maps API response to Conflict model
 */
export const mapConflicts = (conflicts: any[]): Conflict[] => {
  return conflicts.map(conflict => ({
    member: {
      id: conflict.member?.id || '',
      name: conflict.member?.name || '',
      email: conflict.member?.email || '',
      affiliation: conflict.member?.affiliation || '',
    },
    author: {
      id: conflict.author?.id || '',
      name: conflict.author?.name || '',
      email: conflict.author?.email || '',
      affiliation: conflict.author?.affiliation || '',
    },
    reason: conflict.reason || '',
    papers: (conflict.papers || []).map((paper: any) => ({
      id: paper.id || '',
      title: paper.title || '',
    }))
  }));
};