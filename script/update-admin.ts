import { storage } from "../server/storage";
import bcrypt from "bcryptjs";

async function updateAdmin() {
  // You can change these values or pass them as environment variables
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "000999";

  console.log(`Target admin username: ${username}`);

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    // Check if any admin exists
    const adminCount = await storage.getAdminCount();

    if (adminCount === 0) {
      console.log("No admin found. Creating new admin...");
      await storage.createAdmin({ username, passwordHash });
      console.log(`Admin created: ${username} / ${password}`);
    } else {
      // For simplicity, we update the first admin found or the one with the specified username
      const admin = await storage.getAdminByUsername(username);

      if (admin) {
        await storage.updateAdminPassword(username, passwordHash);
        console.log(`Updated password for existing admin: ${username}`);
      } else {
        // If the specified username doesn't exist, we could either rename the old one or create this one
        // Let's just create this one as a new admin option
        await storage.createAdmin({ username, passwordHash });
        console.log(
          `Created new admin user: ${username} (Old admin still exists)`,
        );
      }
    }

    console.log("\nSuccess! You can now login with:");
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
  } catch (error) {
    console.error("Error updating admin:", error);
    process.exit(1);
  }

  // Give some time for the database connection to close if needed,
  // but tsx usually handles this.
  setTimeout(() => process.exit(0), 1000);
}

updateAdmin();
