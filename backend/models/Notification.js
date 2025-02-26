const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationSchema = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Info', 'Warning', 'Success', 'Error'],
    default: 'Info'
  },
  isRead: { type: Boolean, default: false },
  relatedProject: { 
    type: Schema.Types.ObjectId, 
    ref: 'Project' 
  },
  relatedSample: { 
    type: Schema.Types.ObjectId, 
    ref: 'Sample' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);