import { Server } from "http";
import mongoose from "mongoose";
import { App } from "./app";
import Config from "./app/Config";
let server: Server;

async function bootstrap() {
  try {
    await mongoose.connect(Config.database_url as string);
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
