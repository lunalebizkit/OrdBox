USE [Ordbox]
GO

/****** Object:  StoredProcedure [dbo].[insertBrand]    Script Date: 24/2/2023 11:37:08 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[insertBrand]

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET IDENTITY_INSERT [Ordbox].[dbo].[brand] ON

INSERT INTO [Ordbox].[dbo].[brand]
    (id, description)

  SELECT [Id]
      ,[Descripcion]
  FROM [BaseRDante].[dbo].[Marcas]

SET IDENTITY_INSERT [Ordbox].[dbo].[brand] OFF
 
END
GO


