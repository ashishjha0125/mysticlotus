/**
 * Supabase seed script — run AFTER you have executed supabase-schema.sql
 * in the Supabase SQL Editor.
 *
 * Usage (from the project root):
 *   node seed-supabase.mjs
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://dszdtodlsydoftywevhx.supabase.co";
const SUPABASE_KEY = "sb_publishable__p2g-iUaDJBwOng8CpKmvQ_AEOVbvFP";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── 1. Seed users ─────────────────────────────────────────────────────────────
const users = [
  { name: "Jane Lotus", email: "admin@mysticlotus.com", role: "admin", status: "active" },
  { name: "Aria Thorne", email: "aria.thorne@healing.com", role: "healer", status: "active", phone: "+1 555 019 2834" },
  { name: "Luna Seraphina", email: "luna@cosmicbreath.com", role: "healer", status: "active", phone: "+1 555 012 3456" },
  { name: "Elena Rostova", email: "elena.rostova@crystal.org", role: "healer", status: "pending", phone: "+1 555 098 7654" },
  { name: "Sarah Jenkins", email: "sarah.j@reikienergy.net", role: "healer", status: "suspended", phone: "+1 555 034 5678" },
  { name: "Sophia Martinez", email: "sophia.tarot@mystic.com", role: "healer", status: "active", phone: "+1 555 045 6789" },
  { name: "Cassandra Vance", email: "cassandra@vibration.com", role: "healer", status: "active", phone: "+1 555 056 7890" },
  { name: "Amara Cole", email: "amara@shamanicpath.com", role: "healer", status: "pending", phone: "+1 555 067 8901" },
  { name: "John Doe", email: "john.doe@gmail.com", role: "seeker", status: "active" },
  { name: "Michael Vance", email: "mvance@domain.com", role: "seeker", status: "active" },
  { name: "David Kim", email: "david.kim@outlook.com", role: "seeker", status: "blocked" },
  { name: "Oliver Brooks", email: "obrooks@gmail.com", role: "seeker", status: "active" },
  { name: "Emily Watson", email: "emily.watson@gmail.com", role: "seeker", status: "active" },
  { name: "Daniel Craig", email: "dcraig@gmail.com", role: "seeker", status: "pending" },
  { name: "James Miller", email: "jmiller@gmail.com", role: "seeker", status: "active" },
];

console.log("🌱 Seeding users...");
const { data: insertedUsers, error: usersError } = await supabase
  .from("users")
  .upsert(users, { onConflict: "email" })
  .select();

if (usersError) {
  console.error("❌ Users error:", usersError.message);
  process.exit(1);
}
console.log(`✅ ${insertedUsers.length} users seeded`);

// Map email → id
const userMap = Object.fromEntries(insertedUsers.map((u) => [u.email, u.id]));

// ── 2. Seed healers ───────────────────────────────────────────────────────────
const healersData = [
  {
    id: userMap["aria.thorne@healing.com"],
    status: "approved",
    modalities: ["Reiki", "Sound Therapy", "Chakra Balancing"],
    documents_verified: true,
    rating: 4.9,
    total_bookings: 84,
    total_earnings: 6720,
    bio: "Certified Usui Reiki Master and Sound Therapist with over 8 years of experience.",
  },
  {
    id: userMap["luna@cosmicbreath.com"],
    status: "approved",
    modalities: ["Breathwork", "Meditation", "Yin Yoga"],
    documents_verified: true,
    rating: 4.8,
    total_bookings: 112,
    total_earnings: 8960,
    bio: "Breathwork facilitator and meditation guide.",
  },
  {
    id: userMap["elena.rostova@crystal.org"],
    status: "pending",
    modalities: ["Crystal Healing", "Aura Cleansing"],
    documents_verified: false,
    rating: 4.0,
    total_bookings: 0,
    total_earnings: 0,
    bio: "Crystal practitioner specialized in layout therapy.",
  },
  {
    id: userMap["sarah.j@reikienergy.net"],
    status: "suspended",
    modalities: ["Reiki", "Distance Healing"],
    documents_verified: true,
    rating: 4.6,
    total_bookings: 32,
    total_earnings: 2240,
    bio: "Energy healer specialized in remote sessions.",
  },
  {
    id: userMap["sophia.tarot@mystic.com"],
    status: "approved",
    modalities: ["Tarot Reading", "Spiritual Counseling"],
    documents_verified: true,
    rating: 4.95,
    total_bookings: 98,
    total_earnings: 7840,
    bio: "Intuitive tarot reader and spiritual advisor.",
  },
  {
    id: userMap["cassandra@vibration.com"],
    status: "approved",
    modalities: ["Biofield Tuning", "Sound Healing"],
    documents_verified: false,
    rating: 4.7,
    total_bookings: 24,
    total_earnings: 1920,
    bio: "Sound practitioner utilizing tuning forks.",
  },
  {
    id: userMap["amara@shamanicpath.com"],
    status: "pending",
    modalities: ["Shamanic Healing", "Soul Retrieval"],
    documents_verified: false,
    rating: 4.0,
    total_bookings: 0,
    total_earnings: 0,
    bio: "Shamanic practitioner trained in traditional Amazonian lineage.",
  },
];

console.log("🌱 Seeding healers...");
const { data: insertedHealers, error: healersError } = await supabase
  .from("healers")
  .upsert(healersData, { onConflict: "id" })
  .select();

if (healersError) {
  console.error("❌ Healers error:", healersError.message);
  process.exit(1);
}
console.log(`✅ ${insertedHealers.length} healers seeded`);

// ── 3. Seed bookings ─────────────────────────────────────────────────────────
const bookings = [
  {
    reference: "MLD-2026-0001",
    seeker_id: userMap["john.doe@gmail.com"],
    healer_id: userMap["aria.thorne@healing.com"],
    modality: "Reiki Master Session",
    scheduled_at: "2026-07-15T10:00:00Z",
    duration_minutes: 60,
    amount: 80,
    currency: "USD",
    status: "confirmed",
    payment_status: "paid",
    notes: "Focus on throat chakra and stress relief.",
  },
  {
    reference: "MLD-2026-0002",
    seeker_id: userMap["mvance@domain.com"],
    healer_id: userMap["luna@cosmicbreath.com"],
    modality: "1-on-1 Somatic Breathwork",
    scheduled_at: "2026-07-14T14:00:00Z",
    duration_minutes: 90,
    amount: 120,
    currency: "USD",
    status: "confirmed",
    payment_status: "paid",
  },
  {
    reference: "MLD-2026-0003",
    seeker_id: userMap["obrooks@gmail.com"],
    healer_id: userMap["sophia.tarot@mystic.com"],
    modality: "Intuitive Tarot Reading",
    scheduled_at: "2026-07-13T16:00:00Z",
    duration_minutes: 45,
    amount: 60,
    currency: "USD",
    status: "completed",
    payment_status: "paid",
    notes: "Career change guidance.",
  },
  {
    reference: "MLD-2026-0004",
    seeker_id: userMap["emily.watson@gmail.com"],
    healer_id: userMap["aria.thorne@healing.com"],
    modality: "Sound Bath Therapy",
    scheduled_at: "2026-07-16T18:00:00Z",
    duration_minutes: 60,
    amount: 90,
    currency: "USD",
    status: "pending",
    payment_status: "unpaid",
  },
  {
    reference: "MLD-2026-0005",
    seeker_id: userMap["john.doe@gmail.com"],
    healer_id: userMap["sarah.j@reikienergy.net"],
    modality: "Distance Reiki Session",
    scheduled_at: "2026-07-01T11:00:00Z",
    duration_minutes: 60,
    amount: 70,
    currency: "USD",
    status: "cancelled",
    payment_status: "refunded",
    notes: "Cancelled due to emergency travel.",
  },
  {
    reference: "MLD-2026-0006",
    seeker_id: userMap["jmiller@gmail.com"],
    healer_id: userMap["cassandra@vibration.com"],
    modality: "Biofield Tuning Mastery",
    scheduled_at: "2026-07-12T09:00:00Z",
    duration_minutes: 75,
    amount: 100,
    currency: "USD",
    status: "completed",
    payment_status: "paid",
  },
];

console.log("🌱 Seeding bookings...");
const { data: insertedBookings, error: bookingsError } = await supabase
  .from("bookings")
  .upsert(bookings, { onConflict: "reference" })
  .select();

if (bookingsError) {
  console.error("❌ Bookings error:", bookingsError.message);
  process.exit(1);
}
console.log(`✅ ${insertedBookings.length} bookings seeded`);

// ── 4. Seed activities ────────────────────────────────────────────────────────
const activities = [
  { type: "healer_signup", message: "New healer signup: Amara Cole (Shamanic Healing)" },
  { type: "booking_created", message: "Booking MLD-2026-0004 created by Emily Watson with Aria Thorne" },
  { type: "healer_signup", message: "New healer signup: Elena Rostova (Crystal Healing)" },
  { type: "booking_completed", message: "Booking MLD-2026-0006 completed by James Miller with Cassandra Vance" },
  { type: "payout_processed", message: "Monthly payouts processed for approved healers" },
  { type: "user_blocked", message: "Seeker David Kim blocked due to spam reviews" },
];

console.log("🌱 Seeding activities...");
const { data: insertedActivities, error: activitiesError } = await supabase
  .from("activities")
  .insert(activities)
  .select();

if (activitiesError) {
  console.error("❌ Activities error:", activitiesError.message);
} else {
  console.log(`✅ ${insertedActivities.length} activities seeded`);
}

console.log("\n🎉 Database seeded successfully! Your Supabase project is ready.");
