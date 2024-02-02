 SELECT TOP(1) * FROM [product] P
  INNER JOIN [brand] B
  ON P.brand_id = B.id
  WHERE P.id = @productid
  AND P.[is_deleted] = 0