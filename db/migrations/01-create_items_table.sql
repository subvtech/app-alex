
CREATE TYPE "public"."type" AS ENUM('email_confirmation', 'reset_password');
--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('standart', 'in_charge');
--> statement-breakpoint
CREATE TYPE "public"."frequency" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'everyday', 'none');
--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('published', 'draft', 'finished');
--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('youtube', 'vimeo', 'image', 'video', 'file');
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounts" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "accounts_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "classes" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"learning_plan_id" text,
	"in_charge_member_id" text,
	"created_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "institutions" (
	"id" text PRIMARY KEY NOT NULL,
	"cnpj" text NOT NULL,
	"name" text NOT NULL,
	"social_name" text NOT NULL,
	"acronym" text NOT NULL,
	"sector" text NOT NULL,
	"cover_image_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_to_institution" (
	"user_id" text NOT NULL,
	"intitution_id" text NOT NULL,
	CONSTRAINT "user_to_institution_user_id_intitution_id_pk" PRIMARY KEY("user_id","intitution_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invitation_links" (
	"id" text PRIMARY KEY NOT NULL,
	"learning_plan_id" text,
	"class_id" text,
	"role" "role",
	"emails_to_send" text,
	"hash" text,
	"expires_at" timestamp,
	"is_expired" boolean,
	"created_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "learning_goal_verbs" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"learning_goal_id" text,
	"descripton" text,
	"general" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "learning_goal" (
	"id" text PRIMARY KEY NOT NULL,
	"verb_id" text NOT NULL,
	"learning_plan_id" text NOT NULL,
	"learning_goal_verb_id" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "learning_plan_events" (
	"id" text PRIMARY KEY NOT NULL,
	"learning_plan_member" text,
	"message" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "learning_plan_group_members" (
	"id" text PRIMARY KEY NOT NULL,
	"group_id" text NOT NULL,
	"student_member_id" text NOT NULL,
	"role" "role" NOT NULL,
	"created_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "learning_plan_groups" (
	"id" text PRIMARY KEY NOT NULL,
	"class_id" text NOT NULL,
	"learning_plan_id" text NOT NULL,
	"title" text,
	"image_id" text,
	"created_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "learning_plan_medias" (
	"learning_plan_id" text NOT NULL,
	"media_id" text NOT NULL,
	"created_at" timestamp,
	CONSTRAINT "learning_plan_medias_learning_plan_id_media_id_pk" PRIMARY KEY("learning_plan_id","media_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "learning_plan_meeting_schedule" (
	"id" text PRIMARY KEY NOT NULL,
	"learning_plan_id" text,
	"class_id" text,
	"frequency" "frequency",
	"start_date" timestamp,
	"end_date" timestamp,
	"name" text,
	"interval" integer,
	"type" "type",
	"location" text,
	"link" text,
	"created_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "learning_plan_meeting" (
	"id" text PRIMARY KEY NOT NULL,
	"meeting_schedule_id" text,
	"is_expired" boolean,
	"date" timestamp,
	"created_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "learning_plan_members_to_trails" (
	"partner_trail" text NOT NULL,
	"partner" text NOT NULL,
	CONSTRAINT "learning_plan_members_to_trails_partner_trail_partner_pk" PRIMARY KEY("partner_trail","partner")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "learning_plan_members" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"learning_plan_id" text NOT NULL,
	"email" text,
	"joined_at" timestamp,
	"role" "role",
	"status" "status",
	"created_at" timestamp,
	"class_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "learning_plan_structures" (
	"id" text PRIMARY KEY NOT NULL,
	"learning_plan_id" text NOT NULL,
	"member_id" text,
	"title" text,
	"name" "type",
	"created_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "learning_plans" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"start_date" date,
	"end_date" date,
	"archived_at" timestamp,
	"type" "type",
	"cover_image" text,
	"slug" text,
	"class_name" text,
	"invite_enabled" boolean,
	"invitation_duration" integer,
	"hidden" boolean,
	"details" text,
	"message" text,
	"cover_image_id" text,
	"created_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "medias" (
	"id" text PRIMARY KEY NOT NULL,
	"filename" text,
	"title" text,
	"size" integer,
	"hash" text,
	"ext" text,
	"url" text,
	"media_type" "media_type",
	"external" boolean,
	"created_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags" (
	"id" text PRIMARY KEY NOT NULL,
	"learning_plan_id" text NOT NULL,
	"text" text,
	"is_public" boolean,
	"is_general" boolean,
	"verified" boolean,
	"verified_date" timestamp,
	"verified_by" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags_to_learning_plans" (
	"tag_id" text NOT NULL,
	"learning_plan_id" text NOT NULL,
	CONSTRAINT "tags_to_learning_plans_tag_id_learning_plan_id_pk" PRIMARY KEY("tag_id","learning_plan_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags_to_users" (
	"tag_id" text NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "tags_to_users_tag_id_user_id_pk" PRIMARY KEY("tag_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "task_events" (
	"id" text PRIMARY KEY NOT NULL,
	"task_id" text,
	"task_member_id" text,
	"status" "status",
	"created_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "task_submission" (
	"id" text PRIMARY KEY NOT NULL,
	"task_member_id" text NOT NULL,
	"submission" text,
	"justification" text,
	"grade" real,
	"submitted_at" timestamp,
	"evaluated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "task_members_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"learning_plan_member_id" text,
	"task_member_id" text,
	"task_submission_id" text,
	"sent_at" timestamp,
	"message" text,
	"audio_id" text,
	"response_to_message" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "task_members_students" (
	"id" text PRIMARY KEY NOT NULL,
	"task_member_id" text,
	"role" "role"
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "task_members" (
	"id" text PRIMARY KEY NOT NULL,
	"learning_plan_member_id" text,
	"status" "type",
	"can_submit_after_deadLine" boolean,
	"start_at" timestamp,
	"finish_at" timestamp,
	"last_submition_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tasks" (
	"id" text PRIMARY KEY NOT NULL,
	"trail_id" text NOT NULL,
	"learning_plan_id" text NOT NULL,
	"task_member_id" text NOT NULL,
	"position" integer,
	"tile" text,
	"description" text,
	"type" "type",
	"status" "status",
	"submition_required" boolean,
	"start_at" timestamp,
	"finish_at" timestamp,
	"archived_at" timestamp,
	"can_submit_after_deadLine" boolean,
	"allowed_editor_pluginJs" text,
	"submition_description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tasks_to_learning_goals" (
	"task_id" text NOT NULL,
	"learning_goal_id" text NOT NULL,
	CONSTRAINT "tasks_to_learning_goals_task_id_learning_goal_id_pk" PRIMARY KEY("task_id","learning_goal_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tasks_to_tags" (
	"task_id" text NOT NULL,
	"group_id" text NOT NULL,
	CONSTRAINT "tasks_to_tags_task_id_group_id_pk" PRIMARY KEY("task_id","group_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trail_content" (
	"id" text PRIMARY KEY NOT NULL,
	"trail_id" text NOT NULL,
	"time" integer,
	"version" text,
	"blocks" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trail_contribution" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text,
	"blocked" boolean,
	"contribution" text,
	"highlighted" boolean,
	"highlighted_order" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trails" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text,
	"hidden" boolean,
	"order" integer,
	"description" text,
	"cover_image_id" text,
	"created_at" timestamp,
	"learning_structure_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"cpf" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"image" text,
	"emailVerified" timestamp,
	"avatar_id" text,
	"cover_id" text,
	"username" text,
	"password" text,
	"phone" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification_token" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"type" "type" NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint

 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

 

--> statement-breakpoint

 ALTER TABLE "classes" ADD CONSTRAINT "classes_learning_plan_id_learning_plans_id_fk" FOREIGN KEY ("learning_plan_id") REFERENCES "public"."learning_plans"("id") ON DELETE no action ON UPDATE no action;

 

--> statement-breakpoint

 ALTER TABLE "institutions" ADD CONSTRAINT "institutions_cover_image_id_medias_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."medias"("id") ON DELETE no action ON UPDATE no action;

 

--> statement-breakpoint

 ALTER TABLE "user_to_institution" ADD CONSTRAINT "user_to_institution_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;

 

--> statement-breakpoint

 ALTER TABLE "user_to_institution" ADD CONSTRAINT "user_to_institution_intitution_id_institutions_id_fk" FOREIGN KEY ("intitution_id") REFERENCES "public"."institutions"("id") ON DELETE no action ON UPDATE no action;

 

--> statement-breakpoint

 ALTER TABLE "invitation_links" ADD CONSTRAINT "invitation_links_learning_plan_id_learning_plans_id_fk" FOREIGN KEY ("learning_plan_id") REFERENCES "public"."learning_plans"("id") ON DELETE no action ON UPDATE no action;

 

--> statement-breakpoint

 ALTER TABLE "invitation_links" ADD CONSTRAINT "invitation_links_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;

 

--> statement-breakpoint

 ALTER TABLE "learning_goal_verbs" ADD CONSTRAINT "learning_goal_verbs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;

 

--> statement-breakpoint

 ALTER TABLE "learning_goal" ADD CONSTRAINT "learning_goal_verb_id_learning_goal_verbs_id_fk" FOREIGN KEY ("verb_id") REFERENCES "public"."learning_goal_verbs"("id") ON DELETE no action ON UPDATE no action;

 

--> statement-breakpoint

 ALTER TABLE "learning_goal" ADD CONSTRAINT "learning_goal_learning_plan_id_learning_plans_id_fk" FOREIGN KEY ("learning_plan_id") REFERENCES "public"."learning_plans"("id") ON DELETE no action ON UPDATE no action;

 

--> statement-breakpoint

 ALTER TABLE "learning_goal" ADD CONSTRAINT "learning_goal_learning_goal_verb_id_learning_goal_verbs_id_fk" FOREIGN KEY ("learning_goal_verb_id") REFERENCES "public"."learning_goal_verbs"("id") ON DELETE no action ON UPDATE no action;

 

--> statement-breakpoint

 ALTER TABLE "learning_plan_events" ADD CONSTRAINT "learning_plan_events_learning_plan_member_learning_plan_members_id_fk" FOREIGN KEY ("learning_plan_member") REFERENCES "public"."learning_plan_members"("id") ON DELETE no action ON UPDATE no action;

 

--> statement-breakpoint

 ALTER TABLE "learning_plan_group_members" ADD CONSTRAINT "learning_plan_group_members_group_id_learning_plan_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."learning_plan_groups"("id") ON DELETE no action ON UPDATE no action;

 

--> statement-breakpoint

 ALTER TABLE "learning_plan_group_members" ADD CONSTRAINT "learning_plan_group_members_student_member_id_learning_plan_members_id_fk" FOREIGN KEY ("student_member_id") REFERENCES "public"."learning_plan_members"("id") ON DELETE no action ON UPDATE no action;

 

--> statement-breakpoint

 ALTER TABLE "learning_plan_groups" ADD CONSTRAINT "learning_plan_groups_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;

 

--> statement-breakpoint

 ALTER TABLE "learning_plan_groups" ADD CONSTRAINT "learning_plan_groups_learning_plan_id_learning_plans_id_fk" FOREIGN KEY ("learning_plan_id") REFERENCES "public"."learning_plans"("id") ON DELETE no action ON UPDATE no action;

 

--> statement-breakpoint

 ALTER TABLE "learning_plan_groups" ADD CONSTRAINT "learning_plan_groups_image_id_medias_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."medias"("id") ON DELETE no action ON UPDATE no action;

 

--> statement-breakpoint

 ALTER TABLE "learning_plan_medias" ADD CONSTRAINT "learning_plan_medias_learning_plan_id_learning_plans_id_fk" FOREIGN KEY ("learning_plan_id") REFERENCES "public"."learning_plans"("id") ON DELETE no action ON UPDATE no action;

 

--> statement-breakpoint

 ALTER TABLE "learning_plan_medias" ADD CONSTRAINT "learning_plan_medias_media_id_medias_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."medias"("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint

 ALTER TABLE "learning_plan_meeting_schedule" ADD CONSTRAINT "learning_plan_meeting_schedule_learning_plan_id_learning_plans_id_fk" FOREIGN KEY ("learning_plan_id") REFERENCES "public"."learning_plans"("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint

 ALTER TABLE "learning_plan_meeting_schedule" ADD CONSTRAINT "learning_plan_meeting_schedule_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint

 ALTER TABLE "learning_plan_meeting" ADD CONSTRAINT "learning_plan_meeting_meeting_schedule_id_learning_plan_meeting_schedule_id_fk" FOREIGN KEY ("meeting_schedule_id") REFERENCES "public"."learning_plan_meeting_schedule"("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint

 ALTER TABLE "learning_plan_members_to_trails" ADD CONSTRAINT "learning_plan_members_to_trails_partner_trail_learning_plan_members_id_fk" FOREIGN KEY ("partner_trail") REFERENCES "public"."learning_plan_members"("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint

 ALTER TABLE "learning_plan_members_to_trails" ADD CONSTRAINT "learning_plan_members_to_trails_partner_trails_id_fk" FOREIGN KEY ("partner") REFERENCES "public"."trails"("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint

 ALTER TABLE "learning_plan_members" ADD CONSTRAINT "learning_plan_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint

 ALTER TABLE "learning_plan_members" ADD CONSTRAINT "learning_plan_members_learning_plan_id_learning_plans_id_fk" FOREIGN KEY ("learning_plan_id") REFERENCES "public"."learning_plans"("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint

 ALTER TABLE "learning_plan_members" ADD CONSTRAINT "learning_plan_members_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint

 ALTER TABLE "learning_plan_structures" ADD CONSTRAINT "learning_plan_structures_learning_plan_id_learning_plans_id_fk" FOREIGN KEY ("learning_plan_id") REFERENCES "public"."learning_plans"("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint

 ALTER TABLE "learning_plan_structures" ADD CONSTRAINT "learning_plan_structures_member_id_learning_plan_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."learning_plan_members"("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint

 ALTER TABLE "learning_plans" ADD CONSTRAINT "learning_plans_cover_image_id_medias_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."medias"("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint

 ALTER TABLE "tags" ADD CONSTRAINT "tags_learning_plan_id_learning_plans_id_fk" FOREIGN KEY ("learning_plan_id") REFERENCES "public"."learning_plans"("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint

 ALTER TABLE "tags_to_learning_plans" ADD CONSTRAINT "tags_to_learning_plans_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint

 ALTER TABLE "tags_to_learning_plans" ADD CONSTRAINT "tags_to_learning_plans_learning_plan_id_learning_plans_id_fk" FOREIGN KEY ("learning_plan_id") REFERENCES "public"."learning_plans"("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint

 ALTER TABLE "tags_to_users" ADD CONSTRAINT "tags_to_users_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint

 ALTER TABLE "tags_to_users" ADD CONSTRAINT "tags_to_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint

 ALTER TABLE "task_events" ADD CONSTRAINT "task_events_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint

 ALTER TABLE "task_events" ADD CONSTRAINT "task_events_task_member_id_task_members_id_fk" FOREIGN KEY ("task_member_id") REFERENCES "public"."task_members"("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint

 ALTER TABLE "task_submission" ADD CONSTRAINT "task_submission_task_member_id_task_members_id_fk" FOREIGN KEY ("task_member_id") REFERENCES "public"."task_members"("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint

 ALTER TABLE "task_members_messages" ADD CONSTRAINT "task_members_messages_learning_plan_member_id_learning_plan_members_id_fk" FOREIGN KEY ("learning_plan_member_id") REFERENCES "public"."learning_plan_members"("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint

 ALTER TABLE "task_members_messages" ADD CONSTRAINT "task_members_messages_task_member_id_task_members_id_fk" FOREIGN KEY ("task_member_id") REFERENCES "public"."task_members"("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint

 ALTER TABLE "task_members_messages" ADD CONSTRAINT "task_members_messages_task_submission_id_task_submission_id_fk" FOREIGN KEY ("task_submission_id") REFERENCES "public"."task_submission"("id") ON DELETE no action ON UPDATE no action;
 
--> statement-breakpoint

 ALTER TABLE "task_members_students" ADD CONSTRAINT "task_members_students_task_member_id_task_members_id_fk" FOREIGN KEY ("task_member_id") REFERENCES "public"."task_members"("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint

 ALTER TABLE "task_members" ADD CONSTRAINT "task_members_learning_plan_member_id_learning_plan_members_id_fk" FOREIGN KEY ("learning_plan_member_id") REFERENCES "public"."learning_plan_members"("id") ON DELETE no action ON UPDATE no action;



--> statement-breakpoint

 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_trail_id_trails_id_fk" FOREIGN KEY ("trail_id") REFERENCES "public"."trails"("id") ON DELETE no action ON UPDATE no action;

 

--> statement-breakpoint

 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_learning_plan_id_learning_plans_id_fk" FOREIGN KEY ("learning_plan_id") REFERENCES "public"."learning_plans"("id") ON DELETE no action ON UPDATE no action;

 

--> statement-breakpoint

 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_task_member_id_task_members_id_fk" FOREIGN KEY ("task_member_id") REFERENCES "public"."task_members"("id") ON DELETE no action ON UPDATE no action;

 

--> statement-breakpoint

 ALTER TABLE "tasks_to_learning_goals" ADD CONSTRAINT "tasks_to_learning_goals_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;

 

--> statement-breakpoint

 ALTER TABLE "tasks_to_learning_goals" ADD CONSTRAINT "tasks_to_learning_goals_learning_goal_id_learning_goal_id_fk" FOREIGN KEY ("learning_goal_id") REFERENCES "public"."learning_goal"("id") ON DELETE no action ON UPDATE no action;

 

--> statement-breakpoint

 ALTER TABLE "tasks_to_tags" ADD CONSTRAINT "tasks_to_tags_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;

 

--> statement-breakpoint

 ALTER TABLE "tasks_to_tags" ADD CONSTRAINT "tasks_to_tags_group_id_tags_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;

 

--> statement-breakpoint

 ALTER TABLE "trail_content" ADD CONSTRAINT "trail_content_trail_id_trails_id_fk" FOREIGN KEY ("trail_id") REFERENCES "public"."trails"("id") ON DELETE no action ON UPDATE no action;

 

--> statement-breakpoint

 ALTER TABLE "trail_contribution" ADD CONSTRAINT "trail_contribution_id_learning_plan_members_id_fk" FOREIGN KEY ("id") REFERENCES "public"."learning_plan_members"("id") ON DELETE no action ON UPDATE no action;

 

--> statement-breakpoint

 ALTER TABLE "trail_contribution" ADD CONSTRAINT "trail_contribution_id_trails_id_fk" FOREIGN KEY ("id") REFERENCES "public"."trails"("id") ON DELETE no action ON UPDATE no action;

 

--> statement-breakpoint

 ALTER TABLE "trails" ADD CONSTRAINT "trails_cover_image_id_medias_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."medias"("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint

 ALTER TABLE "trails" ADD CONSTRAINT "trails_learning_structure_id_learning_plan_structures_id_fk" FOREIGN KEY ("learning_structure_id") REFERENCES "public"."learning_plan_structures"("id") ON DELETE no action ON UPDATE no action;


ALTER TABLE accounts ENABLE ELECTRIC;
ALTER TABLE classes ENABLE ELECTRIC;
ALTER TABLE institutions ENABLE ELECTRIC;
ALTER TABLE user_to_institution ENABLE ELECTRIC;
ALTER TABLE invitation_links ENABLE ELECTRIC;
ALTER TABLE learning_goal_verbs ENABLE ELECTRIC;
ALTER TABLE learning_goal ENABLE ELECTRIC;
ALTER TABLE learning_plan_events ENABLE ELECTRIC;
ALTER TABLE learning_plan_group_members ENABLE ELECTRIC;
ALTER TABLE learning_plan_groups ENABLE ELECTRIC;
ALTER TABLE learning_plan_medias ENABLE ELECTRIC;
ALTER TABLE learning_plan_meeting_schedule ENABLE ELECTRIC;
ALTER TABLE learning_plan_meeting ENABLE ELECTRIC;
ALTER TABLE learning_plan_members_to_trails ENABLE ELECTRIC;
ALTER TABLE learning_plan_members ENABLE ELECTRIC;
ALTER TABLE learning_plan_structures ENABLE ELECTRIC;
ALTER TABLE learning_plans ENABLE ELECTRIC;
ALTER TABLE medias ENABLE ELECTRIC;
ALTER TABLE tags ENABLE ELECTRIC;
ALTER TABLE tags_to_learning_plans ENABLE ELECTRIC;
ALTER TABLE tags_to_users ENABLE ELECTRIC;
ALTER TABLE task_events ENABLE ELECTRIC;
ALTER TABLE task_submission ENABLE ELECTRIC;
ALTER TABLE task_members_messages ENABLE ELECTRIC;
ALTER TABLE task_members_students ENABLE ELECTRIC;
ALTER TABLE task_members ENABLE ELECTRIC;
ALTER TABLE tasks ENABLE ELECTRIC;
ALTER TABLE tasks_to_learning_goals ENABLE ELECTRIC;
ALTER TABLE tasks_to_tags ENABLE ELECTRIC;
ALTER TABLE trail_content ENABLE ELECTRIC;
ALTER TABLE trail_contribution ENABLE ELECTRIC;
ALTER TABLE trails ENABLE ELECTRIC;
ALTER TABLE users ENABLE ELECTRIC;
ALTER TABLE verification_token ENABLE ELECTRIC;