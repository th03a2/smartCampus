const Companies = require("./Companies");
const Branches = require("./Branches");
const Sources = require("./Sources");
const Persons = require("./Persons");
const File201 = require("./file201");
const Schedulers = require("./Schedulers");
const Sections = require("./Sections");
const Strands = require("./Strands");
const Specializations = require("./Specializations");
const Books = require("./Books");
const Subjects = require("./Subjects");
const Banks = require("./Banks");
const Articles = require("./Articles");
const Batch = require("./Batch");
const Enrollment = require("./Enrollment");
const Employees = require("./Employees.js");
const Exams = require("./Exams");
const assets = {
  root: "assets",
  branches: [
    {
      root: "companies",
      routes: Companies,
    },
    {
      root: "branches",
      routes: Branches,
    },
    {
      root: "sources",
      routes: Sources,
    },
    {
      root: "persons",
      children: Persons,
    },
    {
      root: "file201",
      children: File201,
    },

    {
      root: "Sections",
      routes: Sections,
    },
    {
      root: "Strands",
      routes: Strands,
    },
    {
      root: "specializations",
      routes: Specializations,
    },
    {
      root: "books",
      routes: Books,
    },
    {
      root: "schedulers",
      routes: Schedulers,
    },
    {
      root: "subjects",
      routes: Subjects,
    },
    {
      root: "banks",
      routes: Banks,
    },
    {
      root: "articles",
      routes: Articles,
    },
    {
      root: "batch",
      routes: Batch,
    },
    {
      root: "enrollment",
      routes: Enrollment,
    },
    {
      root: "employees",
      routes: Employees,
    },
    {
      root: "exams",
      routes: Exams,
    },
  ],
};

module.exports = assets;
