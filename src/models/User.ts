import mongoose, { Schema, Document, Model } from "mongoose";

// تعريف إعدادات الإشعارات
interface INotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  newMessages: boolean;
  propertyAlerts: boolean;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  image?: string;
  phone?: string;
  role: "user" | "agent" | "admin";
  isActive: boolean;
  emailVerified?: Date;
  
  // === الحقول الإضافية لإصلاح أخطاء الـ Build السابقة ===
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  verificationToken?: string;
  favorites?: mongoose.Types.ObjectId[];
  notificationSettings?: INotificationSettings;
  
  // === الحقل الجديد لإصلاح الخطأ الحالي ===
  properties?: any[]; // نستخدم any[] لتجنب مشاكل استيراد موديل Property
  // ======================================

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "الاسم مطلوب"],
      trim: true,
      maxlength: [50, "الاسم يجب أن لا يتجاوز 50 حرف"],
    },
    email: {
      type: String,
      required: [true, "البريد الإلكتروني مطلوب"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: [6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"],
      select: false,
    },
    image: { type: String, default: null },
    phone: { type: String, default: null },
    role: {
      type: String,
      enum: ["user", "agent", "admin"],
      default: "user",
    },
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Date, default: null },
    
    // === الحقول المضافة سابقاً ===
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date },
    verificationToken: { type: String, select: false },
    favorites: [{ type: Schema.Types.ObjectId, ref: "Property", default: [] }],
    notificationSettings: {
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
      newMessages: { type: Boolean, default: true },
      propertyAlerts: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
    // تمكين الـ Virtuals عند تحويل البيانات إلى JSON أو Object
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// === تعريف العلاقة العكسية (Virtual) ===
// هذا يسمح بجلب عقارات المستخدم عند عمل populate('properties')
UserSchema.virtual('properties', {
  ref: 'Property',      // اسم موديل العقار
  localField: '_id',    // الحقل في موديل المستخدم
  foreignField: 'owner' // الحقل في موديل العقار الذي يشير للمالك
});

// منع إعادة تعريف الموديل
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;