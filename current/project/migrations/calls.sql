-- CALLS
-- CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 5 SECOND), 1, 0, "1 HELLO WORLD!", "timoy", "helsi");
-- CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 SECOND), 1, 0, "2 MERRY CHRISTMAS!", "timoy", "helsi");
-- CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 15 SECOND), 1, 0, "3 HAPPY NEW YEAR!", "bensoy", "timoy");
-- CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 20 SECOND), 1, 0, "4 PIT SENIOR!", "bensoy", "helsi");
-- CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 25 SECOND), 1, 0, "5 GOOD MORNING!", "timoy", "bensoy");
-- CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 SECOND), 1, 0, "6 HAPPY HOLIDAYS!", "bensoy", "timoy");
-- CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 35 SECOND), 1, 0, "7 WELCOME BACK!", "timoy", "helsi");
-- CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 40 SECOND), 1, 0, "8 CONGRATULATIONS!", "helsi", "bensoy");
-- CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 45 SECOND), 1, 0, "9 HAVE A GREAT DAY!", "bensoy", "timoy");
-- CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 50 SECOND), 1, 0, "10 GOOD NIGHT!", "helsi", "timoy");
-- CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 55 SECOND), 1, 0, "11 SEE YOU SOON!", "timoy", "bensoy");
-- CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 60 SECOND), 1, 0, "12 SAFE TRAVELS!", "bensoy", "helsi");
-- CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 65 SECOND), 1, 0, "13 STAY STRONG!", "helsi", "timoy");
-- CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 70 SECOND), 1, 0, "14 THANK YOU!", "timoy", "bensoy");
-- CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 75 SECOND), 1, 0, "15 C", "helsi", "helsi");
-- CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 80 SECOND), 1, 0, "16 C++", "helsi", "helsi");
-- CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 85 SECOND), 1, 0, "17 C#", "helsi", "helsi");
-- CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 90 SECOND), 1, 0, "18 Java", "helsi", "helsi");

CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 90 SECOND), 1, 0, "HELLO WORLD!", "IBC admin", "Jet admin");
CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 90 SECOND), 1, 0, "HELLO LORD!", "Jet admin", "IBC admin");


-- CALL get_message("helsi", 1);
-- GETTING CONVERSATIONS HEAD
-- SELECT "CHAT HOME" AS _;
-- CALL get_conversations_heads("helsi");

-- -- GETTING CONVERSATION
-- SELECT "helsi & timoy" AS _;
-- CALL get_conversation("helsi", "timoy");

-- -- RELOCATING CONVERSATION TO LOGS
-- SELECT "relocating conversation to logs" AS _;
-- CALL relocate_conversation("timoy", "helsi");

-- -- GETTING LOGS TO SPECIFIC CONVERSATION
-- SELECT "conversation logs" AS _;
-- CALL get_conversation_logs(1);

-- -- GETTING ALL CONVERSATIONS HEAD LOGS
-- SELECT "conversation heads" AS _;
-- CALL get_conversations_heads_logs();

-- SELECT * FROM tbl_users;
-- SELECT * FROM tbl_messages;
-- SELECT * FROM tbl_messages_head;
-- SELECT * FROM tbl_messages_head_logs;
-- SELECT * FROM tbl_messages_logs;

-- SHOW PROCEDURE STATUS WHERE DB = DATABASE();
