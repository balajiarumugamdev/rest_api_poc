import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false},
    }
})

export const UserModel = mongoose.model('User', UserSchema);

// Actions
export const getUsers = () => UserModel.find();
export const getUsersByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({
    'authentication.sessionToken': sessionToken,
});
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) => new UserModel(values).save()
    .then((user) => user.toObject());
// here a new document is created from UserModel. save() method returns a promise
export const deleteUserById = (id: string) => UserModel.findByIdAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate({
    id, values
})
