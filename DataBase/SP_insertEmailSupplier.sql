USE [Ordbox]
GO

/****** Object:  StoredProcedure [dbo].[insertEmailSupplier]    Script Date: 24/2/2023 11:44:59 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[insertEmailSupplier] 

AS
BEGIN

		SET NOCOUNT ON;	
		insert [Ordbox].[dbo].[email_entity] (entity_id, email)			

  			SELECT [EntidadId] , [correo]
  		FROM [BaseRDante].[dbo].[Entidades] where [BaseRDante].[dbo].[Entidades].tipo = 2
 		and [BaseRDante].[dbo].[Entidades].[correo] IS NOT NULL  and 
		 LEN(CAST([BaseRDante].[dbo].[Entidades].[correo] AS NVARCHAR)) > 0 and [BaseRDante].[dbo].[Entidades].[activo] = 1;


		 insert [Ordbox].[dbo].[email_entity] (entity_id, email)
		
		SELECT [EntidadId] , [correouno]
  		FROM [BaseRDante].[dbo].[Entidades] where [BaseRDante].[dbo].[Entidades].tipo = 2
 		and [BaseRDante].[dbo].[Entidades].[correouno] IS NOT NULL  and 
 		LEN(CAST([BaseRDante].[dbo].[Entidades].[correouno] AS NVARCHAR)) > 0 and [BaseRDante].[dbo].[Entidades].[activo] = 1;

END
GO


