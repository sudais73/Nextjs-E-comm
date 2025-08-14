import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "nextjs-ecomm" });

/**
 * CREATE USER
 */
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    console.log("🔥 CREATE function triggered");
    console.log("📦 Incoming event data:", JSON.stringify(event.data, null, 2));

    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;

      const userData = {
        _id: id,
        email: email_addresses?.[0]?.email_address || null,
        name: `${first_name || ""} ${last_name || ""}`.trim(),
        imageUrl: image_url || null,
      };

      console.log("🔌 Connecting to MongoDB...");
      await connectDB();
      console.log("✅ MongoDB connected");

      const newUser = await User.create(userData);
      console.log("✅ User inserted into DB:", newUser);

      return { status: "success", action: "user_created", userId: id };
    } catch (err) {
      console.error("❌ Error creating user:", err);
      return { status: "error", message: err.message };
    }
  }
);

/**
 * UPDATE USER
 */
export const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    console.log("🔥 UPDATE function triggered");
    console.log("📦 Incoming event data:", JSON.stringify(event.data, null, 2));

    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;

      const userData = {
        email: email_addresses?.[0]?.email_address || null,
        name: `${first_name || ""} ${last_name || ""}`.trim(),
        imageUrl: image_url || null,
      };

      console.log("🔌 Connecting to MongoDB...");
      await connectDB();
      console.log("✅ MongoDB connected");

      const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });
      console.log("✅ User updated in DB:", updatedUser);

      return { status: "success", action: "user_updated", userId: id };
    } catch (err) {
      console.error("❌ Error updating user:", err);
      return { status: "error", message: err.message };
    }
  }
);

/**
 * DELETE USER
 */
export const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    console.log("🔥 DELETE function triggered");
    console.log("📦 Incoming event data:", JSON.stringify(event.data, null, 2));

    try {
      const { id } = event.data;

      console.log("🔌 Connecting to MongoDB...");
      await connectDB();
      console.log("✅ MongoDB connected");

      await User.findByIdAndDelete(id);
      console.log("✅ User deleted from DB:", id);

      return { status: "success", action: "user_deleted", userId: id };
    } catch (err) {
      console.error("❌ Error deleting user:", err);
      return { status: "error", message: err.message };
    }
  }
);
