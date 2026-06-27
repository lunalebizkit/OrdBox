USE [Ordbox]
GO

/****** Object:  StoredProcedure [dbo].[insertSupplier]    Script Date: 24/2/2023 11:43:27 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[insertSupplier]

AS
BEGIN

	SET NOCOUNT ON;
		SET IDENTITY_INSERT [Ordbox].[dbo].[entity] ON;
	
  
/*Inserto la entidad*/
	insert [Ordbox].[dbo].[entity]
	(id,dni,cuit,name,address)

	SELECT [EntidadId]
      ,[dni]
	   ,[CUIT]
      ,[Nombre]
      ,[Domicilio]     
  FROM [BaseRDante].[dbo].[Entidades] where [BaseRDante].[dbo].[Entidades].tipo = 2;

	
/*Inserto el Proveedor*/
	insert [Ordbox].[dbo].[supplier]
	(id, observation)
	SELECT [EntidadId]    
      ,[observaciones]       
	  FROM [BaseRDante].[dbo].[Entidades] where [BaseRDante].[dbo].[Entidades].tipo = 2
	  and [BaseRDante].[dbo].[Entidades].[activo] = 1;

	  
/*Inserto Email del Proveedor*/

	  insert [Ordbox].[dbo].[email_entity] (entity_id, email)			
		
  			SELECT [EntidadId]
      , [correo]
  FROM [BaseRDante].[dbo].[Entidades] where [BaseRDante].[dbo].[Entidades].tipo = 2
 and [BaseRDante].[dbo].[Entidades].[correo] IS NOT NULL  and 
 LEN(CAST([BaseRDante].[dbo].[Entidades].[correo] AS NVARCHAR)) > 0 and [BaseRDante].[dbo].[Entidades].[activo] = 1;

 /*Inserto Email del Proveedor de otro campo, la DB original tiene dos campos*/
		 insert [Ordbox].[dbo].[email_entity] (entity_id, email)
		
		SELECT [EntidadId] , [correouno]
  		FROM [BaseRDante].[dbo].[Entidades] where [BaseRDante].[dbo].[Entidades].tipo = 2
 		and [BaseRDante].[dbo].[Entidades].[correouno] IS NOT NULL  and 
 		LEN(CAST([BaseRDante].[dbo].[Entidades].[correouno] AS NVARCHAR)) > 0 and [BaseRDante].[dbo].[Entidades].[activo] = 1;


		SET IDENTITY_INSERT [Ordbox].[dbo].[entity] OFF;
	
END
GO


