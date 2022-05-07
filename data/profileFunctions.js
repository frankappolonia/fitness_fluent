const errorHandling = require("../helper");
const validations = errorHandling.userValidations;
const users = require("./users");
const db = require("../config");
const usersCollection = db.usersCollection;
const { ObjectId } = require("mongodb");

async function getUserData(id) {
    id = validations.checkId(id);
    return await users.getUserById(id);
}

async function updateName(id, firstName, lastName) {
    id = validations.checkId(id);
    validations.stringtrim(arguments);
    validations.stringChecks([firstName, lastName]);
    validations.nameValidation(firstName, lastName);

    let firstUpdate = await usersCollection.updateOne(
        {_id: ObjectId(id)},
        {$set: {firstName: firstName}}
    );
    if (firstUpdate === null) throw "error updating user's first name!";

    let lastUpdate = await usersCollection.updateOne(
        {_id: ObjectId(id)},
        {$set: {lastName: lastName}}
    );

    if (lastUpdate === null) throw "error updating user's last name!";
    return true;
}

async function updateActivityLevel(id, activityLevel) {
    id = validations.checkId(id);
    validations.stringtrim(arguments);
    validations.stringChecks([activityLevel]);
    validations.activityLevelValidation(activityLevel);
    activityLevel.toLowerCase();

    let result = await usersCollection.updateOne(
        {_id: ObjectId(id)},
        {$set: {activityLevel: activityLevel}}
    );

    if (result === null) throw "error updating user's activity level!";
    return true;
}

async function updateWeeklyWeightGoal(id, goal) {
    id = validations.checkId(id);
    validations.weeklyGoalValidation(goal);

    let result = await usersCollection.updateOne(
        {_id: ObjectId(id)},
        {$set: {weeklyWeightGoal: goal}}
    );

    if (result === null) throw "error updating user's weekly weight goal!";
    return true;
}

async function updateHeight(id, height) {
    id = validations.checkId(id);
    let user = await getUserData(id);
    let weight = user.weight;
    validations.heightWeightValidation(height, weight);

    let result = await usersCollection.updateOne(
        {_id: ObjectId(id)},
        {$set: {height: height}}
    );

    if (result === null) throw "error updating user's height!";
    return true;
}

async function updateWeight(id, weight) {
    id = validations.checkId(id);
    let user = await getUserData(id);
    let height = user.height;
    validations.heightWeightValidation(height, weight);

    let result = await users.logCurrentWeight(id, weight, "current");

    if (!result) throw "error updating user's weight!";
    return true;
}

module.exports = {
    getUserData,
    updateName,
    updateActivityLevel,
    updateWeeklyWeightGoal,
    updateHeight,
    updateWeight
};