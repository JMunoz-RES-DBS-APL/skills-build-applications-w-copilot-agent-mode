import mongoose from 'mongoose';
import { Activity, Leaderboard, Team, User, Workout } from '../models/index.js';
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
const teamDefinitions = [
    { name: 'Trail Blazers' },
    { name: 'Pace Makers' },
];
const userDefinitions = [
    { username: 'alex_runner', name: 'Alex Rivera', email: 'alex@example.com', points: 320, teamName: 'Trail Blazers' },
    { username: 'sam_cyclist', name: 'Sam Chen', email: 'sam@example.com', points: 280, teamName: 'Trail Blazers' },
    { username: 'jordan_swims', name: 'Jordan Patel', email: 'jordan@example.com', points: 350, teamName: 'Pace Makers' },
    { username: 'taylor_hikes', name: 'Taylor Brooks', email: 'taylor@example.com', points: 240, teamName: 'Pace Makers' },
];
const activityDefinitions = [
    { username: 'alex_runner', type: 'running', durationMinutes: 35, distanceKm: 5.2, calories: 410, completedAt: new Date('2026-09-20T08:00:00.000Z') },
    { username: 'sam_cyclist', type: 'cycling', durationMinutes: 50, distanceKm: 18, calories: 520, completedAt: new Date('2026-09-21T07:30:00.000Z') },
    { username: 'jordan_swims', type: 'swimming', durationMinutes: 40, distanceKm: 1.5, calories: 390, completedAt: new Date('2026-09-22T17:00:00.000Z') },
    { username: 'taylor_hikes', type: 'hiking', durationMinutes: 65, distanceKm: 6.8, calories: 460, completedAt: new Date('2026-09-23T09:15:00.000Z') },
];
const workoutDefinitions = [
    { name: 'Easy Run', description: 'A relaxed aerobic run at a conversational pace.', durationMinutes: 30, difficulty: 'beginner', activityType: 'running' },
    { name: 'Tempo Ride', description: 'Steady cycling intervals to build endurance.', durationMinutes: 45, difficulty: 'intermediate', activityType: 'cycling' },
    { name: 'Pool Intervals', description: 'Alternating swim efforts with short recovery breaks.', durationMinutes: 35, difficulty: 'intermediate', activityType: 'swimming' },
    { name: 'Hill Hike', description: 'A brisk hike with sustained uphill sections.', durationMinutes: 60, difficulty: 'advanced', activityType: 'hiking' },
];
/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
    try {
        await mongoose.connect(connectionString);
        console.log('Connected to octofit_db');
        const teams = new Map();
        for (const teamDefinition of teamDefinitions) {
            const team = await Team.findOneAndUpdate({ name: teamDefinition.name }, { $setOnInsert: { name: teamDefinition.name } }, { upsert: true, new: true, setDefaultsOnInsert: true });
            teams.set(teamDefinition.name, team._id);
        }
        const users = new Map();
        for (const userDefinition of userDefinitions) {
            const teamId = teams.get(userDefinition.teamName);
            if (!teamId) {
                throw new Error(`Unknown team: ${userDefinition.teamName}`);
            }
            const user = await User.findOneAndUpdate({ username: userDefinition.username }, {
                $set: {
                    name: userDefinition.name,
                    email: userDefinition.email,
                    points: userDefinition.points,
                    teamId,
                },
            }, { upsert: true, new: true, setDefaultsOnInsert: true });
            users.set(userDefinition.username, { _id: user._id, points: user.points, teamId });
        }
        for (const teamDefinition of teamDefinitions) {
            const memberIds = userDefinitions
                .filter((userDefinition) => userDefinition.teamName === teamDefinition.name)
                .map((userDefinition) => users.get(userDefinition.username)._id);
            const totalPoints = userDefinitions
                .filter((userDefinition) => userDefinition.teamName === teamDefinition.name)
                .reduce((sum, userDefinition) => sum + userDefinition.points, 0);
            await Team.updateOne({ name: teamDefinition.name }, { $set: { members: memberIds, totalPoints } });
        }
        for (const activityDefinition of activityDefinitions) {
            const user = users.get(activityDefinition.username);
            if (!user) {
                throw new Error(`Unknown user: ${activityDefinition.username}`);
            }
            const { username, ...activity } = activityDefinition;
            await Activity.findOneAndUpdate({ userId: user._id, type: activity.type, completedAt: activity.completedAt }, { $set: { ...activity, userId: user._id } }, { upsert: true, new: true, setDefaultsOnInsert: true });
        }
        for (const userDefinition of userDefinitions) {
            const user = users.get(userDefinition.username);
            await Leaderboard.findOneAndUpdate({ userId: user._id, period: 'all-time' }, { $set: { teamId: user.teamId, points: user.points, period: 'all-time' } }, { upsert: true, new: true, setDefaultsOnInsert: true });
        }
        for (const workoutDefinition of workoutDefinitions) {
            await Workout.findOneAndUpdate({ name: workoutDefinition.name }, { $set: workoutDefinition }, { upsert: true, new: true, setDefaultsOnInsert: true });
        }
        console.log('Database seeding complete');
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exitCode = 1;
    }
    finally {
        await mongoose.disconnect();
    }
}
seedDatabase();
