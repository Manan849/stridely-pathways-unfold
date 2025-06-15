
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center font-inter">
      {/* Brand Hero */}
      <div className="w-full max-w-3xl px-4 py-16 flex flex-col items-center gap-8">
        <header className="flex flex-col items-center gap-3">
          <span className="inline-block rounded-full bg-accent/10 px-4 py-2 text-accent font-semibold text-sm tracking-widest mb-2">
            STRIDELY
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-3 text-center leading-tight">
            <span className="heading-gradient">
              Transform your goals into <span className="text-accent">action</span>
            </span>
          </h1>
          <p className="mt-2 text-lg sm:text-xl text-primary/70 font-medium max-w-2xl text-center">
            Stridely helps you break down your biggest aspirations into a step-by-step weekly plan —
            driven by habits, milestones, skill-building, and motivating progress tracking.
          </p>
        </header>

        {/* Example Roadmap Card */}
        <section className="w-full py-8 flex flex-col items-center">
          <div className="bg-section rounded-section card-shadow w-full max-w-xl mx-auto p-8 flex flex-col gap-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2.5 h-2.5 bg-accent rounded-full inline-block"></span>
              <span className="uppercase text-xs font-semibold tracking-widest text-accent">WEEKLY ROADMAP</span>
            </div>
            <h2 className="text-2xl font-bold text-primary mb-1">Run a Half Marathon</h2>
            <ul className="flex flex-col gap-2 text-primary/80 pl-4">
              <li>🏃‍♀️ Train 4x per week</li>
              <li>🥗 Prep healthy meals every Sunday</li>
              <li>🧘‍♂️ Stretch before bed nightly</li>
            </ul>
            <div className="flex flex-row flex-wrap gap-2 mt-4">
              <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-medium">Habit Tracker</span>
              <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-medium">Skill Sprint</span>
              <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-medium">Milestone</span>
              <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-medium">+ Progress</span>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <div className="flex flex-col items-center gap-4 mt-10">
          <button className="button-ios flex items-center gap-2 text-lg group">
            Start Your Journey
            <ArrowRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
          <p className="text-primary/60 text-sm max-w-md text-center">Join Stridely — your digital mentor for clarity, structure, and momentum.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
