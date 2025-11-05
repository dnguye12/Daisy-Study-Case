import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { ateliers } from "./ateliers";

export const creneaux = pgTable("creanaux", {
    id: uuid("id").primaryKey().defaultRandom(),
    atelierId: uuid("atelier_id").references(() => ateliers.id, {
        onDelete: "cascade"
    }),
    title: text("title"),
    capacity: integer("capacity").notNull(),
    price: integer("price").notNull(),

    startAt: timestamp("start_at").notNull(),
    endAt: timestamp("end_at").notNull(),

    rrule: text("rrule"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
})

export const creneauxExdates = pgTable("creneaux_exdates", {
    id: uuid("id").primaryKey().defaultRandom(),
    creneauId: uuid("creneau_id").references(() => creneaux.id, {onDelete: "cascade"}).notNull(),
    exdate: timestamp("exdate").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type Creanau = typeof creneaux.$inferSelect