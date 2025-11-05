import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const ateliers = pgTable("ateliers", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, {
        onDelete: "cascade"
    }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    image: text("images").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
})

export type Atelier = typeof ateliers.$inferSelect