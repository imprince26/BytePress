import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

export const toolType = pgEnum("tool_type", [
  "image_compress",
  "image_convert",
  "image_resize",
  "pdf_merge",
  "pdf_split",
  "pdf_compress",
  "pdf_to_word",
  "word_to_pdf",
])

export const jobStatus = pgEnum("job_status", [
  "queued",
  "processing",
  "completed",
  "failed",
  "expired",
])

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: text("role").notNull().default("user"),
  dailyLimit: integer("daily_limit"),
  historyMode: text("history_mode").notNull().default("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_user_id_idx").on(table.userId)]
)

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("account_user_id_idx").on(table.userId)]
)

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const usageEvent = pgTable(
  "usage_event",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    anonymousId: text("anonymous_id"),
    tool: toolType("tool").notNull(),
    inputBytes: integer("input_bytes"),
    outputBytes: integer("output_bytes"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("usage_event_user_created_idx").on(table.userId, table.createdAt),
    index("usage_event_anonymous_created_idx").on(
      table.anonymousId,
      table.createdAt
    ),
  ]
)

export const fileJob = pgTable(
  "file_job",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    anonymousId: text("anonymous_id"),
    tool: toolType("tool").notNull(),
    status: jobStatus("status").notNull().default("queued"),
    inputBytes: integer("input_bytes"),
    outputBytes: integer("output_bytes"),
    error: text("error"),
    metadata: jsonb("metadata"),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("file_job_user_created_idx").on(table.userId, table.createdAt)]
)

export const toolLimit = pgTable("tool_limit", {
  id: text("id").primaryKey(),
  role: text("role").notNull(),
  tool: toolType("tool"),
  dailyLimit: integer("daily_limit").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
