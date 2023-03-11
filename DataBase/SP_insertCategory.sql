USE [Ordbox]
GO

/****** Object:  StoredProcedure [dbo].[insertCategory]    Script Date: 24/2/2023 11:50:39 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


Create PROCEDURE [dbo].[insertCategory]
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
		SET IDENTITY_INSERT [Ordbox].[dbo].[category] ON

INSERT INTO [Ordbox].[dbo].[category]
    (id, description)

  SELECT [Id]
      ,[Descripcion]
  FROM [DBDante].[dbo].[MaestroProducto]

SET IDENTITY_INSERT [Ordbox].[dbo].[category] OFF
  
END
GO


