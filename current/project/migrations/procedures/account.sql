CREATE PROCEDURE create_account(IN in_user VARCHAR(99), IN in_password VARCHAR(99), IN in_company_name VARCHAR(99), IN in_role VARCHAR(99))
BEGIN

    INSERT INTO tbl_users(user, password)
    VALUES(in_user, in_password);

    INSERT INTO tbl_roles(user_id, company_name, role)
    VALUES(LAST_INSERT_ID(), in_company_name, in_role);

END;;