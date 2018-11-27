CREATE TABLE user_tbl (
	username varchar(40) NOT NULL UNIQUE,
	user_id serial NOT NULL,
	passw text NOT NULL,
  email_address varchar(255) NOT NULL UNIQUE,
	firstname varchar(40) NULL,
	lastname varchar(40) NULL,
	CONSTRAINT user_tbl_pk PRIMARY KEY (user_id)
);

CREATE TABLE expense_types_tbl (
	expense_type_id serial NOT NULL,
	expense_type varchar(60) NULL,
	CONSTRAINT expense_types_tbl_pkey PRIMARY KEY (expense_type_id)
);

CREATE TABLE individual_expense_tbl (
	expense_id serial NOT NULL,
	expense_type_id serial NOT NULL,
	user_id serial NOT NULL,
	description text NOT NULL,
	cost_amount numeric NOT NULL DEFAULT 0.0,
	CONSTRAINT individual_expense_tbl_pk PRIMARY KEY (expense_id),
	CONSTRAINT individual_expense_tbl_expense_types_tbl_fk FOREIGN KEY (expense_type_id) REFERENCES expense_types_tbl(expense_type_id) ON UPDATE CASCADE,
	CONSTRAINT individual_expense_tbl_user_tbl_fk FOREIGN KEY (user_id) REFERENCES user_tbl(user_id) ON UPDATE CASCADE
);

CREATE TABLE expense_budget_tbl (
	user_id serial NOT NULL,
	expense_type_id serial NOT NULL,
	expense_budget numeric NOT NULL DEFAULT 0.0,
	CONSTRAINT expense_budget_tbl_pk PRIMARY KEY (user_id, expense_type_id),
	CONSTRAINT expense_budget_tbl_expense_types_tbl_fk FOREIGN KEY (expense_type_id) REFERENCES expense_types_tbl(expense_type_id) ON UPDATE CASCADE,
	CONSTRAINT expense_budget_tbl_user_tbl_fk FOREIGN KEY (user_id) REFERENCES user_tbl(user_id) ON UPDATE CASCADE
);

CREATE TABLE account_tbl (
	account_id serial NOT NULL,
	user_id serial NOT NULL,
	account_type varchar(40) NOT NULL,
	balance numeric NOT NULL DEFAULT 0.0,
	balance_goal numeric NOT NULL DEFAULT 0.0,
	monthly_payment numeric NOT NULL DEFAULT 0.0,
	CONSTRAINT account_tbl_pk PRIMARY KEY (account_id),
	CONSTRAINT account_tbl_user_tbl_fk FOREIGN KEY (user_id) REFERENCES user_tbl(user_id) ON UPDATE CASCADE
);
