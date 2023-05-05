USE [Ordbox]
GO

/****** Object:  Table [dbo].[deliveryNotes_details]    Script Date: 27/04/2023 10:28:31 a. m. ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[deliveryNotes_details](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[deliveryNotes_id] [bigint] NOT NULL,
	[deliveryNotes_number] [bigint] NOT NULL,
	[product_id] [bigint] NOT NULL,
	[quantity] [int] NOT NULL,
	[price] [decimal](18, 2) NOT NULL,
	[product_name] [nvarchar](max) NULL,
 CONSTRAINT [PK_deliveryNotes_details] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[deliveryNotes_details]  WITH CHECK ADD  CONSTRAINT [FK_deliveryNotes_details_delivery_notes_deliveryNotes_id] FOREIGN KEY([deliveryNotes_id])
REFERENCES [dbo].[delivery_notes] ([id])
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[deliveryNotes_details] CHECK CONSTRAINT [FK_deliveryNotes_details_delivery_notes_deliveryNotes_id]
GO


