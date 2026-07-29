SELECT TOP (10) [e].[id]
      ,[e].[dni]
      ,[e].[cuit]
      ,[e].[name]
      ,[e].[address]
  FROM [entity] [e]
  INNER JOIN [customer] [c] ON [c].[id] = [e].[id]
  WHERE [e].[isInactive] = 0
  AND [e].[cuit] like @cuit + '%';