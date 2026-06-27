USE [Ordbox]
GO

/****** Object:  StoredProcedure [dbo].[insertCustomer]    Script Date: 24/2/2023 11:42:50 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[insertCustomer] 
	
AS
BEGIN

	SET NOCOUNT ON;
		SET IDENTITY_INSERT [Ordbox].[dbo].[entity] ON;
	
  

	insert [Ordbox].[dbo].[entity]
	(id,dni,cuit,name,address)

	SELECT [EntidadId]
      ,[dni]
	   ,[CUIT]
      ,[Nombre]
      ,[Domicilio]     
  FROM [BaseRDante].[dbo].[Entidades] where [BaseRDante].[dbo].[Entidades].tipo = 1  
  and [BaseRDante].[dbo].[Entidades].activo =1;

    insert [Ordbox].[dbo].[email_entity]
	( entity_id,email)

	SELECT [EntidadId]
      , [correo]
  FROM [BaseRDante].[dbo].[Entidades] where [BaseRDante].[dbo].[Entidades].tipo = 1 
  and [BaseRDante].[dbo].[Entidades].[correo] IS NOT NULL  and 
 LEN(CAST([BaseRDante].[dbo].[Entidades].[correo] AS NVARCHAR)) > 0
 and [BaseRDante].[dbo].[Entidades].activo =1;

	
	insert [Ordbox].[dbo].[customer]
	(id, observation)
	SELECT [EntidadId] ,[observaciones]
          
	  FROM [BaseRDante].[dbo].[Entidades] where [BaseRDante].[dbo].[Entidades].tipo = 1
	  and [BaseRDante].[dbo].[Entidades].activo =1;

		SET IDENTITY_INSERT [Ordbox].[dbo].[entity] OFF;


END
GO


