import { expect, test, describe } from "bun:test";
import { generateRecommendations, type QuizAnswers } from "./quiz-logic";

const defaultAnswers: QuizAnswers = {
  email: "test@example.com",
  current_country: "UK",
  visa_purpose: [],
  has_job_offer: false,
  has_family_sponsor: false,
  english_level: "none",
  education_level: "high_school",
  work_experience_years: 0,
  age_range: "45+",
};

describe("generateRecommendations", () => {
  test("should return empty array if no criteria met", () => {
    const recommendations = generateRecommendations(defaultAnswers);
    expect(recommendations).toEqual([]);
  });

  describe("Work Visas", () => {
    test("should recommend 482 visa if user has job offer and purpose is work", () => {
      const answers: QuizAnswers = {
        ...defaultAnswers,
        visa_purpose: ["work"],
        has_job_offer: true,
      };
      const recommendations = generateRecommendations(answers);
      const visa482 = recommendations.find(r => r.visa_id === "482");
      expect(visa482).toBeDefined();
      expect(visa482?.eligibility_score).toBe(95);
      expect(visa482?.reasons).toContain("You have a job offer");
    });

    test("should recommend 189 visa if user has 3+ years experience and English proficiency", () => {
      const answers: QuizAnswers = {
        ...defaultAnswers,
        visa_purpose: ["work"],
        work_experience_years: 3,
        english_level: "proficient",
      };
      const recommendations = generateRecommendations(answers);
      const visa189 = recommendations.find(r => r.visa_id === "189");
      expect(visa189).toBeDefined();
      expect(visa189?.eligibility_score).toBe(85);
      expect(visa189?.reasons).toContain("3+ years work experience");
    });

    test("189 visa score should be lower (70) if user also has a job offer", () => {
      const answers: QuizAnswers = {
        ...defaultAnswers,
        visa_purpose: ["work"],
        work_experience_years: 5,
        english_level: "native",
        has_job_offer: true,
      };
      const recommendations = generateRecommendations(answers);
      const visa189 = recommendations.find(r => r.visa_id === "189");
      expect(visa189?.eligibility_score).toBe(70);
    });

    test("should recommend 485 visa for PhD or Masters graduates", () => {
      const answers: QuizAnswers = {
        ...defaultAnswers,
        visa_purpose: ["work"],
        education_level: "phd",
      };
      const recommendations = generateRecommendations(answers);
      const visa485 = recommendations.find(r => r.visa_id === "485");
      expect(visa485).toBeDefined();
      expect(visa485?.eligibility_score).toBe(90);
    });
  });

  describe("Family Visas", () => {
    test("should recommend 820 visa if purpose is family and has sponsor", () => {
      const answers: QuizAnswers = {
        ...defaultAnswers,
        visa_purpose: ["family"],
        has_family_sponsor: true,
      };
      const recommendations = generateRecommendations(answers);
      const visa820 = recommendations.find(r => r.visa_id === "820");
      expect(visa820).toBeDefined();
      expect(visa820?.eligibility_score).toBe(95);
    });
  });

  describe("Student Visas", () => {
    test("should recommend 500 visa if purpose is study", () => {
      const answers: QuizAnswers = {
        ...defaultAnswers,
        visa_purpose: ["study"],
      };
      const recommendations = generateRecommendations(answers);
      const visa500 = recommendations.find(r => r.visa_id === "500");
      expect(visa500).toBeDefined();
      expect(visa500?.eligibility_score).toBe(90);
    });
  });

  describe("Working Holiday Visas", () => {
    test("should recommend 417 visa for young applicants (18-24)", () => {
      const answers: QuizAnswers = {
        ...defaultAnswers,
        age_range: "18-24",
      };
      const recommendations = generateRecommendations(answers);
      const visa417 = recommendations.find(r => r.visa_id === "417");
      expect(visa417).toBeDefined();
      expect(visa417?.eligibility_score).toBe(95);
    });

    test("should recommend 417 visa for age 25-32", () => {
      const answers: QuizAnswers = {
        ...defaultAnswers,
        age_range: "25-32",
      };
      const recommendations = generateRecommendations(answers);
      expect(recommendations.some(r => r.visa_id === "417")).toBe(true);
    });

    test("should NOT recommend 417 visa if purpose includes family", () => {
      const answers: QuizAnswers = {
        ...defaultAnswers,
        age_range: "18-24",
        visa_purpose: ["family"],
      };
      const recommendations = generateRecommendations(answers);
      expect(recommendations.some(r => r.visa_id === "417")).toBe(false);
    });
  });

  test("should sort recommendations by eligibility score descending", () => {
    const answers: QuizAnswers = {
      ...defaultAnswers,
      visa_purpose: ["work", "study"],
      work_experience_years: 3,
      english_level: "proficient",
    };
    // Expected: 500 (score 90), 189 (score 85)
    const recommendations = generateRecommendations(answers);
    expect(recommendations.length).toBeGreaterThan(1);
    for (let i = 0; i < recommendations.length - 1; i++) {
      expect(recommendations[i].eligibility_score).toBeGreaterThanOrEqual(recommendations[i+1].eligibility_score);
    }
  });
});
