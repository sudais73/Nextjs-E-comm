import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "nextjs e-comm" });

// inngest function to save user data to database//
// export const syncUserCreation = inngest.createFunction(
//     {
//         id:'sync-user-from-clerk'},
//     {event:'clerk/user.created'},
//     async({event})=>{
//        const { id, first_name, last_name, email_addresses, image_url } = event.data;

//         const userData = {
//             _id:id,
//             email:email_addresses[0].email_address,
//             name:firsr_name + ' ' + last_name,
//             imageUrl:image_url
//         }
//         await connectDB()
//         await User.create(userData)
//     }
// )

export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    console.log("Incoming Clerk event:", event.data);

    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id,
      email: email_addresses?.[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`.trim(),
      imageUrl: image_url,
    };

    try {
      await connectDB();
      await User.create(userData);
      console.log("✅ User saved to DB:", userData);
    } catch (err) {
      console.error("❌ Error saving user:", err);
    }
  }
);



// inngest function to update user data in database//

export const syncUserUpdation = inngest.createFunction(
    {id:'update-user-from-clerk'},
    {event:'clerk/user.updated'},
     async({event})=>{
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const userData = {
            _id:id,
            email:email_addresses[0].email_address,
            name:first_name + ' ' + last_name,
            imageUrl:image_url
        }
        await connectDB()
        await User.findByIdAndUpdate(id, userData)
    }

)

//inggest function to delete user from db//

export const syncUserDeletion = inngest.createFunction(
    {id:'delete-user-with-clerk'},
    {event:'clerk/user.deleted'},
     async({event})=>{
        const{id} = event.data
        
        await connectDB()
        await User.findByIdAndDelete(id)
    }

)