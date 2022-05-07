const errorHandling = require("../helper");
const validations = errorHandling.userValidations;
const db = require("../config");
const users = db.usersCollection;
const { ObjectId } = require("mongodb");


async function updateName(id, firstName, lastName) {
    id = validations.checkId(id);
    validations.stringtrim(arguments);
    validations.stringChecks([firstName, lastName]);
    validations.nameValidation(firstName, lastName);

    const usersCollection = await users()

    let firstUpdate = await usersCollection.updateOne(
        {_id: ObjectId(id)},
        {$set: {firstName: firstName}}
    );
    if (firstUpdate === null) throw "error updating user's first name!";

    let lastUpdate = await usersCollection.updateOne({_id: ObjectId(id)},{$set: {'lastName': lastName}});

    if (lastUpdate === null) throw "error updating user's last name!";
    return true;
}

async function updateActivityLevel(id, activityLevel) {
    id = validations.checkId(id);
    validations.stringtrim(arguments);
    validations.stringChecks([activityLevel]);
    validations.activityLevelValidation(activityLevel);
    activityLevel.toLowerCase();

    const usersCollection = await users()

    let result = await usersCollection.updateOne({_id: ObjectId(id)}, {$set: {'activityLevel': activityLevel}});

    if (result === null) throw "error updating user's activity level!";
    return true;
}

async function updateWeeklyWeightGoal(id, goal) {
    id = validations.checkId(id);
    validations.weeklyGoalValidation(goal);

    const usersCollection = await users()

    let result = await usersCollection.updateOne(
        {_id: ObjectId(id)},
        {$set: {'weeklyWeightGoal': goal}}
    );

    if (result === null) throw "error updating user's weekly weight goal!";
    return true;
}

async function updateHeight(id, height) {
    id = validations.checkId(id);
    validations.heightWeightValidation(height, 80);

    const usersCollection = await users()

    let result = await usersCollection.updateOne({_id: ObjectId(id)},{$set: {'height': height}});

    if (result === null) throw "error updating user's height!";
    return true;
}


module.exports = {
    updateName,
    updateActivityLevel,
    updateWeeklyWeightGoal,
    updateHeight,
};