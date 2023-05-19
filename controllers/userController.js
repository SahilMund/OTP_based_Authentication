const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const sendOTPMailer = require("../mailers/send-otp-mailer");
const { User, Otp } = require("../models");

module.exports.register = async (req, res) => {
  const { email, name } = req.body;

  // Validation for required fields
  if (!email || !name) {
    return res.status(400).json({
      success: false,
      message: "Email and Name Filed should not be empty",
    });
  }
  try {
    // To check if user is already registered or not
    const isUserExists = await User.findOne({ email });

    if (isUserExists) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered, Proceed to Login !!",
      });
    }

    //register the email
    let user = await User.create({ name, email });

    return res.status(400).json({
      success: true,
      message: "Email registered Successfully, Proceed for LogIn !!",
      data: user,
    });
  } catch (error) {
    console.error("Error while registering user", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while registering your email",
    });
  }
};

// Controller to handle generate-otp route
module.exports.generateOtp = async (req, res) => {
  const { email } = req.body;

  // Validation for required fields

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email field should not be empty" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "You are not a registered user, kindly register yourself to proceed for Login ",
      });
    }

    // Fetching the OTP which is present for the entered mail ID
    const OTP = await Otp.findOne({ email });

    // If OTP is present and if it is generated within a minute then throw error
    if (OTP && OTP.createdAt.getTime() + 60000 > Date.now()) {
      return res.status(429).json({
        success: false,
        message:
          "Please wait for at least 1 minute before generating a new OTP.",
      });
    }

    //Generate a new OTP with otpGenerator
    //Limiting our OTP to only digits
    const generatedOTP = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    //encrypting the generated OTP
    const salt = await bcrypt.genSalt(10);
    const encryptedOTP = await bcrypt.hash(generatedOTP, salt);

    // Fetching OTP for the user
    const userOTP = await Otp.findOne({ email });

    // If OTP is already present then updating it else creating a new one for the user with the encrypted OTP
    if (userOTP) {
      await Otp.updateOne({ email }, { $set: { otp: encryptedOTP } });
    } else {
      await Otp.create({ email, otp: encryptedOTP });
    }

    // Send the OTP to the user's email using nodemailer
    return sendOTPMailer.sendVerificationOTP({ user, otp: generatedOTP, res });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while generating OTP - " + error.message,
    });
  }
};

// Controller to handle login route
module.exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  //   Validating required fields
  if (!email || !otp) {
    return res
      .status(400)
      .json({ status: false, message: "Both Email and OTP are required" });
  }
  try {
    const user = await User.findOne({ email });
    // To check if the user has entered 5 times wrong OTP, then blocking him/her
    const isBlocked = await User.countDocuments({
      email,
      failedAttempts: { $gte: 5 },
    });

    if (isBlocked) {
      // If the user's account is blocked, then sending a response stating the reattempt time
      const remainingTime =
        60 - Math.ceil((Date.now() - user.lockedAt.getTime()) / (60 * 1000));

      if (remainingTime > 0) {
        return res.status(403).json({
          status: false,
          message: `Account blocked. Try again after ${remainingTime} minutes.`,
        });
      } else {
        user.failedAttempts = 0;

        await user.save();
      }
    }
    // Find the OTP for the entered email
    const OTP = await Otp.findOne({ email });

    if (!OTP) {
      // If OTP is not found, return an error
      return res
        .status(401)
        .json({ status: false, message: "Invalid OTP or email." });
    }

    // Compare the entered OTP with the hashed OTP stored in the DB
    const isOTPValid = await bcrypt.compare(otp, OTP.otp);

    if (isOTPValid) {
      //  Resetting the OTP to empty string, to prevent verification with same OTP
      await Otp.updateOne({ email }, { $set: { otp: "" } });
      // resetting failedAttempts to zero
      user.failedAttempts = 0;

      await user.save();

      // Generate a JWT token and send it with response
      const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1h",
      });

      // Return the JWT token in the response
      return res.status(200).json({ status: true, token: token });
    }

    // Increment the failed attempts count
    user.failedAttempts = (user.failedAttempts || 0) + 1;
    await user.save();

    // Check if the user has reached the maximum failed attempts which is five in this case
    const MAXIMUM_FAILED_ATTEMPT = 5;
    if (user.failedAttempts >= MAXIMUM_FAILED_ATTEMPT) {
      // If the user has reached the maximum failed attempts, block the account
      user.lockedAt = Date.now();
      await user.save();
      return res.status(403).json({
        status: false,
        message: "Account blocked. Try again after 1 hour.",
      });
    }

    // Return an error indicating the OTP is invalid
    res.status(401).json({ success: false, error: "Invalid OTP or email." });
  } catch (error) {
    console.error("Error during login:", error);
    res
      .status(500)
      .json({ status: false, message: "An error occurred during login." });
  }
};
