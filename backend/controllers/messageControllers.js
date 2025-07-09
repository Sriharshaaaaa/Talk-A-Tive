const asyncHandler = require("express-async-handler");
const Message = require("../Models/messageModel");
const User = require("../Models/userModel");
const Chat = require("../Models/chatModel");
const extractMentions = require("../utils/mentions");
const sendEmail = require("../utils/sendEmail"); // Optional

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  let newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    // --- Mention Detection ---
    const mentionedNames = extractMentions(content); // e.g., ["John", "Jane"]
    if (mentionedNames.length > 0) {
      const mentionedUsers = await User.find({ name: { $in: mentionedNames } });

      for (const user of mentionedUsers) {
        // Emit socket event for mention
        req.app.get("io").to(user._id.toString()).emit("mentioned", {
          chatId,
          message,
        });

        // Email if user is offline
        const isOnline = req.app.get("onlineUsers")?.has(user._id.toString());
        if (!isOnline) {
          await sendEmail(
            user.email,
            "You were mentioned in a message",
            `@${user.name}, you were mentioned in chat: "${content}"`
          );
        }
      }
    }

    // --- Notify other chat users (non-mention based) ---
    for (const user of message.chat.users) {
      if (user._id.toString() !== req.user._id.toString()) {
        const isOnline = req.app.get("onlineUsers")?.has(user._id.toString());
        if (!isOnline) {
          await sendEmail(
            user.email,
            "New Message in Chat App",
            `You have a new message from ${req.user.name}: "${message.content}"`
          );
        }
      }
    }

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
