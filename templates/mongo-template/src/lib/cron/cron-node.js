const cron = require("node-cron");
const Auth = require("../../model/auth.model");
const { Op } = require("sequelize");
const OTP = require("../../model/otp.model");

const deleteUnverifiedUser = async () => {
  try {
    await Auth.destroy({
      where: {
        isVerified: false,
        createdAt: {
          [Op.lt]: new Date(Date.now() - 3600000),
        },
      },
    });
  } catch (error) {
    console.error(error.message);
  }
};

const expireOTP = async () => {
  try {
    await OTP.updateMany(
      {
        status: "pending",
        createdAt: { $lt: new Date(Date.now() - 5 * 60 * 1000) },
      },
      {
        $set: {
          status: "expired",
        },
      }
    );
  } catch (error) {
    next(error);
  }
};

const deleteExpiredOTP = async () => {
  try {
    await OTP.deleteMany({
      status: { $in: ["expired", "verified"] },
      updatedAt: { $lt: new Date(Date.now() - 5 * 60 * 1000) },
    });
  } catch (error) {
    next(error);
  }
};

cron.schedule("* * * * *", () => {
  deleteUnverifiedUser();
  expireOTP();
  deleteExpiredOTP();
});
