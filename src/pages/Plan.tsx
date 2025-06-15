
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TimeDropdown from "@/components/TimeDropdown";

const FAKE_AI_RESPONSE = {
  weeks: [
    {
      week: 1,
      skills: ["Skill A", "Skill B"],
      habits: ["Daily journaling", "30 min reading"],
      milestone: "Complete Intro to Product Design course",
      resources: ["DesignCourse.com - Beginner Guide"],
    },
    // ... additional weeks can be filled in or generated
  ],
};

const Plan = () => {
  const [goal, setGoal] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRoadmap(null);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setRoadmap(FAKE_AI_RESPONSE);
    }, 1200);
  };

  return (
    <div className="pt-28 max-w-2xl mx-auto px-4">
      <div className="mb-12">
        <div className="rounded-2xl bg-white shadow-card border border-gray-100 p-8 flex flex-col gap-8">
          {/* Section Title */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2 flex items-center gap-2">
              <span role="img" aria-label="target">🎯</span>
              What’s your next big goal?
            </h2>
            <p className="text-primary/65 text-base">
              Let’s plan your next 3–6 months. Dream big!
            </p>
          </div>
          {/* Inputs */}
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {/* Goal field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="goal" className="font-medium text-primary mb-1">Describe what you want to achieve in the next 3–6 months</label>
              <Input
                id="goal"
                value={goal}
                onChange={e => setGoal(e.target.value)}
                placeholder="e.g. Launch a startup, become a product designer, learn to code"
                required
                className="text-base"
                autoComplete="off"
                maxLength={160}
              />
            </div>
            {/* Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-primary mb-1">How many hours per week can you commit?</label>
              <TimeDropdown value={time} onChange={setTime} />
            </div>
            {/* CTA Button */}
            <Button
              type="submit"
              className="w-full mt-2 bg-[#007AFF] hover:bg-[#005bb5] text-white text-lg font-bold py-3 rounded-xl shadow-card transition-button"
              disabled={loading || !goal || !time}
              size="lg"
            >
              {loading ? "Generating..." : "Generate My Transformation Plan"}
            </Button>
          </form>
        </div>
      </div>

      {/* Roadmap Result */}
      {roadmap && (
        <div className="mt-10 rounded-xl bg-section shadow-card p-8">
          <h3 className="text-lg font-semibold mb-4">Your 12-Week Roadmap</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2 text-left">
              <thead>
                <tr className="text-primary/70 text-sm">
                  <th className="py-2 pr-4 font-semibold">Week</th>
                  <th className="py-2 pr-4 font-semibold">Skills</th>
                  <th className="py-2 pr-4 font-semibold">Habits</th>
                  <th className="py-2 pr-4 font-semibold">Milestone</th>
                  <th className="py-2 pr-4 font-semibold">Resources</th>
                </tr>
              </thead>
              <tbody>
                {roadmap.weeks.map((w: any, i: number) => (
                  <tr key={i} className="bg-white rounded-lg shadow border">
                    <td className="py-3 pr-4 font-bold text-primary">{w.week}</td>
                    <td className="py-3 pr-4">
                      <ul className="list-disc ml-4">{w.skills.map((s: string, idx: number) => <li key={idx}>{s}</li>)}</ul>
                    </td>
                    <td className="py-3 pr-4">
                      <ul className="list-disc ml-4">{w.habits.map((h: string, idx: number) => <li key={idx}>{h}</li>)}</ul>
                    </td>
                    <td className="py-3 pr-4">{w.milestone}</td>
                    <td className="py-3 pr-4">
                      <ul className="list-disc ml-4">{w.resources.map((r: string, idx: number) => <li key={idx}>{r}</li>)}</ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Plan;
