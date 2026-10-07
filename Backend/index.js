// ======================================================
// index.js
// ======================================================

import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

dotenv.config({
  path: fileURLToPath(new URL("./.env", import.meta.url)),
});

// ✅ Fixed: corrected typo'd Vercel URL (was missing the trailing "8")
// ✅ Also using a regex fallback so any future Vercel preview URL
//    for this project still works without editing this file every deploy.
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://hackhathon-omega.vercel.app",
  "https://hackhathon-git-main-raj-singhs-projects-fd8d0c78.vercel.app",
  "https://adminhackathon.vercel.app"

];

// Matches any preview deployment like:
// https://hackhathon-git-<branch>-raj-singhs-projects-<hash>.vercel.app
const vercelPreviewRegex = /^https:\/\/hackhathon-[a-z0-9-]+\.vercel\.app$/;

async function startServer() {
  const { default: connectDB } = await import("./Database/db.js");
  await connectDB();

  const [
    { default: express },
    { default: cors },
    { default: authRoutes },
    { default: bookingRoutes },
    { default: aadhaarRoutes },
    { default: procurementRoutes },
    { default: chatRoutes },
  ] = await Promise.all([
    import("express"),
    import("cors"),
    import("./Routes/user.routes.js"),
    import("./Routes/booking.routes.js"),
    import("./Routes/Addhar.routes.js"),
    import("./Routes/procument.routes.js"),
    import("./Routes/chat.route.js"),
  ]);

  const app = express();

  app.use(
    cors({
      origin: (origin, callback) => {
        if (
          !origin ||
          allowedOrigins.includes(origin) ||
          vercelPreviewRegex.test(origin)
        ) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );

  app.use(express.json());

  app.use("/api/auth", authRoutes);
  app.use("/api/bookings", bookingRoutes);
  app.use("/api/aadhaar", aadhaarRoutes);
  app.use("/api/procurement", procurementRoutes);
  app.use("/api/chats", chatRoutes);

  app.get("/", (req, res) => {
    res.json({
      success: true,
      message: "Farmer AI Backend Running",
    });
  });

  const PORT = process.env.PORT || 3000;
  await new Promise((resolve, reject) => {
    const server = app.listen(PORT);
    server.once("error", reject);
    server.once("listening", () => {
      console.log(`Server running on http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

try {
  await startServer();
} catch (error) {
  console.error(`Backend startup failed: ${error.message}`);
  process.exitCode = 1;
}
