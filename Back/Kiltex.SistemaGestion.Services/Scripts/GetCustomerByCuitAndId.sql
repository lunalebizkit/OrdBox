SELECT TOP(1)
	[e].[id]
    FROM entity e
    INNER JOIN customer c ON c.[id] = [e].[id]
    WHERE [e].[id] = @id AND REPLACE([e].[cuit], '-', '') = @cuit;