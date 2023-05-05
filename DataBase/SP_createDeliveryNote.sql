USE [Ordbox]
GO

/****** Object:  Table [dbo].[delivery_notes]    Script Date: 27/04/2023 10:27:40 a. m. ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[delivery_notes](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[deliveryNotes_number] [bigint] NOT NULL,
	[dateTime] [datetime2](7) NOT NULL,
	[supplier_id] [bigint] NOT NULL,
	[status_id] [bigint] NOT NULL,
	[cancelled] [nvarchar](max) NULL,
	[paid] [nvarchar](max) NOT NULL,
	[observation] [nvarchar](max) NULL,
	[import_total] [decimal](18, 2) NOT NULL,
	[supplier_address] [nvarchar](max) NULL,
	[supplier_cuit] [nvarchar](max) NULL,
	[supplier_name] [nvarchar](max) NULL,
 CONSTRAINT [PK_delivery_notes] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


