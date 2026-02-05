"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gender = exports.PlanType = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
var PlanType;
(function (PlanType) {
    PlanType["FREE"] = "free";
    PlanType["YEARLY"] = "yearly";
    PlanType["LIFETIME"] = "lifetime";
})(PlanType || (exports.PlanType = PlanType = {}));
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
    Gender["OTHER"] = "other";
})(Gender || (exports.Gender = Gender = {}));
