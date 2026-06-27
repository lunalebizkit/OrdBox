USE [Ordbox]
GO

/****** Object:  StoredProcedure [dbo].[insertProduct]    Script Date: 24/2/2023 11:45:21 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[insertProduct]
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
		SET NOCOUNT ON;
	-- Inserto Producto Inactivo
	SET IDENTITY_INSERT [Ordbox].[dbo].[product] ON;
	insert [Ordbox].[dbo].[product]
	( [id]
      ,[description]
      ,[code]
      ,[category_id]
      ,[brand_id]
      ,[is_deleted]
      ,[quantity]
      ,[purchase_price]
      ,[sale_price]
      ,[sale_percentage]
      ,[card_sale_price]
      ,[card_sale_percentage]
      ,[cash_sale_price]
      ,[cash_sale_percentage]
      ,[point_order]
      ,[observation]
      ,[supplier_id])


  SELECT p.[ProductoId]
      ,p.[Nombre]
	  ,pp.[Codigo]
      ,p.[MaestroProductoId]
      ,pp.[MarcaId]
	  ,1
	  ,pp.[Cantidad]
      ,pp.[PrecioCompra]
      ,pp.[PrecioVenta]
      ,pp.[PorcentajeLista]
	    ,pp.[PrecioTarjeta]
		 ,pp.[PorcentajeTarjeta]
      ,pp.[PrecioContado]
      ,pp.[PorcentajeContado]
	    ,pp.[Cantidad]
	  ,''
    , pp.[EntidadId]
     
  FROM [BaseRDante].[dbo].[ProveedoresProductos] pp

  join [BaseRDante].[dbo].[Productos] p
  on p.ProductoId = pp.ProductoId

    join [BaseRDante].[dbo].[Marcas] m
	on m.Id = pp.MarcaId

	where p.Activo= 0
	   	    
	SET IDENTITY_INSERT [Ordbox].[dbo].[product] OFF;
		 -- Insero Productos Activos
		 	SET IDENTITY_INSERT [Ordbox].[dbo].[product] ON;
	insert [Ordbox].[dbo].[product]
	( [id]
      ,[description]
      ,[code]
      ,[category_id]
      ,[brand_id]
      ,[is_deleted]
      ,[quantity]
      ,[purchase_price]
      ,[sale_price]
      ,[sale_percentage]
      ,[card_sale_price]
      ,[card_sale_percentage]
      ,[cash_sale_price]
      ,[cash_sale_percentage]
      ,[point_order]
      ,[observation]
      ,[supplier_id])


  SELECT p.[ProductoId]
      ,p.[Nombre]
	  ,pp.[Codigo]
      ,p.[MaestroProductoId]
      ,pp.[MarcaId]
	  ,0
	  ,pp.[Cantidad]
      ,pp.[PrecioCompra]
      ,pp.[PrecioVenta]
      ,pp.[PorcentajeLista]
	    ,pp.[PrecioTarjeta]
		 ,pp.[PorcentajeTarjeta]
      ,pp.[PrecioContado]
      ,pp.[PorcentajeContado]
	    ,pp.[Cantidad]
	  ,''
    , pp.[EntidadId]
     
  FROM [BaseRDante].[dbo].[ProveedoresProductos] pp

  join [BaseRDante].[dbo].[Productos] p
  on p.ProductoId = pp.ProductoId

    join [BaseRDante].[dbo].[Marcas] m
	on m.Id = pp.MarcaId
	   	    
			where p.Activo= 1
		SET IDENTITY_INSERT [Ordbox].[dbo].[product] OFF;
END
GO


