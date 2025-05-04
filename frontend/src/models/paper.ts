import { Person } from "../reducer/initailState";

export interface Paper {
    _id: string;
    id: string;
    title: string;
    abstract: string;
    keywords: any[]; // parsed keywords
    paperPath: string;
    authors: Person[]; // parsed authors
    track: string;
    createdBy: string;
    createdAt: string;
}

export const mapResponseToPaper = (data: any): Paper => {
    return {
        _id: data._id,
        id: data.id,
        title: data.title,
        abstract: data.abstract,
        keywords: Array.isArray(data.keywords)
            ? data.keywords.map((kw: string) => {
                  try {
                      return JSON.parse(kw);
                  } catch {
                      return kw;
                  }
              })
            : [],
        paperPath: data.paper_path,
        authors: Array.isArray(data.authors)
            ? data.authors.map((auth: string) => {
                  try {
                      return JSON.parse(auth);
                  } catch {
                      return auth;
                  }
              })
            : [],
        track: data.track,
        createdBy: data.created_by,
        createdAt: data.created_at?.$date ? data.created_at.$date : data.created_at,
    };
};