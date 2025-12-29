import semver from "semver";

const isValidSemverRange = semver.validRange("6.0.0") ? true : false;

console.log("Is valid semver range:", isValidSemverRange);
