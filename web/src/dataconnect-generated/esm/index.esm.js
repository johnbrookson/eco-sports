import { validateAdminArgs } from 'firebase-admin/data-connect';

export const AthleteStatus = {
  prospect: "prospect",
  active: "active",
  inactive: "inactive",
  graduated: "graduated",
  archived: "archived",
}

export const DominantSide = {
  left: "left",
  right: "right",
  ambidextrous: "ambidextrous",
  not_applicable: "not_applicable",
}

export const Gender = {
  female: "female",
  male: "male",
  non_binary: "non_binary",
  prefer_not_to_say: "prefer_not_to_say",
  other: "other",
}

export const GuardianRelationshipType = {
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

export const PerformanceSourceType = {
  training: "training",
  match: "match",
  assessment: "assessment",
  video_review: "video_review",
  combined: "combined",
}

export const connectorConfig = {
  connector: 'web',
  serviceId: 'basketball-net',
  location: 'us-east4'
};

export function myAthlete(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('MyAthlete', undefined, inputOpts);
}

export function myPerformanceEvents(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('MyPerformanceEvents', inputVars, inputOpts);
}

export function myManagedAthletes(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('MyManagedAthletes', undefined, inputOpts);
}

export function publicAthleteBySlug(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('PublicAthleteBySlug', inputVars, inputOpts);
}

export function publicAthleteSlugs(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('PublicAthleteSlugs', undefined, inputOpts);
}

export function discoverableAthletes(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, false);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('DiscoverableAthletes', inputVars, inputOpts);
}

export function publicPerformanceEvents(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('PublicPerformanceEvents', inputVars, inputOpts);
}

