
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050A08] text-[#DCFCE7]">
      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 py-12 md:grid-cols-2 md:px-10 lg:px-16">
        <div className="flex flex-col justify-center">
          <span className="mb-6 w-fit rounded-full border border-[#22C55E]/30 bg-[#166534] px-4 py-1 text-xs uppercase tracking-wider text-[#22C55E]">
            Built for the field
          </span>

          <h1 className="font-serif text-5xl tracking-tight text-[#DCFCE7] md:text-6xl lg:text-7xl">
            Better decisions for every growing season.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-[#86EFAC]">
            Practical crop intelligence, weather context, and trusted agricultural guidance in one calm workspace.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/register"
              className="rounded-full border border-[#22C55E] bg-[#166534] px-6 py-3 font-semibold text-[#DCFCE7] shadow-[0_0_20px_rgba(34,197,94,0.3)] transition hover:bg-[#15803D]"
            >
              Create a farmer account
            </Link>

            <Link
              to="/login"
              className="rounded-full border border-[#22C55E]/40 bg-transparent px-6 py-3 font-semibold text-[#DCFCE7] transition hover:bg-[#22C55E]/10"
            >
              Sign in
            </Link>
          </div>

          <div className="mt-10 flex gap-4 border-t border-[rgba(34,197,94,0.2)] pt-6">
            <span className="text-sm font-semibold text-[#22C55E]">01</span>
            <p className="text-sm leading-7 text-[#86EFAC]">
              Track crops
              <br />
              Understand risk
              <br />
              Act with confidence
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-[#22C55E]/20 bg-[#0F1A14] shadow-[0_0_60px_rgba(34,197,94,0.15)]">
          <div className="absolute inset-0 opacity-20">
            <div className="h-full w-full bg-[linear-gradient(rgba(34,197,94,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.2)_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>

          <div className="relative flex min-h-[420px] items-end p-8 md:min-h-[520px] md:p-10">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#22C55E]">
                Today on your farm
              </span>

              <strong className="mt-3 block font-serif text-4xl tracking-tight text-[#DCFCE7] md:text-5xl">
                Observe. Ask. Grow.
              </strong>

              <p className="mt-5 max-w-md text-base leading-7 text-[#86EFAC]">
                Keep your crop history close and get clear next steps when conditions change.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

