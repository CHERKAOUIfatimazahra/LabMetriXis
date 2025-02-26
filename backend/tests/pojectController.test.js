const mongoose = require("mongoose");
const Project = require("../models/Project");
const Sample = require("../models/Sample");
const Report = require("../models/Report");
const projectController = require("../controllers/projectController");

// Mock de la réponse Express
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Nettoyage après chaque test
afterEach(() => {
  jest.clearAllMocks();
});

// **Tests pour `createProject`**
describe("createProject", () => {
  it("devrait créer un projet avec succès", async () => {
    const req = {
      body: { title: "Projet Test", description: "Description test" },
      user: { id: "user123" },
    };
    const res = mockResponse();

    Project.prototype.save = jest.fn().mockResolvedValue({
      title: req.body.title,
      description: req.body.description,
      createdBy: req.user.id,
      status: "In Progress",
    });

    await projectController.createProject(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Project created successfully",
      })
    );
  });

  it("devrait renvoyer une erreur en cas d'échec", async () => {
    const req = { body: {}, user: { id: "user123" } };
    const res = mockResponse();

    Project.prototype.save = jest
      .fn()
      .mockRejectedValue(new Error("Erreur interne"));

    await projectController.createProject(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Erreur interne" });
  });
});

// **Tests pour `getAllProjects`**
describe("getAllProjects", () => {
  it("devrait récupérer tous les projets de l'utilisateur", async () => {
    const req = { user: { id: "user123" } };
    const res = mockResponse();

    Project.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([{ title: "Projet Test" }]),
      }),
    });

    await projectController.getAllProjects(req, res);
    expect(res.json).toHaveBeenCalledWith([{ title: "Projet Test" }]);
  });

  it("devrait gérer les erreurs", async () => {
    const req = { user: { id: "user123" } };
    const res = mockResponse();

    Project.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error("Erreur serveur")),
      }),
    });

    await projectController.getAllProjects(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Erreur serveur" });
  });
});

// **Tests pour `getProjectById`**
describe("getProjectById", () => {
  it("devrait retourner un projet s'il existe", async () => {
    const req = {
      params: { projectId: "project123" },
      user: { id: "user123" },
    };
    const res = mockResponse();

    Project.findOne = jest.fn().mockResolvedValue({ title: "Projet Test" });

    await projectController.getProjectById(req, res);
    expect(res.json).toHaveBeenCalledWith({ title: "Projet Test" });
  });

  it("devrait renvoyer 404 si le projet n'existe pas", async () => {
    const req = {
      params: { projectId: "project123" },
      user: { id: "user123" },
    };
    const res = mockResponse();

    Project.findOne = jest.fn().mockResolvedValue(null);

    await projectController.getProjectById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Project not found" });
  });
});

// **Tests pour `updateProject`**
describe("updateProject", () => {
  it("devrait mettre à jour un projet existant", async () => {
    const req = {
      params: { projectId: "project123" },
      body: { title: "Titre mis à jour" },
      user: { id: "user123" },
    };
    const res = mockResponse();

    Project.findOneAndUpdate = jest.fn().mockResolvedValue({
      title: "Titre mis à jour",
    });

    await projectController.updateProject(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Project updated successfully" })
    );
  });

  it("devrait renvoyer 404 si le projet n'existe pas", async () => {
    const req = {
      params: { projectId: "project123" },
      user: { id: "user123" },
    };
    const res = mockResponse();

    Project.findOneAndUpdate = jest.fn().mockResolvedValue(null);

    await projectController.updateProject(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Project not found" });
  });
});

// **Tests pour `getSamplesByProject`**
describe("getSamplesByProject", () => {
  it("devrait retourner des échantillons", async () => {
    const req = {
      params: { projectId: "project123" },
      user: { id: "user123" },
    };
    const res = mockResponse();

    Sample.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue([{ sample: "Sample1" }]),
    });

    await projectController.getSamplesByProject(req, res);
    expect(res.json).toHaveBeenCalledWith([{ sample: "Sample1" }]);
  });

  it("devrait gérer les erreurs", async () => {
    const req = {
      params: { projectId: "project123" },
      user: { id: "user123" },
    };
    const res = mockResponse();

    Sample.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockRejectedValue(new Error("Erreur serveur")),
    });

    await projectController.getSamplesByProject(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Erreur serveur" });
  });
});

// **Tests pour `requestSampleAnalysis`**
describe("requestSampleAnalysis", () => {
  it("devrait mettre à jour un échantillon pour une analyse", async () => {
    const req = {
      params: { sampleId: "sample123" },
      body: { analysisType: "TypeA", priority: "High" },
      user: { id: "user123" },
    };
    const res = mockResponse();

    Sample.findOneAndUpdate = jest
      .fn()
      .mockResolvedValue({ status: "In Progress" });

    await projectController.requestSampleAnalysis(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Analysis requested successfully" })
    );
  });

  it("devrait renvoyer 404 si l'échantillon n'existe pas", async () => {
    const req = { params: { sampleId: "sample123" }, user: { id: "user123" } };
    const res = mockResponse();

    Sample.findOneAndUpdate = jest.fn().mockResolvedValue(null);

    await projectController.requestSampleAnalysis(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Sample not found" });
  });
});
