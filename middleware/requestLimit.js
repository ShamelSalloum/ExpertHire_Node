import moment from "moment";
import Request from "../models/RequestModel";

export const checkRequestLimit = async (req, res, next) => {

    const maxRequestsPerDay = 5;

    try {
        const user_id = req.user.id;
        const last24Hours = moment().subtract(24, "hours");

        const requestCount = await Request.countDocuments({
            user_id: user_id,
            createdAt: { $gte: last24Hours },
        });

        if (requestCount >= maxRequestsPerDay) {
            return res
                .status(403)
                .json({ success: false, message: "Request limit exceeded for the day" });
        }

        next();
    } catch (error) {
        console.error("Error checking request limit:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};
