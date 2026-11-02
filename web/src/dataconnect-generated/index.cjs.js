const { validateAdminArgs } = require('firebase-admin/data-connect');

const AthleteStatus = {
  prospect: "prospect",
  active: "active",
  inactive: "inactive",
  graduated: "graduated",
  archived: "archived",
}
exports.AthleteStatus = AthleteStatus;

const DominantSide = {
  left: "left",
  right: "right",
  ambidextrous: "ambidextrous",
  not_applicable: "not_applicable",
}
exports.DominantSide = DominantSide;

const Gender = {
  female: "female",
  male: "male",
  non_binary: "non_binary",
  prefer_not_to_say: "prefer_not_to_say",
  other: "other",
}
exports.Gender = Gender;

const GuardianRelationshipType = {
  mother: "mother",
  father: "father",
  stepmother: "stepmother",
  stepfather: "stepfather",
  grandparent: "grandparent",
  sibling_adult: "sibling_adult",
  legal_guardian: "legal_guardian",
  foster_parent: "foster_parent",
  other: "other",
}
exports.GuardianRelationshipType = GuardianRelationshipType;

const PerformanceSourceType = {
  training: "training",
  match: "match",
  assessment: "assessment",
  video_review: "video_review",
  combined: "combined",
}
exports.PerformanceSourceType = PerformanceSourceType;

const connectorConfig = {
  connector: 'web',
  serviceId: 'basketball-net',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

function myAthlete(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('MyAthlete', undefined, inputOpts);
}
exports.myAthlete = myAthlete;

function myPerformanceEvents(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('MyPerformanceEvents', inputVars, inputOpts);
}
exports.myPerformanceEvents = myPerformanceEvents;

function myManagedAthletes(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('MyManagedAthletes', undefined, inputOpts);
}
exports.myManagedAthletes = myManagedAthletes;

function publicAthleteBySlug(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('PublicAthleteBySlug', inputVars, inputOpts);
}
exports.publicAthleteBySlug = publicAthleteBySlug;

function publicAthleteSlugs(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('PublicAthleteSlugs', undefined, inputOpts);
}
exports.publicAthleteSlugs = publicAthleteSlugs;

function discoverableAthletes(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, false);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('DiscoverableAthletes', inputVars, inputOpts);
}
exports.discoverableAthletes = discoverableAthletes;

function publicPerformanceEvents(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('PublicPerformanceEvents', inputVars, inputOpts);
}
exports.publicPerformanceEvents = publicPerformanceEvents;

