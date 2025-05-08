import { Server } from "http";
import mongoose from "mongoose";
import { App } from "./app";
import Config from "./app/Config";
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
let server: Server;

async function main() {
  try {
    await mongoose.connect(Config.database_url as string);
    server = App.listen(Config.port, () => {
      console.log(`server running on port ${Config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}
main();
