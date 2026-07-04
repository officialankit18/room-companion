import { ArrowRight, Bell, Brain, CheckCircle2, Home, MessageCircle, Search, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const steps = [
  {
    icon: Search,
    title: "Set your preference",
    text: "Tenants choose city, budget, move-in date and room expectations.",
  },
  {
    icon: Brain,
    title: "Get AI ranked matches",
    text: "RoomCompanion scores every suitable room and explains why it fits.",
  },
  {
    icon: MessageCircle,
    title: "Request and chat",
    text: "Owners approve interested tenants, then both sides can chat in real time.",
  },
];

const services = [
  {
    icon: Home,
    title: "Verified room listings",
    text: "Owners can list rooms with rent, availability, furnishing and exact location.",
  },
  {
    icon: ShieldCheck,
    title: "Compatibility-first discovery",
    text: "Every tenant sees high-score places first instead of endless random listings.",
  },
  {
    icon: Bell,
    title: "Smart alerts",
    text: "Email notifications keep tenants and owners updated on requests and replies.",
  },
];

export function LandingPage() {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowLoader(false), 2800);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      {showLoader ? (
        <div className="fixed inset-0 z-[1000] grid place-items-center bg-white">
          <div className="w-full max-w-md px-6 text-center">
            <video
              autoPlay
              muted
              playsInline
              className="mx-auto aspect-video w-full rounded-2xl object-cover shadow-2xl"
              src="/media/landing-loader.mp4"
            />
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
              RoomCompanion
            </p>
          </div>
        </div>
      ) : null}

      <section className="relative overflow-hidden bg-white">
        <div className="page-container grid min-h-[calc(100vh-82px)] items-center gap-10 py-14 lg:grid-cols-[1fr_0.92fr] lg:py-20">
          <div className="mx-auto max-w-4xl text-center lg:mx-0 lg:text-left">
            <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full bg-[#ffe8f3] px-5 py-3 text-sm font-bold text-[var(--color-primary)] lg:mx-0">
              <Sparkles size={18} className="text-[var(--color-accent)]" />
              AI powered room and flatmate matching
            </div>

            <h1 className="text-5xl font-black leading-[1.08] text-[var(--color-heading)] sm:text-6xl lg:text-7xl">
              Better flatmates,
              <span className="block text-transparent bg-[linear-gradient(90deg,#11157a,#0ea5e9,#f01378)] bg-clip-text">
                better places,
              </span>
              better living.
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-[var(--color-body)] lg:mx-0">
              Find compatible flatmates and verified rooms near you, ranked by a smart
              compatibility score so the best match appears first.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <Link
                className="focus-ring inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-7 text-base font-bold text-white shadow-[0_20px_45px_rgba(17,21,122,0.22)] transition hover:bg-[#080b55] sm:w-auto"
                to="/login?role=TENANT"
              >
                Find Room & Flatmate
                <ArrowRight size={19} />
              </Link>
              <Link
                className="focus-ring inline-flex h-14 w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 text-base font-bold text-[var(--color-heading)] shadow-sm transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] sm:w-auto"
                to="/login?role=OWNER"
              >
                Become a host
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-semibold text-[var(--color-body)] lg:justify-start">
              {["Delhi", "Noida", "Gurugram", "Hyderabad", "Bangalore"].map((city) => (
                <span key={city} className="rounded-full border border-slate-200 bg-white px-4 py-2">
                  {city}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <img
              alt="RoomCompanion flatmate search illustration"
              className="w-full rounded-[2rem] object-cover shadow-[0_30px_80px_rgba(14,165,233,0.18)]"
              loading="lazy"
              src="/media/flatmate-hero.png"
            />
            <div className="absolute -bottom-6 left-6 right-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-green-500" size={24} />
                <div>
                  <p className="font-bold text-[var(--color-heading)]">94% compatibility match</p>
                  <p className="text-sm text-[var(--color-body)]">Budget, location and move-in date align.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white py-20">
        <div className="page-container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">How it works</p>
            <h2 className="mt-3 text-4xl font-black text-[var(--color-heading)]">From search to conversation in minutes</h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="rounded-3xl border border-slate-100 bg-white p-7 shadow-[0_18px_50px_rgba(17,21,122,0.07)]">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[#eef7ff] text-[var(--color-secondary)]">
                    <Icon size={24} />
                  </div>
                  <p className="mt-6 text-sm font-black text-[var(--color-accent)]">Step {index + 1}</p>
                  <h3 className="mt-2 text-xl font-black text-[var(--color-heading)]">{step.title}</h3>
                  <p className="mt-3 leading-7 text-[var(--color-body)]">{step.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="our-services" className="bg-white py-20">
        <div className="page-container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">Our services</p>
            <h2 className="mt-3 text-4xl font-black text-[var(--color-heading)]">Everything needed to match rooms and people</h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article key={service.title} className="rounded-3xl border border-slate-100 bg-white p-7 shadow-[0_18px_50px_rgba(17,21,122,0.07)]">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[#fff0f6] text-[var(--color-accent)]">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-6 text-xl font-black text-[var(--color-heading)]">{service.title}</h3>
                  <p className="mt-3 leading-7 text-[var(--color-body)]">{service.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 bg-white py-8">
        <div className="page-container flex flex-col items-center justify-between gap-4 text-sm font-semibold text-[var(--color-body)] sm:flex-row">
          <p>@2026 RoomCompanion. All rights reserved.</p>
          <a className="text-[var(--color-primary)] hover:text-[var(--color-accent)]" href="https://www.linkedin.com/" rel="noreferrer" target="_blank">
            LinkedIn
          </a>
        </div>
      </footer>
    </>
  );
}
