// seedDatabase.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Import your models
const User = require("./models/User");
const StorageLocation = require("./models/storageLocation");
const StorageCondition = require("./models/storageCondition");
const Project = require("./models/Project");
const Sample = require("./models/Sample");
const Notification = require("./models/Notification");
require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Clear existing data
const clearCollections = async () => {
  await User.deleteMany({});
  await StorageLocation.deleteMany({});
  await StorageCondition.deleteMany({});
  await Project.deleteMany({});
  await Sample.deleteMany({});
  await Notification.deleteMany({});
  console.log("All collections cleared");
};

// Seed function
const seedDatabase = async () => {
  try {
    await clearCollections();

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword1 = await bcrypt.hash("password123", salt);
    const hashedPassword2 = await bcrypt.hash("securepass456", salt);
    const hashedPassword3 = await bcrypt.hash("technician789", salt);

    // Create Users
    const user1 = await User.create({
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@research.org",
      password: hashedPassword1,
      phoneNumber: "+33612345678",
      role: "admin",
      institution: "Institut de Recherche Biomédicale",
      specialty: "Molecular Biology",
      initials: "SJ",
      profileImage: "/uploads/profile/sarah-johnson.jpg",
      isVerified: true,
    });

    const user2 = await User.create({
      name: "Dr. Marc Dupont",
      email: "marc.dupont@research.org",
      password: hashedPassword2,
      phoneNumber: "+33623456789",
      role: "chercheur",
      institution: "Université de Paris",
      specialty: "Genetics",
      initials: "MD",
      profileImage: "/uploads/profile/marc-dupont.jpg",
      isVerified: true,
    });

    const user3 = await User.create({
      name: "Sophie Laurent",
      email: "sophie.laurent@research.org",
      password: hashedPassword3,
      phoneNumber: "+33634567890",
      role: "technicien",
      institution: "Institut de Recherche Biomédicale",
      specialty: "Lab Procedures",
      initials: "SL",
      profileImage: "/uploads/profile/sophie-laurent.jpg",
      isVerified: true,
    });

    console.log("Users created");

    // Create Storage Locations
    const location1 = await StorageLocation.create({
      name: "Freezer A-1",
      description: "Ultra-low temperature freezer for biological samples",
      type: "Freezer",
      building: "Main Research Building",
      room: "Lab 101",
    });

    const location2 = await StorageLocation.create({
      name: "Refrigerator B-3",
      description: "Standard refrigerator for reagents",
      type: "Refrigerator",
      building: "Main Research Building",
      room: "Lab 102",
    });

    const location3 = await StorageLocation.create({
      name: "Storage Cabinet C-2",
      description: "Room temperature storage cabinet",
      type: "Room temperature",
      building: "Main Research Building",
      room: "Lab 103",
    });

    console.log("Storage Locations created");

    // Create Storage Conditions
    const condition1 = await StorageCondition.create({
      name: "Ultra-cold",
      description: "Storage at -80°C",
      temperature: "-80°C",
    });

    const condition2 = await StorageCondition.create({
      name: "Standard refrigeration",
      description: "Storage at 4°C",
      temperature: "4°C",
    });

    const condition3 = await StorageCondition.create({
      name: "Room temperature",
      description: "Storage at ambient temperature (20-25°C)",
      temperature: "20-25°C",
    });

    console.log("Storage Conditions created");

    // Create Projects (without samples at first)
    const project1 = await Project.create({
      projectName: "CRISPR Gene Editing in Stem Cells",
      researchDomain: "Genetic Engineering",
      teamLead: user1._id,
      teamMembers: [
        {
          user: user2._id,
          role: "Senior Researcher",
        },
        {
          user: user3._id,
          role: "Lab Technician",
        },
      ],
      fundingSource: "National Research Agency",
      budget: 150000,
      startDate: new Date("2024-01-15"),
      deadline: new Date("2025-01-15"),
      status: "Active",
      collaboratingInstitutions: "Université de Paris, Institut Pasteur",
      ethicsApproval: true,
      ethicsApprovalRef: "ETHICS-2023-458",
      description:
        "Investigating CRISPR-Cas9 applications in human stem cells for therapeutic purposes",
      expectedOutcomes:
        "Development of new therapeutic approaches for genetic disorders",
      samples: [],
      createdBy: user1._id,
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-10"),
    });

    const project2 = await Project.create({
      projectName: "Biodegradable Polymers for Drug Delivery",
      researchDomain: "Biomaterials",
      teamLead: user2._id,
      teamMembers: [
        {
          user: user3._id,
          role: "Lab Technician",
        },
      ],
      fundingSource: "European Research Council",
      budget: 120000,
      startDate: new Date("2023-09-01"),
      deadline: new Date("2024-09-01"),
      status: "Active",
      collaboratingInstitutions: "École Polytechnique",
      ethicsApproval: true,
      ethicsApprovalRef: "ETHICS-2023-395",
      description:
        "Developing biodegradable polymer systems for targeted drug delivery in cancer treatment",
      expectedOutcomes:
        "Novel drug delivery system with improved efficacy and reduced side effects",
      samples: [],
      createdBy: user2._id,
      createdAt: new Date("2023-08-20"),
      updatedAt: new Date("2023-08-20"),
    });

    console.log("Projects created");

    // Create Samples
    const sample1 = await Sample.create({
      identification: "CRISPR-SC-001",
      type: "Stem Cell Line",
      quantity: "10 vials",
      storageConditions: [condition1._id.toString()],
      storageLocation: [location1._id.toString()],
      technician: user3._id,
      collectionDate: new Date("2024-01-20"),
      expirationDate: new Date("2024-07-20"),
      protocolFile: {
        fileName: "stem_cell_protocol.pdf",
        fileLocation: "/uploads/protocols/stem_cell_protocol.pdf",
        fileType: "application/pdf",
        uploadDate: new Date("2024-01-20"),
      },
      sampleReport: "Healthy stem cell line, passage 3, viability >95%",
      status: "Available",
      project: project1._id,
      createdBy: user3._id,
      createdAt: new Date("2024-01-20"),
      updatedAt: new Date("2024-01-20"),
    });

    const sample2 = await Sample.create({
      identification: "POLY-BIO-001",
      type: "Polymer Sample",
      quantity: "5 grams",
      storageConditions: [condition2._id.toString()],
      storageLocation: [location2._id.toString()],
      technician: user3._id,
      collectionDate: new Date("2023-09-15"),
      expirationDate: new Date("2024-09-15"),
      protocolFile: {
        fileName: "polymer_synthesis.pdf",
        fileLocation: "/uploads/protocols/polymer_synthesis.pdf",
        fileType: "application/pdf",
        uploadDate: new Date("2023-09-15"),
      },
      sampleReport: "Biodegradable polymer, batch #1, purity 98%",
      status: "In Use",
      project: project2._id,
      createdBy: user3._id,
      createdAt: new Date("2023-09-15"),
      updatedAt: new Date("2023-09-15"),
    });

    const sample3 = await Sample.create({
      identification: "CRISPR-SC-002",
      type: "Modified Stem Cell Line",
      quantity: "8 vials",
      storageConditions: [condition1._id.toString()],
      storageLocation: [location1._id.toString()],
      technician: user3._id,
      collectionDate: new Date("2024-02-05"),
      expirationDate: new Date("2024-08-05"),
      protocolFile: {
        fileName: "mod_stem_cell_protocol.pdf",
        fileLocation: "/uploads/protocols/mod_stem_cell_protocol.pdf",
        fileType: "application/pdf",
        uploadDate: new Date("2024-02-05"),
      },
      sampleReport: "CRISPR-modified stem cell line, passage 2, viability 92%",
      status: "Available",
      project: project1._id,
      createdBy: user3._id,
      createdAt: new Date("2024-02-05"),
      updatedAt: new Date("2024-02-05"),
    });

    console.log("Samples created");

    // Update projects with sample references
    await Project.findByIdAndUpdate(project1._id, {
      $push: { samples: [sample1._id, sample3._id] },
    });

    await Project.findByIdAndUpdate(project2._id, {
      $push: { samples: sample2._id },
    });

    console.log("Projects updated with sample references");

    // Create Notifications
    await Notification.create({
      user: user1._id,
      title: "Sample Expiring Soon",
      message: "Sample CRISPR-SC-001 will expire in 30 days.",
      type: "Warning",
      isRead: false,
      relatedProject: project1._id,
      relatedSample: sample1._id,
      createdAt: new Date("2024-06-20"),
    });

    await Notification.create({
      user: user2._id,
      title: "Project Deadline Approaching",
      message: "The Biodegradable Polymers project deadline is in 60 days.",
      type: "Info",
      isRead: true,
      relatedProject: project2._id,
      createdAt: new Date("2024-07-01"),
    });

    await Notification.create({
      user: user3._id,
      title: "New Sample Added",
      message: "You have been assigned as technician for sample CRISPR-SC-002.",
      type: "Success",
      isRead: false,
      relatedProject: project1._id,
      relatedSample: sample3._id,
      createdAt: new Date("2024-02-05"),
    });

    console.log("Notifications created");

    console.log("Database seeding completed successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
};

// Run the seed function
seedDatabase();
