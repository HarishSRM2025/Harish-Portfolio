import { connectDB } from "@/lib/mongodb";
import Hero from "@/models/Hero";
import About from "@/models/About";
import Experience from "@/models/Experience";
import Skill from "@/models/Skill";
import Education from "@/models/Education";
import Project from "@/models/Project";
import ContactInfo from "@/models/ContactInfo";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import SkillsSection from "@/components/sections/SkillsSection";
import EducationSection from "@/components/sections/EducationSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ContactSection from "@/components/sections/ContactSection";
import PortfolioWrapper from "@/components/PortfolioWrapper";

export const dynamic = "force-dynamic"; // always read fresh data from MongoDB

async function getData() {
  await connectDB();

  const [hero, about, experience, skills, education, projects, contactInfo] = await Promise.all([
    Hero.findOne().lean(),
    About.findOne().lean(),
    Experience.find().sort({ order: 1, startDate: -1 }).lean(),
    Skill.find().sort({ categoryOrder: 1, category: 1, order: 1 }).lean(),
    Education.find().sort({ order: 1, startDate: -1 }).lean(),
    Project.find().sort({ order: 1, createdAt: -1 }).lean(),
    ContactInfo.findOne().lean()
  ]);

  // JSON-serialize to strip Mongo ObjectId/Date instances before passing to client components.
  return JSON.parse(
    JSON.stringify({ hero, about, experience, skills, education, projects, contactInfo })
  );
}

export default async function HomePage() {
  const { hero, about, experience, skills, education, projects, contactInfo } = await getData();

  return (
    <PortfolioWrapper name={hero?.name}>
      <Navbar name={hero?.name} hero={hero} />
      <main>
        <HeroSection hero={hero} />
        <AboutSection about={about} />
        <ExperienceSection experience={experience} />
        <SkillsSection skills={skills} />
        <EducationSection education={education} />
        <ProjectsSection projects={projects} />
        <ContactSection info={contactInfo} />
      </main>
      <Footer name={hero?.name} />
    </PortfolioWrapper>
  );
}

