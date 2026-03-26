import UserModel from "../model/user-model.js";
import bcryptjs from "bcryptjs";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import sendEmail from "../config/sendEmail.js";
import { generatedAccessToken } from "../utils/generatedAccessToken.js";
import { generatedRefreshToken } from "../utils/generatedRefreshToken.js";
import { uploadImageCloudinary } from "../utils/uploadImageCloudinary.js";
import { forgotPasswordTemplate } from "../utils/forgotPasswordTemplate.js";
import { generateOtp } from "../utils/generatedOtp.js";
import jwt from "jsonwebtoken";

export const registerUserController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Provide email, name, password",
        error: true,
        success: false,
      });
    }
    const user = await UserModel.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "Already register email",
        error: true,
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashPassword,
    };

    const newUser = new UserModel(payload);
    const save = await newUser.save();

    const verifyEmailUrl = `${process.env.CLIENT_URL}/verify-email?code=${save?._id}`;
    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Verify email from blikit",
      html: verifyEmailTemplate({
        name,
        url: verifyEmailUrl,
      }),
    });
    return res.json({
      message: "User register successfully",
      error: false,
      success: true,
      data: save,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const verifyEmailController = async (req, res) => {
  try {
    const { code } = req.body;
    const user = await UserModel.findOne({ _id: code });
    if (!user) {
      return res.status(400).json({
        message: "Invalid code",
        error: true,
        success: false,
      });
    }
    const updateUser = await UserModel.updateOne(
      { _id: code },
      {
        verify_email: true,
      },
    );

    return res.json({
      message: "Verify email done",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      erro: true,
      success: false,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Provide email, password",
        error: true,
        success: false,
      });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not register",
        error: true,
        success: false,
      });
    }

    if (user.status !== "active") {
      return res.status(400).json({
        message: "Contact to Admin",
        error: true,
        success: false,
      });
    }
    const checkPassword = await bcryptjs.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({
        message: "Check your password",
        error: true,
        success: false,
      });
    }

    const accessToken = await generatedAccessToken(user._id);
    const refreshToken = await generatedRefreshToken(user._id);

    const updateUser= await UserModel.findByIdAndUpdate(user?._id,{
      last_login_date: new Date(),
    })
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.cookie("accessToken", accessToken, cookiesOption);
    res.cookie("refreshToken", refreshToken, cookiesOption);

    return res.json({
      message: "Login successfully",
      error: false,
      success: true,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const logoutController = async (req, res) => {
  try {
    const userid = req.userId; // coming from middleware
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.clearCookie("accessToken", cookiesOption);
    res.clearCookie("refreshToken", cookiesOption);

    const removeRefreshToken = await UserModel.findByIdAndUpdate(userid, {
      refresh_token: "",
    });
    return res.status(200).json({
      message: "Logout successful",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// upload user avatar
export const uploadAvatar = async (req, res) => {
  try {
    const userId = req.userId; // coming from auth middleware
    const image = req.file; // coming from multer middleware
    console.log("image", image);
    const upload = await uploadImageCloudinary(image);
    const updateUser = await UserModel.findByIdAndUpdate(userId, {
      avatar: upload.url,
    });
    return res.json({
      message: "upload profile",
      data: {
        _id: userId,
        avatar: upload.url,
      },
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//update user details
export const updateUserDetails = async (req, res) => {
  try {
    const userId = req.userId; // auth middleware
    const { name, email, mobile, password } = req.body;
    let hashPassword = "";
    if (password) {
      const salt = await bcryptjs.genSalt(10);
      hashPassword = await bcryptjs.hash(password, salt);
    }
    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        ...(name && { name: name }),
        ...(email && { email: email }),
        ...(mobile && { mobile: mobile }),
        ...(password && { password: hashPassword }),
      },
      { new: true },
    );

    return res.json({
      message: "Update user successfully",
      error: false,
      success: true,
      data: updateUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// Forgot Password not login
export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        error: true,
        success: false,
      });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Email not register",
        error: true,
        success: false,
      });
    }
    const otp = generateOtp().toString();
    const expireTime = Date.now() + 10 * 60 * 1000; // 10 minutes
    await UserModel.findByIdAndUpdate(user._id, {
      forgot_password_otp: otp,
      forgot_password_expiry: new Date(expireTime),
    });
    // send email to user with otp,
    await sendEmail({
      sendTo: email,
      subject: "Forgot password OTP from blikit",
      html: forgotPasswordTemplate({
        name: user.name,
        otp,
      }),
    });
    return res.json({
      message: "Please check your email for OTP",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//verify forgot password otp
export const verifyForgotPasswordOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;

      if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
        error: true,
        success: false,
      });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Email not registered",
        error: true,
        success: false,
      });
    }
    if (user.forgot_password_otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
        error: true,
        success: false,
      });
    }
    if (!user.forgot_password_expiry || new Date(user.forgot_password_expiry) < new Date()) {
      return res.status(400).json({
        message: "OTP expired",
        error: true,
        success: false,
      });
    }

    await UserModel.findByIdAndUpdate(user._id, {
      forgot_password_otp: "",
      forgot_password_expiry: "",
    });
    

    return res.json({
      message: "Verify otp successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// reset password with otp
export const resetPasswordController = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Provide email, new password and confirm password",
        error: true,
        success: false,
      });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Email not register",
        error: true,
        success: false,
      });
    }

    if(newPassword !== confirmPassword){
      return res.status(400).json({
        message: "New password and confirm password does not match",
        error: true,
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(newPassword, salt);
    const update = await UserModel.findByIdAndUpdate(user._id, {
      password: hashPassword,
    });
    return res.json({
      message: "Reset password successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//refresh token controller
export const refreshTokenController = async (req, res) => {
  try{
    const refreshToken = req.cookies.refreshToken || req.headers.authorization?.split(" ")[1];
    if(!refreshToken){
      return res.status(401).json({
        message: "No refresh token provided",
        error: true,
        success: false,
      });
    }
    const verifyToken= await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);
    if(!verifyToken){
      return res.status(401).json({
        message: "Refresh token is expired",
        error: true,
        success: false,
      });
    }

    // console.log("verify", verifyToken);
    const userId=verifyToken?._id

    const newAccessToken = await generatedAccessToken(userId)
     const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.cookie('accesstoken', newAccessToken, cookiesOption)

    return res.json({
      message: "New Access Token Generated",
      error:false,
      success:true,
      data:{
        accessToken:newAccessToken
      }
    })
    
  } catch(error){
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export const userDetails=async (req,res)=>{
  try{
    const userId=req.userId; // auth middleware
    const user=await UserModel.findById(userId).select("-password -refresh_token");

    return res.json({
      message:'user details',
      data:user,
      error:false,
      success:true
    })
  } catch(error){
    return res.status(500).json({
      message:"Something is wrong",
      error:true,
      success:false
    })
  }
}
