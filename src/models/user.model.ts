import mongoose, { Schema } from "mongoose";
import { encrypt } from "../utils/encryption.ts";


export interface User {
    fullName: string;
    email: string;
    username: string;
    password: string;
    role: string;
    profilePicture: string;
    isActive: boolean;
    activationCode: string;
}

const userSchema = new mongoose.Schema<User>({
    fullName: {
        type: Schema.Types.String,
        required: true,
    },
    email: {
        type: Schema.Types.String,
        required: true,
        unique: true,
    },
    username: {
        type: Schema.Types.String,
        required: true,
        unique: true,
    },
    password: {
        type: Schema.Types.String,
        required: true,
    },
    role: {
        type: Schema.Types.String,
        enum: ["admin", "user"],
        default: "user",
    },
    profilePicture: {
        type: Schema.Types.String,
        default: "user.jpg",
    },
    isActive: {
        type: Schema.Types.Boolean,
        default: true,
    },
    activationCode: {
        type: Schema.Types.String,
        default: "",
    },
}, {
    timestamps: true,
    versionKey: false,
});

userSchema.pre("save", function (next) {
    const user = this;

    user.password = encrypt(user.password);

    next();
});

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
}

const UserModel = mongoose.model<User>("User", userSchema);

export default UserModel;
