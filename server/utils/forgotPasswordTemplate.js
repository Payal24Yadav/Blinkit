export const forgotPasswordTemplate=({name,otp})=>{
    return`
    <div>
    <p>Hi ${name},</p>
    <p>You have requested to reset your password. Please use the following OTP to reset your password:</p>
    <h2>${otp}</h2>
    <p>This otp is valid for 10 minutes only.</p>
    <p>Thanks!</p>
    <p>Team Blinkit</p>
    </div>
    `
}