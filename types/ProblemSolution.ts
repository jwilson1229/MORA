// types/ProblemSolution.ts
export type ProblemSolution = {
  name: string;
  bundleName: string;
  description: string;
  requiredProductNames: string[];
  tags: string[];
  estimatedResale?: number;
  problem: string;
  store: string;
};

// 👇 Add this if you haven't already
export type ProblemSolutionMap = {
  [problem: string]: ProblemSolution[];
};
