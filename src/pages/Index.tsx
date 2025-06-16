import { ArrowRight } from "lucide-react";
import { PlanProvider } from "@/context/PlanContext";
import NextBigGoalCard from "@/components/NextBigGoalCard";
const Index = () => {
  return <PlanProvider>
      <div className="min-h-screen bg-background flex flex-col justify-center items-center font-sfpro">
        {/* Brand Hero */}
        <div className="w-full max-w-3xl px-2 sm:px-4 py-10 sm:py-16 flex flex-col items-center gap-6 sm:gap-8">
          <NextBigGoalCard />

          <header className="flex flex-col items-center gap-2 sm:gap-3 w-full">
            <span className="inline-block rounded-full bg-accent/10 px-4 py-2 font-semibold text-xs sm:text-sm tracking-widest mb-2 shadow-card text-slate-950">GENERATE DAILY PLANS</span>
            <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-extrabold mb-3 text-center leading-tight">
              <span className="heading-gradient">
                Transform your goals into <span className="text-accent">action</span>
              </span>
            </h1>
            <p className="mt-2 text-base xs:text-lg sm:text-xl text-primary/70 font-medium max-w-2xl text-center">
              Stridely helps you break down your biggest aspirations into a step-by-step weekly plan —
              driven by habits, milestones, skill-building, and motivating progress tracking.
            </p>
          </header>

          {/* Example Roadmap Card */}
          <section className="w-full py-6 sm:py-8 flex flex-col items-center">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-card w-full max-w-xl mx-auto p-4 sm:p-8 flex flex-col gap-3 sm:gap-5 transition hover:shadow-modal hover:scale-[1.020] duration-150">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-accent rounded-full inline-block"></span>
                <span className="uppercase text-[10px] sm:text-xs font-semibold tracking-widest text-accent">WEEKLY ROADMAP</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-primary mb-1">Run a Half Marathon</h2>
              <ul className="flex flex-col gap-1.5 sm:gap-2 text-primary/80 pl-3 sm:pl-4 text-base sm:text-lg">
                <li>🏃‍♀️ Train 4x per week</li>
                <li>🥗 Prep healthy meals every Sunday</li>
                <li>🧘‍♂️ Stretch before bed nightly</li>
              </ul>
              <div className="flex flex-row flex-wrap gap-1 sm:gap-2 mt-3 sm:mt-4">
                <span className="bg-accent/10 text-accent px-2 sm:px-3 py-0.5 rounded-full text-xs font-medium">Habit Tracker</span>
                <span className="bg-accent/10 text-accent px-2 sm:px-3 py-0.5 rounded-full text-xs font-medium">Skill Sprint</span>
                <span className="bg-accent/10 text-accent px-2 sm:px-3 py-0.5 rounded-full text-xs font-medium">Milestone</span>
                <span className="bg-accent/10 text-accent px-2 sm:px-3 py-0.5 rounded-full text-xs font-medium">+ Progress</span>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <div className="flex flex-col items-center gap-2 sm:gap-4 mt-6 sm:mt-10 w-full">
            <button className="button-ios flex items-center gap-2 text-base sm:text-lg group font-sfpro shadow-modal bg-accent hover:bg-primary/90 rounded-full min-h-[44px] px-6 sm:px-8 transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">
              Start Your Journey
              <ArrowRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <p className="text-primary/60 text-xs sm:text-sm max-w-md text-center">
              Join Stridely — your digital mentor for clarity, structure, and momentum.
            </p>
          </div>
        </div>
      </div>
    </PlanProvider>;
};
export default Index;