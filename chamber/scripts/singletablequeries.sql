-- STEP 1
USE v_art;

SELECT * FROM artist;


-- query 1
INSERT INTO artist VALUE
(NULL,'Johannes', NULL, 'Vermeer', 1632, 1674, 'Netherlands', 'n');


-- query 2
SELECT fname AS 'First Name', mname AS 'Middle Name', lname AS 'Last Name', dob AS 'Date of Birth', dod AS 'Date of Death', country AS 'Country', local AS 'Local'
FROM artist
ORDER BY lname ASC;


-- query 3
UPDATE artist 
SET dod = 1675
WHERE artist_id = 10;

-- query 4
DELETE FROM artist
WHERE artist_id = 10;


-- STEP 2

USE bike;

SELECT * FROM customer;

-- query 5
SELECT first_name, last_name, phone
FROM customer
WHERE state = 'TX'
LIMIT 9;

-- query 6

SELECT product_name, list_price, list_price - 500 AS 'Discount Price'
FROM product
WHERE list_price >= 5000
ORDER BY list_price DESC;

-- query 7
SELECT first_name, last_name, email
FROM staff
WHERE store_id > 1;


-- query 8
SELECT product_name, model_year, list_price 
FROM product
WHERE product_name REGEXP 'spider';


-- query 9
SELECT product_name, list_price
FROM product
WHERE list_price BETWEEN 500 AND 550
ORDER BY list_price ASC;

-- query 10
SELECT first_name, last_name, phone, street, city, state, zip_code
FROM customer
WHERE phone IS NOT NULL
  AND (city REGEXP 'ach|och')  OR last_name = 'William'
LIMIT 5;

-- query 11
SELECT * FROM product;
SELECT product_id,
       TRIM(REGEXP_REPLACE(product_name, '(\\s\\d{4})+$', '')) AS product_name
FROM product
ORDER BY product_id
LIMIT 14;

-- query 12
SELECT * FROM product;

SELECT product_name,
       CONCAT('$', FORMAT(list_price / 3, 2)) AS payment
FROM product
WHERE product_name LIKE '%2019%';


-- query 13

USE magazine;

SELECT magazineName, ROUND(magazinePrice - magazinePrice * 3/100, 2) AS '3% off'
FROM magazine;

-- query 14
SELECT subscriberKey,
       ROUND(DATEDIFF('2020-12-20', subscriptionStartDate) / 365) AS years_subscribed
FROM subscription;

-- query 15
SELECT subscriptionStartDate,
       subscriptionLength,
       DATE_FORMAT(
         DATE_ADD(subscriptionStartDate, INTERVAL subscriptionLength MONTH),
         '%M %e, %Y'
       ) AS subscriptionEndDate
FROM subscription;


