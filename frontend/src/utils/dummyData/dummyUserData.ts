import { UserData, UserProfileResponse } from '../../models/user';

/**
 * Sample user data for development and testing purposes
 */
export const dummyUsers: UserData[] = [
  {
    id: 'user-001',
    name: 'Atilla Emre',
    surname: 'Söylemez',
    email: 'emre.soylemez@bilkent.edu.tr',
    bio: 'CS Student with a focus on machine learning and conference management systems.',
    roles: {
      active: [
        { 
          name: 'RECOMB2025, PC Member (TRACK1)', 
          conferenceId: 'conf-001',
          trackId: 'track-001'
        },
        { 
          name: 'CS FAIR, Superchair',
          conferenceId: 'conf-002'
        },
        { 
          name: 'YTTW2025, Track Chair',
          conferenceId: 'conf-003',
          trackId: 'track-005'
        }
      ],
      past: [
        { 
          name: 'RECOMB2024, PC Member (TRACK1)', 
          conferenceId: 'conf-004',
          trackId: 'track-007'
        },
        { 
          name: 'RECOMB2023, Track Chair (TRACK2)',
          conferenceId: 'conf-005',
          trackId: 'track-009'
        }
      ]
    },
    stats: {
      totalReviews: 210,
      conferencesWorked: 5,
      submissions: 3,
      otherStats: [
        { label: 'Average Review Score', value: '4.5/5' },
        { label: 'Review Timeliness', value: '95%' },
        { label: 'Papers Published', value: '7' },
        { label: 'H-index', value: '5' },
        { label: 'Citation Count', value: '152' }
      ]
    },
    auth_provider: 'google',
    google_id: 'google-id-12345',
    orcid_id: null,
    created_at: '2023-10-15T14:30:00Z',
    updated_at: '2025-03-28T09:15:00Z'
  },
  {
    id: 'user-002',
    name: 'Jane',
    surname: 'Smith',
    email: 'jane.smith@example.com',
    bio: 'Professor of Computer Science with expertise in distributed systems and blockchain technology.',
    roles: {
      active: [
        { 
          name: 'ICSE2025, Program Chair',
          conferenceId: 'conf-006'
        },
        { 
          name: 'CVPR2025, Area Chair (Computer Vision)',
          conferenceId: 'conf-007',
          trackId: 'track-011'
        }
      ],
      past: [
        { 
          name: 'ICSE2024, PC Member',
          conferenceId: 'conf-008',
          trackId: 'track-012'
        },
        { 
          name: 'FSE2024, Workshop Organizer',
          conferenceId: 'conf-009'
        },
        { 
          name: 'OSDI2023, PC Member',
          conferenceId: 'conf-010',
          trackId: 'track-014'
        }
      ]
    },
    stats: {
      totalReviews: 342,
      conferencesWorked: 8,
      submissions: 12,
      otherStats: [
        { label: 'Average Review Score', value: '4.8/5' },
        { label: 'Review Timeliness', value: '98%' },
        { label: 'Papers Published', value: '45' },
        { label: 'H-index', value: '22' },
        { label: 'Citation Count', value: '2,450' }
      ]
    },
    auth_provider: 'orcid',
    google_id: null,
    orcid_id: 'orcid-id-67890',
    created_at: '2022-05-20T10:45:00Z',
    updated_at: '2025-04-10T16:20:00Z'
  },
  {
    id: 'user-003',
    name: 'Carlos',
    surname: 'Rodriguez',
    email: 'c.rodriguez@research.org',
    bio: 'Research scientist specializing in natural language processing and knowledge representation.',
    roles: {
      active: [
        { 
          name: 'ACL2025, PC Member',
          conferenceId: 'conf-011',
          trackId: 'track-020'
        }
      ],
      past: [
        { 
          name: 'EMNLP2024, Workshop Chair',
          conferenceId: 'conf-012'
        },
        { 
          name: 'NeurIPS2023, Reviewer',
          conferenceId: 'conf-013',
          trackId: 'track-025'
        }
      ]
    },
    stats: {
      totalReviews: 156,
      conferencesWorked: 4,
      submissions: 8,
      otherStats: [
        { label: 'Average Review Score', value: '4.3/5' },
        { label: 'Review Timeliness', value: '92%' },
        { label: 'Papers Published', value: '18' },
        { label: 'H-index', value: '11' },
        { label: 'Citation Count', value: '805' }
      ]
    },
    auth_provider: 'google',
    google_id: 'google-id-24680',
    orcid_id: 'orcid-id-13579',
    created_at: '2023-02-08T09:30:00Z',
    updated_at: '2025-01-15T11:45:00Z'
  }
];

/**
 * Sample user profile API response
 */
export const dummyUserProfileResponse: UserProfileResponse = {
  user: dummyUsers[0],
  status: 'success',
  message: 'User profile retrieved successfully'
};

/**
 * Get a dummy user by ID
 * @param id The user ID to search for
 * @returns The found user or undefined
 */
export const getDummyUserById = (id: string): UserData | undefined => {
  return dummyUsers.find(user => user.id === id);
};

/**
 * Get a dummy user by email
 * @param email The user email to search for
 * @returns The found user or undefined
 */
export const getDummyUserByEmail = (email: string): UserData | undefined => {
  return dummyUsers.find(user => user.email === email);
};

export default dummyUsers;