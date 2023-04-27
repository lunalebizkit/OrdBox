USE [Ordbox]
GO

/****** Object:  Table [dbo].[budget]    Script Date: 27/04/2023 10:25:17 a. m. ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[budget](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[user_id] [bigint] NOT NULL,
	[budget_number] [bigint] NOT NULL,
	[customer_name] [nvarchar](max) NULL,
	[customer_address] [nvarchar](max) NULL,
	[observation] [nvarchar](max) NULL,
	[dateTime] [datetime2](7) NOT NULL,
	[total] [decimal](18, 2) NOT NULL,
	[payment] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_budget] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[budget] ADD  DEFAULT (N'') FOR [payment]
GO

ALTER TABLE [dbo].[budget]  WITH CHECK ADD  CONSTRAINT [FK_budget_user_user_id] FOREIGN KEY([user_id])
REFERENCES [dbo].[user] ([id])
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[budget] CHECK CONSTRAINT [FK_budget_user_user_id]
GO


