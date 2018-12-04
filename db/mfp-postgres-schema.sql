-- Drop table

-- DROP TABLE public.user_tbl

CREATE TABLE user_tbl (
	username varchar(40) NOT NULL,
	user_id serial NOT NULL,
	passw text NOT NULL,
	firstname varchar(40) NULL,
	lastname varchar(40) NULL,
	email_address varchar(255) NOT NULL,
	email_verified bool NULL DEFAULT false,
	CONSTRAINT user_tbl_email_address_key UNIQUE (email_address),
	CONSTRAINT user_tbl_pk PRIMARY KEY (user_id)
);
CREATE UNIQUE INDEX user_tbl_username_idx ON public.user_tbl USING btree (username);


-- Drop table

-- DROP TABLE public.expense_types_tbl

CREATE TABLE expense_types_tbl (
	expense_type_id serial NOT NULL,
	expense_type varchar(60) NULL,
	CONSTRAINT expense_types_tbl_pkey PRIMARY KEY (expense_type_id)
);


-- Drop table

-- DROP TABLE public.individual_expense_tbl

CREATE TABLE individual_expense_tbl (
	expense_id serial NOT NULL,
	expense_type_id serial NOT NULL,
	user_id serial NOT NULL,
	description text NOT NULL,
	cost_amount numeric NOT NULL DEFAULT 0.0,
	"timestamp" timestamp NOT NULL DEFAULT now(),
	account_type text NULL,
	CONSTRAINT individual_expense_tbl_pk PRIMARY KEY (expense_id),
	CONSTRAINT individual_expense_tbl_expense_types_tbl_fk FOREIGN KEY (expense_type_id) REFERENCES expense_types_tbl(expense_type_id) ON UPDATE CASCADE,
	CONSTRAINT individual_expense_tbl_user_tbl_fk FOREIGN KEY (user_id) REFERENCES user_tbl(user_id) ON UPDATE CASCADE
);

-- Drop table

-- DROP TABLE public.individual_income_tbl

CREATE TABLE individual_income_tbl (
	income_id serial NOT NULL,
	account_id int4 NOT NULL,
	description text NOT NULL,
	income_amount numeric NOT NULL DEFAULT 0.0,
	"timestamp" timestamp NOT NULL DEFAULT now(),
	user_id numeric NULL,
	account_type text NULL,
	CONSTRAINT individual_income_tbl_pk PRIMARY KEY (income_id),
	CONSTRAINT individual_income_tbl_account_tbl_fk FOREIGN KEY (account_id) REFERENCES account_tbl(account_id) ON UPDATE CASCADE
);


-- Drop table

-- DROP TABLE public.expense_budget_tbl

CREATE TABLE expense_budget_tbl (
	user_id serial NOT NULL,
	expense_type_id serial NOT NULL,
	expense_budget numeric NOT NULL DEFAULT 0.0,
	CONSTRAINT expense_budget_tbl_pk PRIMARY KEY (user_id, expense_type_id),
	CONSTRAINT expense_budget_tbl_expense_types_tbl_fk FOREIGN KEY (expense_type_id) REFERENCES expense_types_tbl(expense_type_id) ON UPDATE CASCADE,
	CONSTRAINT expense_budget_tbl_user_tbl_fk FOREIGN KEY (user_id) REFERENCES user_tbl(user_id) ON UPDATE CASCADE
);


-- Drop table

-- DROP TABLE public.account_tbl

CREATE TABLE account_tbl (
	account_id serial NOT NULL,
	user_id serial NOT NULL,
	account_type varchar(40) NOT NULL,
	balance numeric NOT NULL DEFAULT 0.0,
	balance_goal numeric NOT NULL DEFAULT 0.0,
	monthly_payment numeric NOT NULL DEFAULT 0.0,
	CONSTRAINT account_tbl_pk PRIMARY KEY (account_id),
	CONSTRAINT unique_user_account UNIQUE (user_id, account_type),
	CONSTRAINT account_tbl_user_tbl_fk FOREIGN KEY (user_id) REFERENCES user_tbl(user_id) ON UPDATE CASCADE
);

-- Drop table

-- DROP TABLE public.user_posts_tbl

CREATE TABLE user_posts_tbl (
	user_id int4 NOT NULL,
	post_text text NULL,
	"timestamp" timestamp NOT NULL DEFAULT now(),
	user_posts_id serial NOT NULL,
	CONSTRAINT user_posts_tbl_pk PRIMARY KEY (user_posts_id),
	CONSTRAINT user_posts_tbl_user_tbl_fk FOREIGN KEY (user_id) REFERENCES user_tbl(user_id) ON UPDATE CASCADE ON DELETE CASCADE
);
