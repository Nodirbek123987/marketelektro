TRUNCATE TABLE products RESTART IDENTITY;

-- Re-insert all products from the updated catalog
-- (448 products total, inserting in batches)