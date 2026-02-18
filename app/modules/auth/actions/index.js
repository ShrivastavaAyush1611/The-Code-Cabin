"use server"

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export const onBoardUser = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, error: "No authenticated user found" };
    }
    // console.log(user)
    const { id, firstName, lastName, imageUrl, emailAddresses } = user;
    const userEmail = emailAddresses[0].emailAddress ;
    if (!userEmail) {
      console.error("❌ Onboarding failed: No email address found in Clerk.");
      return { success: false, error: "Email is required" };
    }
    const newUser = await db.user.upsert({
      where: { clerkId: id },
      update: {
        firstName: firstName || "", // Use empty string instead of null [cite: 2]
        lastName: lastName || "",   // Use empty string instead of null
        imageUrl: imageUrl || "",   // Use empty string instead of null [cite: 3]
        email: userEmail,
      },
      create: {
        clerkId: id,
        email: userEmail,           // Required field 
        firstName: firstName || "",
        lastName: lastName || "",
        imageUrl: imageUrl || "",
        role: "USER",               // Explicitly setting the default 
      },
    });
    return {
      success: true,
      user: newUser,
      messge: "User onboarded successuly",
    };
  } catch (error) {
    console.log("❌ Error onboarding user:", error);
    return {
      success: false,
      error: "Failed to Onboarded user",
    };
  }
};

export const currentUserRole = async () => {
  try {
    // 1. Ensure the user is onboarded first
    const onboardResult = await onBoardUser();
    
    // 2. If onboarding failed (no user logged in), return null
    if (!onboardResult.success) return null;

    // 3. Now fetch the role safely
    const userRole = await db.user.findUnique({
      where: { clerkId: onboardResult.user.clerkId },
      select: { role: true },
    });
    
    return userRole?.role || null;
  } catch (error) {
    console.log("❌ Error fetching current user role:", error);
    return null;
  }
};

export const getCurrentUser = async()=>{
  const user = await currentUser()
   const dbUser = await db.user.findUnique({
      where:{
        clerkId:user.id
      },
      select:{
        id:true
      }
   })

   return dbUser;
}
