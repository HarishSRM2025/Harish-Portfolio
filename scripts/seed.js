/**
 * Seeds the database with starter content so the portfolio isn't empty
 * on first run, and ensures the default admin account exists.
 *
 * Usage: npm run seed
 * Requires MONGODB_URI (and optionally ADMIN_EMAIL / ADMIN_PASSWORD) in .env.local
 */
require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set. Add it to .env.local first.");
  process.exit(1);
}

const HeroSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const AboutSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const ExperienceSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const SkillSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const EducationSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const ProjectSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const ContactInfoSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const SettingsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const AdminSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

const Hero = mongoose.model("Hero", HeroSchema);
const About = mongoose.model("About", AboutSchema);
const Experience = mongoose.model("Experience", ExperienceSchema);
const Skill = mongoose.model("Skill", SkillSchema);
const Education = mongoose.model("Education", EducationSchema);
const Project = mongoose.model("Project", ProjectSchema);
const ContactInfo = mongoose.model("ContactInfo", ContactInfoSchema);
const Settings = mongoose.model("Settings", SettingsSchema);
const Admin = mongoose.model("Admin", AdminSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  // Hero
  if ((await Hero.countDocuments()) === 0) {
    await Hero.create({
      name: "Alex Morgan",
      role: "Full Stack Developer",
      tagline:
        "I design and build reliable web applications end to end — from database schema to pixel-perfect UI.",
      imageUrl: "/hero-image.svg",
      resumeUrl: "/resume.pdf",
      linkedinUrl: "https://linkedin.com",
      githubUrl: "https://github.com",
      email: "hello@example.com",
      location: "Remote"
    });
    console.log("Seeded Hero");
  }

  // About
  if ((await About.countDocuments()) === 0) {
    await About.create({
      heading: "About Me",
      description:
        "I'm a full stack developer who enjoys turning complex problems into simple, well-tested software. Comfortable across the stack, from MongoDB schemas to React interfaces.",
      yearsOfExperience: 4,
      highlights: [
        "Shipped production apps used by 10k+ users",
        "Comfortable with Next.js, Node.js, and MongoDB",
        "Strong focus on performance and accessibility",
        "Enjoy mentoring and code reviews"
      ]
    });
    console.log("Seeded About");
  }

  // Experience
  if ((await Experience.countDocuments()) === 0) {
    await Experience.insertMany([
      {
        company: "Acme Corp",
        role: "Senior Full Stack Developer",
        location: "Remote",
        startDate: "Jan 2023",
        endDate: "Present",
        description: "Leading development of the customer portal using Next.js and MongoDB.",
        technologies: ["Next.js", "MongoDB", "TypeScript", "AWS"],
        order: 0
      },
      {
        company: "Bright Labs",
        role: "Full Stack Developer",
        location: "Bengaluru, India",
        startDate: "Jun 2020",
        endDate: "Dec 2022",
        description: "Built and maintained internal tools and customer-facing dashboards.",
        technologies: ["React", "Node.js", "Express", "PostgreSQL"],
        order: 1
      }
    ]);
    console.log("Seeded Experience");
  }

  // Skills
  if ((await Skill.countDocuments()) === 0) {
    await Skill.insertMany([
      { name: "React", category: "Frontend", proficiency: 92, icon: "Component", order: 0 },
      { name: "Next.js", category: "Frontend", proficiency: 90, icon: "Layout", order: 1 },
      { name: "Node.js", category: "Backend", proficiency: 88, icon: "Server", order: 0 },
      { name: "MongoDB", category: "Database", proficiency: 85, icon: "Database", order: 0 },
      { name: "Docker", category: "DevOps", proficiency: 75, icon: "Container", order: 0 },
      { name: "Git", category: "Tools", proficiency: 90, icon: "GitBranch", order: 0 }
    ]);
    console.log("Seeded Skills");
  }

  // Education
  if ((await Education.countDocuments()) === 0) {
    await Education.insertMany([
      {
        institution: "University of Example",
        degree: "Bachelor of Technology",
        fieldOfStudy: "Computer Science",
        location: "Chennai, India",
        startDate: "2020",
        endDate: "2024",
        description: "Focused on software engineering, data structures, and full stack web development.",
        achievements: [
          "Graduated with distinction",
          "Built capstone projects in React and Node.js"
        ],
        order: 0
      }
    ]);
    console.log("Seeded Education");
  }

  // Projects
  if ((await Project.countDocuments()) === 0) {
    await Project.insertMany([
      {
        title: "Task Management App",
        description: "A collaborative task manager with real-time updates and role-based access.",
        imageUrl: "",
        liveUrl: "",
        githubUrl: "",
        techStack: ["Next.js", "MongoDB", "Tailwind CSS"],
        featured: true,
        order: 0
      },
      {
        title: "E-commerce Storefront",
        description: "A full-featured storefront with cart, checkout, and an admin dashboard.",
        imageUrl: "",
        liveUrl: "",
        githubUrl: "",
        techStack: ["React", "Node.js", "Stripe"],
        featured: false,
        order: 1
      }
    ]);
    console.log("Seeded Projects");
  }

  // Contact info
  if ((await ContactInfo.countDocuments()) === 0) {
    await ContactInfo.create({
      heading: "Let's Work Together",
      description: "Have a project in mind or just want to say hi? My inbox is always open.",
      email: "hello@example.com",
      phone: "",
      address: "",
      linkedinUrl: "https://linkedin.com",
      githubUrl: "https://github.com",
      twitterUrl: ""
    });
    console.log("Seeded ContactInfo");
  }

  // Settings
  if ((await Settings.countDocuments()) === 0) {
    await Settings.create({
      siteName: "My Portfolio",
      defaultTheme: "dark",
      primaryColor: "#6366f1"
    });
    console.log("Seeded Settings");
  }

  // Default admin
  if ((await Admin.countDocuments()) === 0) {
    const email = process.env.ADMIN_EMAIL || "admin@example.com";
    const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
    const hash = await bcrypt.hash(password, 10);
    await Admin.create({ email: email.toLowerCase(), password: hash, name: "Admin" });
    console.log(`Seeded Admin account: ${email}`);
  }

  console.log("Done seeding.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
