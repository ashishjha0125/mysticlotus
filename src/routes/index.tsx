import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  Calendar,
  Clock,
  Users,
  ChevronRight,
  Leaf,
  Heart,
  Sparkles,
  Menu,
  X,
  ArrowRight,
  Quote,
  CheckCircle2,
  Flame,
  Brain,
  Hand,
  Flower2,
  TreePine,
  Waves,
  Activity,
  Shield,
  Zap,
  Sun,
} from "lucide-react";

export const Route = createFileRoute("/")(
  {
    component: LandingPage,
  },
);

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const practitioners = [
  {
    name: "Dr. Elena Bratova",
    specialty: "Ayurveda & Reiki",
    photo: "/images/healer-1.png",
    rating: 4.9,
    reviews: 127,
    location: "Mumbai, IN",
    bio: "Specializes in mind-body alignment and stress-related conditions through holistic healing.",
  },
  {
    name: "Marcus Chen",
    specialty: "Reiki Master",
    photo: "/images/healer-2.png",
    rating: 4.8,
    reviews: 93,
    location: "Delhi, IN",
    bio: "Deep healing sessions focused on energy balance, chakra alignment, and emotional wellness.",
  },
  {
    name: "Sarah Jenkins",
    specialty: "Holistic Therapy",
    photo: "/images/healer-3.png",
    rating: 4.9,
    reviews: 156,
    location: "Bangalore, IN",
    bio: "Integrating conventional massage therapy with mindfulness practices for holistic well-being.",
  },
];

const events = [
  {
    title: "Mindful Breathwork Intensive",
    host: "with Elena Bratova",
    date: "Aug 12, 2026",
    time: "9 AM – 4 PM",
    type: "Workshop",
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Community Reiki Circle",
    host: "with Marcus Chen",
    date: "Aug 15, 2026",
    time: "7 PM – 9 PM",
    type: "Community",
    color: "bg-secondary/10 text-secondary",
  },
  {
    title: "Holistic Stress Management",
    host: "with Sarah Jenkins",
    date: "Aug 20, 2026",
    time: "10 AM – 1 PM",
    type: "Class",
    color: "bg-warning/10 text-warning-foreground",
  },
];

const modalities = [
  { name: "Yoga & Movement", icon: Activity },
  { name: "Therapy & Counseling", icon: Brain },
  { name: "Energy Healing", icon: Zap },
  { name: "Acupuncture", icon: Hand },
  { name: "Meditation", icon: Flower2 },
  { name: "Herbal Medicine", icon: TreePine },
];

const supportAreas = [
  "Anxiety & Stress",
  "Sleep Issues",
  "Chronic Pain",
  "Emotional Healing",
  "Spiritual Growth",
  "Relationship Support",
];

const testimonials = [
  {
    name: "Priya Sharma",
    text: "After years of chronic back pain, I finally found real relief through Pranic Healing. My healer on Mystic Lotus changed my life. The booking process was seamless and I felt cared for from the very first session.",
    rating: 5,
  },
  {
    name: "Rahul Verma",
    text: "This is the best therapy service I have ever tried. I had a wonderful, grounding Reiki session with a phenomenal healer. My stress has decreased significantly and the entire experience was beyond my expectations.",
    rating: 5,
  },
  {
    name: "Anita Desai",
    text: "I never knew what to expect from my first yoga therapy session. My teacher was patient, kind, and deeply intuitive. I left feeling like a completely different person with clarity and inner peace I haven't felt in years.",
    rating: 5,
  },
];

const navLinks = [
  { label: "Find a Healer", href: "#practitioners" },
  { label: "Stories", href: "#testimonials" },
  { label: "Events", href: "#events" },
  { label: "For Healers", href: "#for-healers" },
];

/* ─── Animation Variants ───────────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ─── Landing Page ─────────────────────────────────────────────────────────── */

