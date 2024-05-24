
import Notification from "../../../DB/model/notification.js";
import userModel from "../../../DB/model/user.model.js";
import { sendEmail } from "../../services/email.js";

export const createNotification = async ({ title, content, userId }) => {
    
    console.log(userId)
    const user = await userModel.findById(userId);
    
    const notification = await Notification.create({ title, content, userId });
    const to = user.email;
    const subject = "إشعار جديد";
    const html = `<p>${content}</p>`;
    await sendEmail(to, subject, html);
   
 
};
