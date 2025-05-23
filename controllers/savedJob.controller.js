const Job = require("../models/job.model");
const User = require("../models/user.model.js");
const SavedJob = require("../models/savedJobs.model.js")


module.exports.saveJob = async (req, res) => {
    try {
        const { id } = req.body;
        const userId = req.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (user.role !== "Employee") {
            return res.status(403).json({
                success: false,
                message: "User is not a Employee"
            });
        }

        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        const savedJobs = await SavedJob.findOne({ employee: userId })
        if (!savedJobs) {
            await SavedJob.create({
                employee: user,
                jobs: [{
                    job: job._id,
                }]
            })
        } else {
            const alreadySaved = savedJobs.jobs.some(j => j.job.toString() === job._id.toString());
            if (!alreadySaved) {
                savedJobs.jobs.push({
                    job: job._id,
                });
                await savedJobs.save();
            }
            
        }

        const allSavedJobs = await SavedJob.findOne({ employee: userId }).populate('jobs.job');

        return res.status(200).json({
            success: true,
            message: "Job is successfully saved!",
            allSavedJobs
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports.unsaveJob = async (req, res) => {
    try {
        const { id } = req.body;
        const userId = req.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (user.role !== "Employee") {
            return res.status(403).json({
                success: false,
                message: "User is not a Employee"
            });
        }

        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }
        const savedJobs = await SavedJob.findOne({ employee: userId })
        if (!savedJobs) {
            return res.status(404).json({
                success: false,
                message: "No job saved"
            });
        }

        savedJobs.jobs = savedJobs.jobs.filter(j => j.job.toString() !== id.toString());
        if (savedJobs.jobs.length === 0) {
            await SavedJob.deleteOne({ _id: savedJobs._id });
        } else {
            await savedJobs.save();
        }


        const allSavedJobs = await SavedJob.findOne({ employee: userId }).populate('jobs.job');

        return res.status(200).json({
            success: true,
            message: "Job is successfully unsaved!",
            allSavedJobs
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
module.exports.getSavedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (user.role !== "Employee") {
            return res.status(403).json({
                success: false,
                message: "User is not a Employee"
            });
        }

        const allSavedJobs = await SavedJob.findOne({ employee: userId }).populate('jobs.job');
        return res.status(200).json({
            success: true,
            allSavedJobs
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" });
    }
}