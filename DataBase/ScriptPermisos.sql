USE [Gestion_Stock]
GO

INSERT INTO [dbo].[permission]
           ([name]
		   ,[key]
		   ,[enumPermission])	
     VALUES
           ('ViewUser','ViewUser',1),('EditUser', 'EditUser',2),('DeleteUser', 'DeleteUser',3),('CreateUser', 'CreateUser',4),
		   ('ViewBrand','ViewBrand',5),('CreateBrand','CreateBrand',6),('EditBrand','EditBrand',7),
		   ('ViewCategory','ViewCategory',8),('CreateCategory','CreateCategory',9),('EditCategory','EditCategory',10),
		   ('ViewCustomer','ViewCustomer',11),('CreateCustomer','CreateCustomer',12),('EditCustomer','EditCustomer',13),
		   ('ViewEntity','ViewEntity',14),('CreateEntity','CreateEntity',15),('EditEntity','EditEntity',16),
		   ('GetInvoice','GetInvoice',17),('CreateInvoice','CreateInvoice',18),
		   ('ViewProduct','ViewProduct',19),('CreateProduct','CreateProduct',20),('EditProduct','EditProduct',21),
		   ('ViewSupplier','ViewSupplier',22),('EditSupplier','EditSupplier',23),('CreateSupplier','CreateSupplier',24),
		   ('ViewOrderSupplier','ViewOrderSupplier',25),('CreateOrderSupplier','CreateOrderSupplier',26),('EditOrderSupplier','EditOrderSupplier',27),
		   ('ListUpdatePrice','ListUpdatePrice',28),('EditUpdatePrice','EditUpdatePrice',29), ('EditUpdatePrice','EditUpdatePrice',30), ('EditUpdatePrice','EditUpdatePrice',31),
		   ('ListIva','ListIva',32),
		   ('GetPeriod','GetPeriod',33),('CreatePeriod','CreatePeriod',34),('EditPeriod','EditPeriod',35),('DeletePeriod','DeletePeriod',36),
		   ('GetMemo','GetMemo', 37),('CreateMemo','CreateMemo',38),('RolControl','RolControl',39)
GO