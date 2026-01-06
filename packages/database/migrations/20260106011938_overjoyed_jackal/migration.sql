CREATE TABLE `tasks` (
	`name` text NOT NULL,
	`version` text NOT NULL,
	`previous_version` text NOT NULL,
	`invoker` text DEFAULT 'watcher-service' NOT NULL,
	`status` text DEFAULT 'created' NOT NULL,
	`verdict` text DEFAULT 'unknown' NOT NULL,
	`summary` text,
	`updated_at` integer DEFAULT (unixepoch('now', 'subsec') * 1000) NOT NULL,
	`created_at` integer DEFAULT (unixepoch('now', 'subsec') * 1000) NOT NULL,
	CONSTRAINT `tasks_pk` PRIMARY KEY(`name`, `version`, `previous_version`)
);
