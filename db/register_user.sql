INSERT INTO users
(is_admin, username, hash)
VALUES($1, $2, $3);

select id, username, is_admin
from users
where username = $2
 