function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* ─── Navbar ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
              <Leaf className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-semibold tracking-tight text-foreground">
              Mystic Lotus
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2.5 md:flex">
            <Link
              to="/seeker-login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Login
            </Link>
            <Link
              to="/seeker-login"
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:bg-primary/90 hover:shadow-elevated"
            >
              Join
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="grid h-10 w-10 place-items-center rounded-xl text-foreground transition-colors hover:bg-accent md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-border/50 bg-background md:hidden"
            >
              <div className="flex flex-col gap-1 px-4 py-4">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    {link.label}
                  </a>
                ))}
                <hr className="my-2 border-border/50" />
                <Link
                  to="/login"
                  search={{}}
                  className="rounded-full bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary transition-colors hover:bg-secondary/20"
                >
                  Login
                </Link>
                <Link
                  to="/seeker-login"
                  className="mt-1 rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground"
                >
                  Join Mystic Lotus
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="/images/hero-forest.png"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="mx-auto max-w-2xl text-center"
          >
            <motion.h1
              variants={fadeUp}
              custom={0}
              className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Find Your Path to{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Healing
              </span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mx-auto mt-5 max-w-lg text-base text-muted-foreground sm:text-lg"
            >
              Connect with verified practitioners for holistic wellness tailored to
              your mind, body, and spirit.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              variants={fadeUp}
              custom={2}
              className="mx-auto mt-8 max-w-xl"
            >
              <div className="glass shadow-elevated flex flex-col gap-2 rounded-2xl p-2 sm:flex-row sm:items-center sm:gap-0">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search modality, e.g. Reiki"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 w-full rounded-xl border-0 bg-transparent pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
                  />
                </div>
                <div className="hidden h-6 w-px bg-border/60 sm:block" />
                <div className="relative flex-1">
                  <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="City or online"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="h-11 w-full rounded-xl border-0 bg-transparent pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
                  />
                </div>
                <button className="h-11 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:bg-primary/90 hover:shadow-elevated">
                  Search
                </button>
              </div>
            </motion.div>

            {/* Quick Filters */}
            <motion.div
              variants={fadeUp}
              custom={3}
              className="mt-5 flex flex-wrap items-center justify-center gap-2"
            >
              {["Pranic Healing", "Acupuncture", "Sound Therapy", "Yoga", "Reiki"].map(
                (tag) => (
                  <button
                    key={tag}
                    className="rounded-full border border-border/70 bg-background/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
                  >
                    {tag}
                  </button>
                ),
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Featured Practitioners ──────────────────────────────────────── */}
      <section id="practitioners" className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} custom={0} className="mb-10">
              <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                Featured Practitioners
              </h2>
              <p className="mt-2 text-muted-foreground">
                Highly rated healers available for booking
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {practitioners.map((p, i) => (
                <motion.div
                  key={p.name}
                  variants={fadeUp}
                  custom={i + 1}
                  className="glass shadow-soft group cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-elevated hover:-translate-y-1"
                >
                  <div className="relative h-52 overflow-hidden sm:h-56">
                    <img
                      src={p.photo}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1 text-xs font-medium backdrop-blur-md">
                      <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                      {p.rating} ({p.reviews})
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-medium uppercase tracking-wider text-primary">
                      {p.specialty}
                    </p>
                    <h3 className="mt-1.5 text-lg font-semibold text-foreground">
                      {p.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                      {p.bio}
                    </p>
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {p.location}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Upcoming Events ─────────────────────────────────────────────── */}
      <section
        id="events"
        className="border-y border-border/50 bg-muted/30 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} custom={0} className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                  Upcoming Events
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Workshops, classes, and community healing circles
                </p>
              </div>
              <a
                href="#"
                className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                View All Events <ChevronRight className="h-4 w-4" />
              </a>
            </motion.div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((ev, i) => (
                <motion.div
                  key={ev.title}
                  variants={fadeUp}
                  custom={i + 1}
                  className="glass shadow-soft group cursor-pointer rounded-2xl p-5 transition-all duration-300 hover:shadow-elevated hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${ev.color}`}
                    >
                      {ev.type}
                    </span>
                    <span className="text-xs text-muted-foreground">{ev.date}</span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">
                    {ev.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{ev.host}</p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" /> {ev.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" /> {ev.time}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Modalities + Support ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16"
          >
            {/* Modalities */}
            <motion.div variants={fadeUp} custom={0}>
              <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                Explore by Modality
              </h2>
              <p className="mt-2 mb-8 text-muted-foreground">
                Find the healing practice that resonates with you
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {modalities.map((m) => (
                  <button
                    key={m.name}
                    className="glass shadow-soft group flex flex-col items-center gap-3 rounded-2xl p-5 transition-all duration-300 hover:shadow-elevated hover:-translate-y-1"
                  >
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <m.icon className="h-6 w-6" />
                    </div>
                    <span className="text-center text-xs font-semibold text-foreground">
                      {m.name}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Support Areas */}
            <motion.div variants={fadeUp} custom={1}>
              <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                Find Support For
              </h2>
              <p className="mt-2 mb-8 text-muted-foreground">
                Whatever you're going through, we can help
              </p>
              <div className="flex flex-col gap-3">
                {supportAreas.map((area) => (
                  <button
                    key={area}
                    className="group flex items-center gap-3 rounded-xl border border-border/60 bg-background px-5 py-4 text-left transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:shadow-soft"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary/50 transition-colors group-hover:text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {area}
                    </span>
                    <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Testimonials ────────────────────────────────────────────────── */}
      <section
        id="testimonials"
        className="relative overflow-hidden border-y border-border/50 bg-muted/20 py-16 sm:py-20 lg:py-24"
      >
        {/* Background decoration */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-secondary/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} custom={0} className="mb-10 text-center">
              <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                Journeys of Healing
              </h2>
              <p className="mt-2 text-muted-foreground">
                Hear from people who found their path
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.name}
                  variants={fadeUp}
                  custom={i + 1}
                  className="glass shadow-soft rounded-2xl p-6"
                >
                  <div className="mb-4 flex items-center gap-1">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star
                        key={j}
                        className="h-4 w-4 fill-yellow-500 text-yellow-500"
                      />
                    ))}
                  </div>
                  <Quote className="mb-2 h-5 w-5 text-primary/30" />
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t.text}
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {t.name.split(" ").map((p) => p[0]).join("")}
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {t.name}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Zen stones image */}
            <motion.div variants={fadeUp} custom={4} className="mt-12 flex justify-center">
              <img
                src="/images/zen-stones.png"
                alt="Zen stones"
                className="h-32 w-auto rounded-2xl object-cover opacity-60 sm:h-40"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Share Your Gift (CTA for Healers) ───────────────────────────── */}
      <section id="for-healers" className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-secondary p-8 sm:p-12 lg:p-16"
          >
            {/* Decorative circles */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

            <div className="relative mx-auto max-w-2xl text-center">
              <motion.div
                variants={fadeUp}
                custom={0}
                className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-white/15 backdrop-blur-md"
              >
                <Sparkles className="h-7 w-7 text-white" />
              </motion.div>
              <motion.h2
                variants={fadeUp}
                custom={1}
                className="font-display text-3xl font-bold text-white sm:text-4xl"
              >
                Share Your Gift
              </motion.h2>
              <motion.p
                variants={fadeUp}
                custom={2}
                className="mx-auto mt-4 max-w-lg text-base text-white/80"
              >
                Join our community of verified healers. Manage your bookings, grow your
                practice, and connect with seekers looking for holistic wellness solutions.
              </motion.p>
              <motion.div
                variants={fadeUp}
                custom={3}
                className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
              >
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-primary shadow-soft transition-all hover:bg-white/90 hover:shadow-elevated"
                >
                  Apply as Practitioner
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
                >
                  Learn More
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Stats Bar ───────────────────────────────────────────────────── */}
      <section className="border-y border-border/50 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 gap-8 sm:grid-cols-4"
          >
            {[
              { value: "500+", label: "Verified Healers", icon: Shield },
              { value: "10K+", label: "Happy Seekers", icon: Heart },
              { value: "25+", label: "Healing Modalities", icon: Flame },
              { value: "50+", label: "Cities Covered", icon: Sun },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                custom={i}
                className="flex flex-col items-center text-center"
              >
                <stat.icon className="mb-2 h-6 w-6 text-primary" />
                <span className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                  {stat.value}
                </span>
                <span className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────────────── */}
      <footer className="bg-card py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                  <Leaf className="h-5 w-5" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-display text-base font-semibold">
                    Mystic Lotus
                  </span>
                  <span className="text-[0.7rem] text-muted-foreground">
                    & Dragonflies
                  </span>
                </div>
              </div>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                Bringing together verified holistic healers and those seeking a deeper
                path to wellness and inner peace.
              </p>
            </div>

            {/* Platform */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-foreground">Platform</h4>
              <ul className="flex flex-col gap-2.5">
                {["Find a Healer", "Browse Modalities", "Upcoming Events", "Community"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {item}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-foreground">Company</h4>
              <ul className="flex flex-col gap-2.5">
                {["About", "Blog", "Careers", "Contact"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-foreground">Legal</h4>
              <ul className="flex flex-col gap-2.5">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {item}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>

          <hr className="my-8 border-border/50" />

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-xs text-muted-foreground">
              © 2026 Mystic Lotus & Dragonflies. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
