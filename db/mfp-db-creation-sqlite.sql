BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS `user_tbl` (
	`user_ID`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`username`	TEXT NOT NULL UNIQUE,
	`password`	TEXT NOT NULL,
	`firstName`	TEXT NOT NULL,
	`lastName`	TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS `individual_expense_tbl` (
	`expense_ID`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`expense_type_ID`	INTEGER NOT NULL,
	`user_ID`	INTEGER NOT NULL,
	`description`	TEXT,
	`cost`	REAL DEFAULT 0.0,
	FOREIGN KEY(`expense_type_ID`) REFERENCES `expense_types_tbl`(`expense_type_ID`) ON UPDATE CASCADE,
	FOREIGN KEY(`user_ID`) REFERENCES `user_tbl`(`user_ID`) ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS `expense_types_tbl` (
	`expense_type_ID`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`type`	TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS `expense_budget_tbl` (
	`user_ID`	INTEGER NOT NULL,
	`expense_type_ID`	INTEGER NOT NULL,
	`expense_budget`	REAL DEFAULT 0.0,
	FOREIGN KEY(`expense_type_ID`) REFERENCES `expense_types_tbl`(`expense_type_ID`) ON UPDATE CASCADE,
	FOREIGN KEY(`user_ID`) REFERENCES `user_tbl`(`user_ID`) ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS `account_tbl` (
	`account_ID`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`user_ID`	INTEGER NOT NULL,
	`type`	TEXT NOT NULL,
	`balance`	REAL DEFAULT 0.0,
	`balance_goal`	REAL DEFAULT 0.0,
	`monthly_payment`	REAL DEFAULT 0.0,
	FOREIGN KEY(`user_ID`) REFERENCES `user_tbl`(`user_ID`) ON UPDATE CASCADE
);
COMMIT;
