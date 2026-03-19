import { pgTable, text, timestamp, uuid, varchar, decimal, jsonb, date, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Organizations (Healthcare institutions - hospitals, care homes)
export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  kvkNumber: varchar('kvk_number', { length: 20 }),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  postalCode: varchar('postal_code', { length: 10 }),
  contactEmail: varchar('contact_email', { length: 255 }).notNull(),
  contactPhone: varchar('contact_phone', { length: 20 }),
  settings: jsonb('settings').$type<{
    defaultOrtRates?: {
      evening: number;
      night: number;
      weekend: number;
      holiday: number;
    };
  }>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Agencies (Staffing agencies - uitzendbureaus)
export const agencies = pgTable('agencies', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  kvkNumber: varchar('kvk_number', { length: 20 }),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  postalCode: varchar('postal_code', { length: 10 }),
  contactEmail: varchar('contact_email', { length: 255 }).notNull(),
  contactPhone: varchar('contact_phone', { length: 20 }),
  settings: jsonb('settings'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Users (linked to Clerk)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: varchar('clerk_id', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  role: varchar('role', { length: 20 }).notNull().$type<'admin' | 'org_user' | 'agency_user'>(),
  organizationId: uuid('organization_id').references(() => organizations.id),
  agencyId: uuid('agency_id').references(() => agencies.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Candidates (Agency's candidate pool)
export const candidates = pgTable('candidates', {
  id: uuid('id').primaryKey().defaultRandom(),
  agencyId: uuid('agency_id').references(() => agencies.id).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  function: varchar('function', { length: 100 }).notNull(), // e.g., "Verpleegkundige", "Verzorgende IG"
  bigNumber: varchar('big_number', { length: 50 }), // BIG registration number
  qualifications: jsonb('qualifications').$type<string[]>(),
  cvUrl: text('cv_url'),
  notes: text('notes'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Requests (Staffing requests from organizations)
export const requests = pgTable('requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  createdBy: uuid('created_by').references(() => users.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  functionRequired: varchar('function_required', { length: 100 }).notNull(),
  department: varchar('department', { length: 100 }),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  hoursPerWeek: integer('hours_per_week').notNull(),
  specialRequirements: text('special_requirements'),
  status: varchar('status', { length: 20 }).notNull().$type<'open' | 'in_review' | 'filled' | 'cancelled'>().default('open'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  broadcastAt: timestamp('broadcast_at'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Submissions (Agency responses to requests)
export const submissions = pgTable('submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  requestId: uuid('request_id').references(() => requests.id).notNull(),
  agencyId: uuid('agency_id').references(() => agencies.id).notNull(),
  candidateId: uuid('candidate_id').references(() => candidates.id).notNull(),
  proposedRate: decimal('proposed_rate', { precision: 10, scale: 2 }).notNull(), // Hourly rate
  cvUrl: text('cv_url'), // Can override candidate's default CV
  notes: text('notes'),
  additionalInfo: text('additional_info'),
  status: varchar('status', { length: 20 }).notNull().$type<'pending' | 'accepted' | 'rejected' | 'withdrawn'>().default('pending'),
  rejectionReason: text('rejection_reason'), // Reason shown to agency when auto-rejected (e.g., "Betere match gevonden")
  meetingAvailability: text('meeting_availability'), // Org's suggested meeting times for kennismakingsgesprek (set on acceptance)
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Order Confirmations (Formal agreements)
export const orderConfirmations = pgTable('order_confirmations', {
  id: uuid('id').primaryKey().defaultRandom(),
  requestId: uuid('request_id').references(() => requests.id).notNull(),
  submissionId: uuid('submission_id').references(() => submissions.id).notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  agencyId: uuid('agency_id').references(() => agencies.id).notNull(),
  candidateId: uuid('candidate_id').references(() => candidates.id).notNull(),
  agreedRate: decimal('agreed_rate', { precision: 10, scale: 2 }).notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  terms: jsonb('terms'),
  pdfUrl: text('pdf_url'),
  signedAt: timestamp('signed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Hour Registrations
export const hourRegistrations = pgTable('hour_registrations', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderConfirmationId: uuid('order_confirmation_id').references(() => orderConfirmations.id).notNull(),
  date: date('date').notNull(),
  regularHours: decimal('regular_hours', { precision: 5, scale: 2 }).notNull().default('0'),
  ortEvening: decimal('ort_evening', { precision: 5, scale: 2 }).notNull().default('0'), // Hours 18:00-22:00
  ortNight: decimal('ort_night', { precision: 5, scale: 2 }).notNull().default('0'), // Hours 22:00-06:00
  ortWeekend: decimal('ort_weekend', { precision: 5, scale: 2 }).notNull().default('0'),
  ortHoliday: decimal('ort_holiday', { precision: 5, scale: 2 }).notNull().default('0'),
  notes: text('notes'),
  submittedBy: uuid('submitted_by').references(() => users.id).notNull(),
  status: varchar('status', { length: 20 }).notNull().$type<'pending' | 'approved' | 'disputed'>().default('pending'),
  approvedBy: uuid('approved_by').references(() => users.id),
  approvedAt: timestamp('approved_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Invoices
export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  invoiceNumber: varchar('invoice_number', { length: 50 }).notNull().unique(),
  orderConfirmationId: uuid('order_confirmation_id').references(() => orderConfirmations.id).notNull(),
  agencyId: uuid('agency_id').references(() => agencies.id).notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  periodStart: date('period_start').notNull(),
  periodEnd: date('period_end').notNull(),
  lineItems: jsonb('line_items').$type<{
    description: string;
    hours: number;
    rate: number;
    ortType?: 'evening' | 'night' | 'weekend' | 'holiday';
    ortMultiplier?: number;
    amount: number;
  }[]>().notNull(),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  ortTotal: decimal('ort_total', { precision: 10, scale: 2 }).notNull().default('0'),
  vatAmount: decimal('vat_amount', { precision: 10, scale: 2 }).notNull().default('0'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  pdfUrl: text('pdf_url'),
  status: varchar('status', { length: 20 }).notNull().$type<'draft' | 'sent' | 'paid'>().default('draft'),
  dueDate: date('due_date').notNull(),
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ORT Settings (Default rates, can be overridden per organization)
export const ortSettings = pgTable('ort_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id), // null = system default
  eveningRate: decimal('evening_rate', { precision: 4, scale: 2 }).notNull().default('1.22'), // 22% toeslag
  nightRate: decimal('night_rate', { precision: 4, scale: 2 }).notNull().default('1.40'), // 40% toeslag
  weekendRate: decimal('weekend_rate', { precision: 4, scale: 2 }).notNull().default('1.35'), // 35% toeslag
  holidayRate: decimal('holiday_rate', { precision: 4, scale: 2 }).notNull().default('2.00'), // 100% toeslag
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Messages (In-app communication)
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  requestId: uuid('request_id').references(() => requests.id),
  submissionId: uuid('submission_id').references(() => submissions.id),
  senderId: uuid('sender_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  requests: many(requests),
  orderConfirmations: many(orderConfirmations),
  invoices: many(invoices),
}));

export const agenciesRelations = relations(agencies, ({ many }) => ({
  users: many(users),
  candidates: many(candidates),
  submissions: many(submissions),
  orderConfirmations: many(orderConfirmations),
  invoices: many(invoices),
}));

export const usersRelations = relations(users, ({ one }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
  agency: one(agencies, {
    fields: [users.agencyId],
    references: [agencies.id],
  }),
}));

export const candidatesRelations = relations(candidates, ({ one, many }) => ({
  agency: one(agencies, {
    fields: [candidates.agencyId],
    references: [agencies.id],
  }),
  submissions: many(submissions),
}));

export const requestsRelations = relations(requests, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [requests.organizationId],
    references: [organizations.id],
  }),
  createdByUser: one(users, {
    fields: [requests.createdBy],
    references: [users.id],
  }),
  submissions: many(submissions),
  orderConfirmations: many(orderConfirmations),
}));

export const submissionsRelations = relations(submissions, ({ one }) => ({
  request: one(requests, {
    fields: [submissions.requestId],
    references: [requests.id],
  }),
  agency: one(agencies, {
    fields: [submissions.agencyId],
    references: [agencies.id],
  }),
  candidate: one(candidates, {
    fields: [submissions.candidateId],
    references: [candidates.id],
  }),
}));

export const orderConfirmationsRelations = relations(orderConfirmations, ({ one, many }) => ({
  request: one(requests, {
    fields: [orderConfirmations.requestId],
    references: [requests.id],
  }),
  submission: one(submissions, {
    fields: [orderConfirmations.submissionId],
    references: [submissions.id],
  }),
  organization: one(organizations, {
    fields: [orderConfirmations.organizationId],
    references: [organizations.id],
  }),
  agency: one(agencies, {
    fields: [orderConfirmations.agencyId],
    references: [agencies.id],
  }),
  candidate: one(candidates, {
    fields: [orderConfirmations.candidateId],
    references: [candidates.id],
  }),
  hourRegistrations: many(hourRegistrations),
  invoices: many(invoices),
}));

export const hourRegistrationsRelations = relations(hourRegistrations, ({ one }) => ({
  orderConfirmation: one(orderConfirmations, {
    fields: [hourRegistrations.orderConfirmationId],
    references: [orderConfirmations.id],
  }),
  submittedByUser: one(users, {
    fields: [hourRegistrations.submittedBy],
    references: [users.id],
    relationName: 'submittedBy',
  }),
  approvedByUser: one(users, {
    fields: [hourRegistrations.approvedBy],
    references: [users.id],
    relationName: 'approvedBy',
  }),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  orderConfirmation: one(orderConfirmations, {
    fields: [invoices.orderConfirmationId],
    references: [orderConfirmations.id],
  }),
  agency: one(agencies, {
    fields: [invoices.agencyId],
    references: [agencies.id],
  }),
  organization: one(organizations, {
    fields: [invoices.organizationId],
    references: [organizations.id],
  }),
}));

// Type exports
export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
export type Agency = typeof agencies.$inferSelect;
export type NewAgency = typeof agencies.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Candidate = typeof candidates.$inferSelect;
export type NewCandidate = typeof candidates.$inferInsert;
export type Request = typeof requests.$inferSelect;
export type NewRequest = typeof requests.$inferInsert;
export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
export type OrderConfirmation = typeof orderConfirmations.$inferSelect;
export type NewOrderConfirmation = typeof orderConfirmations.$inferInsert;
export type HourRegistration = typeof hourRegistrations.$inferSelect;
export type NewHourRegistration = typeof hourRegistrations.$inferInsert;
export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
export type OrtSettings = typeof ortSettings.$inferSelect;
export type Message = typeof messages.$inferSelect;
