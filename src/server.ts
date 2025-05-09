import { Server } from "http";
import mongoose from "mongoose";
import { App } from "./app";
import Config from "./app/Config";
let server: Server;

async function bootstrap() {
  try {
    await mongoose.connect(Config.database_url as string, {
      // Add connection options to prevent timeouts
      serverSelectionTimeoutMS: 30000, // Timeout after 30 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    console.log("🟢 Connected to MongoDB");

    server = App.listen(Config.port, () => {
      console.log(`🚀 Server running on port ${Config.port}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
  }
}

bootstrap();

export default App;
