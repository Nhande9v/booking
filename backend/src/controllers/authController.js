import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const upgradeToProvider = async (req, res, next) => {
  const userId = req.params.id; // Lấy ID từ URL
  const updateData = req.body;  // Dữ liệu từ Frontend gửi lên

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId, // THÊM BIẾN NÀY VÀO ĐẦY ĐỦ
      {
        $set: {
          role: "provider",
          providerDetails: {
            businessName: updateData.businessName,
            phoneNumber: updateData.phoneNumber,
            address: updateData.address,
            identityCard: updateData.identityCard,
            bankAccount: {
              bankName: updateData.bankName,
              accountNumber: updateData.accountNumber,
              accountName: updateData.accountName,
            },
            isVerified: true,
          },
        },
      },
      { 
        new: true, 
        returnDocument: 'after' // Để lấy dữ liệu mới nhất sau khi update
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng này!" });
    }

    res.status(200).json({
      success: true,
      message: "Nâng cấp thành công!",
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    console.log("User ID from token:", req.user.id); 
    const user = await User.findById(req.user.id).select("+password");
    const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.newPassword, salt);
    await user.save();
    res.status(200).json({ message: "Password updated successfully! 🎉" });
  } catch (error) {
    next(error);
  }
}

export const register = async (req, res) => {
  try {
    // Mã hóa mật khẩu
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(200).send("User has been created.");
  } catch (err) {
    res.status(500).json(err);
  }
};

export const login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(404).json("User not found!");

    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordCorrect) return res.status(400).json("Wrong password or username!");

    const token = jwt.sign(
   {
    id: user._id.toString(),
    role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
    );

    const { password, isAdmin, ...otherDetails } = user._doc;
    res.cookie("access_token", token, {
      httpOnly: true, 
    })
    .status(200)
    .json({ token, details: { ...otherDetails }, isAdmin });
  } catch (err) {
    res.status(500).json(err);
  }
};


export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "User not found!" });

    const resetToken = crypto.randomBytes(32).toString("hex");

    // LƯU VÀO DATABASE
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 phút
    
    await user.save(); // THIẾU DÒNG NÀY LÀ BỊ LỖI 400 NGAY

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const htmlContent = `
      <div style="max-width: 600px; margin: auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
        <div style="background-color: #4f46e5; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">ALaura</h1>
        </div>
        <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
          <h2 style="font-weight: 800;">Password Reset Request</h2>
          <p>We received a request to reset your password. Click the button below to proceed. This link will expire in 15 minutes.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">Reset My Password</a>
          </div>
          <p style="font-size: 13px; color: #64748b;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "ALaura Haven - Password Reset",
        html: htmlContent,
      });

      res.status(200).json({ message: "Email sent successfully!" });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    // 1. Tìm user có token khớp và chưa hết hạn
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpire: { $gt: Date.now() }, // $gt là "greater than" (lớn hơn thời gian hiện tại)
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // 2. Mã hóa mật khẩu mới
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(req.body.password, salt);

    // 3. Xóa token sau khi đã dùng xong
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password updated successfully! 🎉" });
  } catch (err) {
    next(err);
  }
};
