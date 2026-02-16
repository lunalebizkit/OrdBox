USE [Ordbox]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [quittance_product_details](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[quittance_id] [bigint] NOT NULL,
	[product_id] [bigint] NOT NULL,
	[product_name] [nvarchar](max) NULL,
	[product_code] [nvarchar](max) NULL,
	[quantity] [int] NOT NULL,
	[price] [decimal](18, 2) NOT NULL,
	[iva] [decimal](18, 2) NULL,
 CONSTRAINT [PK_quittance_product_details] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [quittance_product_details]  WITH CHECK ADD  CONSTRAINT [FK_quittance_product_details_product_product_id] FOREIGN KEY([product_id])
REFERENCES [product] ([id])
ON DELETE CASCADE
GO

ALTER TABLE [quittance_product_details] CHECK CONSTRAINT [FK_quittance_product_details_product_product_id]
GO

ALTER TABLE [quittance_product_details]  WITH CHECK ADD  CONSTRAINT [FK_quittance_product_details_quittance_quittance_id] FOREIGN KEY([quittance_id])
REFERENCES [quittance] ([id])
ON DELETE CASCADE
GO

ALTER TABLE [quittance_product_details] CHECK CONSTRAINT [FK_quittance_product_details_quittance_quittance_id]
GO


