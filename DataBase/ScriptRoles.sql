USE [Ordbox]
GO

INSERT INTO [dbo].[rol]
           ([name]
           ,[key])
     VALUES
		('admin',1),('vendedor',2),('contador',3),('supervisor',4)
GO



INSERT INTO [dbo].[user]
           ([first_name]
           ,[last_name]
           ,[user_name]
           ,[password]
           ,[email]
           ,[is_deleted]
           ,[role_id])
     VALUES
           ('admin'
           ,'admin'
           ,'admin'
           ,'$MYHASH$V1$100$TwBIBubLeyTiWSW8Lbuqboa2RCT4MdSpalxxSQIvIGC4mLGw'
           ,'admin'
           ,0
           ,1)
GO

