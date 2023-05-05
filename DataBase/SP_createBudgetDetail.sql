USE [Ordbox]
GO

/****** Object:  Table [dbo].[budget_detail]    Script Date: 27/04/2023 10:26:57 a. m. ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[budget_detail](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[budget_id] [bigint] NOT NULL,
	[product_id] [bigint] NOT NULL,
	[product_name] [nvarchar](max) NULL,
	[product_code] [nvarchar](max) NULL,
	[quantity] [int] NOT NULL,
	[price] [decimal](18, 2) NOT NULL,
 CONSTRAINT [PK_budget_detail] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[budget_detail]  WITH CHECK ADD  CONSTRAINT [FK_budget_detail_budget_budget_id] FOREIGN KEY([budget_id])
REFERENCES [dbo].[budget] ([id])
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[budget_detail] CHECK CONSTRAINT [FK_budget_detail_budget_budget_id]
GO

ALTER TABLE [dbo].[budget_detail]  WITH CHECK ADD  CONSTRAINT [FK_budget_detail_product_product_id] FOREIGN KEY([product_id])
REFERENCES [dbo].[product] ([id])
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[budget_detail] CHECK CONSTRAINT [FK_budget_detail_product_product_id]
GO


